/**
 * summarizeWithOpenAi.ts
 *
 * OpenAI Responses API — two-stage flow:
 *   1) gpt-5-nano  → extract schema-bound facts (fast, low cost, grounded)
 *   2) gpt-5-mini  → write a 120–180 word adoption bio (higher-quality prose)
 *
 * Reliability upgrades:
 *   - Lazy client init so .env is loaded before reading OPENAI_API_KEY
 *   - Structured outputs via `text.format: { type: 'json_schema', ... }`
 *   - Robust readers: prefer `output_parsed` for JSON; else walk `output[].content[].text`
 *   - Continuation helper: uses `previous_response_id` if `status === "incomplete"` due to `max_output_tokens`
 *   - Lower `reasoning.effort` + `text.verbosity` so tokens go to visible output (not hidden reasoning)
 *   - No `temperature`/`top_p` knobs (unsupported on some GPT-5 models)
 *   - Optional debug logs with `DEBUG_OPENAI=1`
 *
 * Inputs:
 *   - transcript: raw Whisper transcript (verbatim)
 *   - labels?: optional CLIP/user labels like ["cat", "short haired"]
 *
 * Output:
 *   - Polished adoption profile bio text
 */

import { isObject } from '@williamthorsen/toolbelt.objects';
import OpenAI from 'openai';

/* ─────────────────────────────── Env / Client ────────────────────────────── */

let cachedClient: OpenAI | undefined;

/** Lazy-initialize the OpenAI SDK so your dotenv loader has run first. */
function getOpenAI(): OpenAI {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.OPENAI_API_KEY;
  if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    throw new Error('OPENAI_API_KEY is missing. Ensure ai-host loads the root .env before use.');
  }
  cachedClient = new OpenAI({ apiKey });
  return cachedClient;
}

const DEBUG = process.env.DEBUG_OPENAI === '1';

/* ──────────────────────────────── Data model ─────────────────────────────── */

export interface AnimalFacts {
  name?: string;
  species?: string; // e.g., "cat", "dog"
  age?: string; // free text like "2 years"
  size?: string; // "small" | "medium" | "large" | free text
  coat_length?: 'short' | 'medium' | 'long' | string;
  likes?: string[];
  dislikes?: string[];
  temperament?: string[];
  medical?: string;
  adoption_notes?: string;
  red_flags?: string[];
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

/** Coerce parsed JSON into a safe `AnimalFacts` (drop null/empty values). */
function coerceFacts(v: unknown): AnimalFacts {
  const out: AnimalFacts = {};
  if (!isObject(v)) return out;

  const str = (x: unknown) => (typeof x === 'string' && x.trim().length > 0 ? x.trim() : undefined);
  const arr = (x: unknown) => (isStringArray(x) && x.length > 0 ? x : undefined);

  const rec: any = v; // using 'any' here avoids type assertions on every field

  const name = str(rec.name);
  if (name) out.name = name;

  const species = str(rec.species);
  if (species) out.species = species;

  const age = str(rec.age);
  if (age) out.age = age;

  const size = str(rec.size);
  if (size) out.size = size;

  const coat = str(rec.coat_length);
  if (coat) out.coat_length = coat;

  const likes = arr(rec.likes);
  if (likes) out.likes = likes;

  const dislikes = arr(rec.dislikes);
  if (dislikes) out.dislikes = dislikes;

  const temperament = arr(rec.temperament);
  if (temperament) out.temperament = temperament;

  const medical = str(rec.medical);
  if (medical) out.medical = medical;

  const adoption_notes = str(rec.adoption_notes);
  if (adoption_notes) out.adoption_notes = adoption_notes;

  const red_flags = arr(rec.red_flags);
  if (red_flags) out.red_flags = red_flags;

  return out;
}

/* ───────────────────────────── Labels → hints ───────────────────────────── */

function norm(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replaceAll(/\s+/g, ' ')
    .replaceAll(/\s*-\s*/g, '-');
}

const SPECIES_ALIASES: Record<string, string> = {
  cat: 'cat',
  kitten: 'cat',
  dog: 'dog',
  puppy: 'dog',
  hamster: 'hamster',
  rabbit: 'rabbit',
  bird: 'bird',
  fish: 'fish',
  turtle: 'turtle',
  snake: 'snake',
  lizard: 'lizard',
};

const COAT_ALIASES: Record<string, 'short' | 'medium' | 'long'> = {
  'short-hair': 'short',
  'short hair': 'short',
  'short-haired': 'short',
  'short haired': 'short',
  'medium-hair': 'medium',
  'medium hair': 'medium',
  'medium-haired': 'medium',
  'medium haired': 'medium',
  'long-hair': 'long',
  'long hair': 'long',
  'long-haired': 'long',
  'long haired': 'long',
};

/** Derive species + coat_length from labels (first match wins). */
function deriveSpeciesAndCoat(labels?: string[]): { species?: string; coat_length?: 'short' | 'medium' | 'long' } {
  if (!Array.isArray(labels) || labels.length === 0) return {};
  let species: string | undefined;
  let coat: 'short' | 'medium' | 'long' | undefined;

  for (const raw of labels) {
    const l = norm(raw);
    if (!species && l in SPECIES_ALIASES) species = SPECIES_ALIASES[l];
    if (!coat && l in COAT_ALIASES) coat = COAT_ALIASES[l];
    if (species && coat) break;
  }
  const result: { species?: string; coat_length?: 'short' | 'medium' | 'long' } = {};
  if (species) result.species = species;
  if (coat) result.coat_length = coat;
  return result;
}

/* ───────────────────────── Structured JSON schema ───────────────────────── */

/**
 * For strict structured outputs, the schema must include `required` listing all keys.
 * We allow `null` so the model can return every key while marking unknowns as `null`.
 * We drop null/empty fields in `coerceFacts`.
 */
const ANIMAL_FACTS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: ['string', 'null'] },
    species: { type: ['string', 'null'] },
    age: { type: ['string', 'null'] },
    size: { type: ['string', 'null'] },
    coat_length: { type: ['string', 'null'] },
    likes: { type: ['array', 'null'], items: { type: 'string' } },
    dislikes: { type: ['array', 'null'], items: { type: 'string' } },
    temperament: { type: ['array', 'null'], items: { type: 'string' } },
    medical: { type: ['string', 'null'] },
    adoption_notes: { type: ['string', 'null'] },
    red_flags: { type: ['array', 'null'], items: { type: 'string' } },
  },
  required: [
    'name',
    'species',
    'age',
    'size',
    'coat_length',
    'likes',
    'dislikes',
    'temperament',
    'medical',
    'adoption_notes',
    'red_flags',
  ],
};

/* ─────────────────────── Output readers + utilities ─────────────────────── */

/** Build AI directive based on selected language. */
interface GenerateOptions { outputLanguage?: 'auto' | string }

function buildLanguageDirective(options?: GenerateOptions): string {
  if (options?.outputLanguage === 'auto') {
    return 'Write the entire bio in the dominant language of SOURCE_TRANSCRIPT.';
  }
  if (options?.outputLanguage) {
    return `Write the entire bio in ${options.outputLanguage}.`;
  }
  return 'Write the entire bio in English.';
}

/** Collect all assistant-visible text from a Responses payload. */
function collectText(res: any): string {
  if (typeof res?.output_text === 'string' && res.output_text.trim().length > 0) {
    return res.output_text;
  }
  let buf = '';
  if (Array.isArray(res?.output)) {
    for (const item of res.output) {
      if (Array.isArray(item?.content)) {
        for (const c of item.content) {
          if (typeof c?.text === 'string') buf += c.text;
        }
      }
      if (typeof item?.text === 'string') buf += item.text;
    }
  }
  return buf.trim();
}

/** For structured calls, prefer parsed; else try to JSON.parse collected text. */
function collectParsed(res: any): unknown | undefined {
  if (res && 'output_parsed' in res && res.output_parsed !== undefined) {
    return res.output_parsed;
  }
  const text = collectText(res);
  if (text.startsWith('{') || text.startsWith('[')) {
    try {
      return JSON.parse(text);
    } catch {
      /* ignore */
    }
  }
  return undefined;
}

/**
 * Continue a response if it stopped due to max_output_tokens.
 * Uses `previous_response_id` to keep generating. Avoids unsupported knobs.
 */
async function createWithContinuation(baseOpts: Record<string, unknown>, maxContinues = 2): Promise<any> {
  const client = getOpenAI();
  let res = await client.responses.create(baseOpts as any);
  let tries = 0;

  const status = (o: any) => (o && typeof o === 'object' ? o.status : undefined);
  const stopReason = (o: any) =>
    o && typeof o === 'object' && o.incomplete_details ? o.incomplete_details.reason : undefined;
  const respId = (o: any) => (o && typeof o === 'object' ? o.id : undefined);
  const model = (o: any) => (o && typeof o === 'object' && typeof o.model === 'string' ? o.model : undefined);

  while (status(res) === 'incomplete' && stopReason(res) === 'max_output_tokens' && tries < maxContinues) {
    const prevId = respId(res);
    if (!prevId) break;
    if (DEBUG) console.warn('[OpenAI] continuing generation (prev id =', prevId, ')');

    // Continue without resending the whole prompt and without unsupported params.
    res = await client.responses.create({
      previous_response_id: prevId,
      model: model(res) || (typeof baseOpts.model === 'string' ? baseOpts.model : 'gpt-5-mini'),
      // Keep safe knobs only:
      reasoning: baseOpts.reasoning,
      text: baseOpts.text,
      // Do NOT pass temperature/top_p; some models reject them
      max_output_tokens: typeof baseOpts.max_output_tokens === 'number' ? baseOpts.max_output_tokens : 512,
    } as any);

    tries += 1;
  }

  return res;
}

/* ────────────────────────────── Stage A (nano) ───────────────────────────── */

/**
 * Extract strictly-typed facts from transcript (+ optional labels).
 * - Low reasoning effort + low verbosity keep output budget for JSON.
 * - Continuation logic avoids silent truncation.
 */
async function extractFacts(transcript: string, labels?: string[]): Promise<AnimalFacts> {
  if (typeof transcript !== 'string' || transcript.trim().length === 0) {
    throw new Error('Transcript is required.');
  }

  const hints = deriveSpeciesAndCoat(labels);

  const system = [
    'Extract only facts present in the input.',
    'If a detail is unknown, set it to null or an empty array.',
    'Use HINTS and IMAGE_LABELS only to disambiguate species or coat length when consistent with the transcript.',
    'Do not invent details.',
  ].join(' ');

  const parts: string[] = [`HINTS: ${JSON.stringify(hints)}`, 'TRANSCRIPT (verbatim):', transcript];
  if (Array.isArray(labels) && labels.length > 0) {
    parts.unshift(`IMAGE_LABELS: ${labels.join(', ')}`);
  }

  const res = await createWithContinuation({
    model: 'gpt-5-nano',
    input: [
      { role: 'system', content: system },
      { role: 'user', content: parts.join('\n') },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'AnimalFacts',
        description: 'Structured facts extracted from transcript and optional labels.',
        schema: ANIMAL_FACTS_SCHEMA,
        strict: true,
      },
      verbosity: 'low',
    },
    reasoning: { effort: 'low' },
    // No temperature/top_p here
    max_output_tokens: 512, // slightly more headroom than 400
  });

  if (DEBUG) {
    const usage = res && typeof res === 'object' && 'usage' in res ? (res).usage : undefined;
    console.log('[OpenAI] Stage A status:', (res)?.status, 'usage:', usage);
  }

  const parsed = collectParsed(res);
  if (parsed !== undefined) return coerceFacts(parsed);

  // Fallback: empty facts if parsing failed (rare with strict schemas)
  return {};
}

/* ───────────────────────────── Stage B (mini) ───────────────────────────── */

/**
 * Compose a 120–180 word adoption bio.
 * - Prefers FACTS_JSON; may use transcript to fill natural phrasing (without adding facts).
 * - Lower reasoning effort + low verbosity to avoid token starvation.
 * - Continuation logic ensures text completes even if the first hop truncates.
 */
async function composeProfile(
  facts: AnimalFacts,
  transcript: string,
  labels?: string[],
  options?: { outputLanguage?: 'auto' | string },
): Promise<string> {
  const languageDirective = buildLanguageDirective(options);

  const system = [
    'You write short, empathetic adoption bios for shelters.',
    'Voice: warm, professional, friendly. Length: 120–180 words.',
    'Prefer FACTS_JSON. Do not invent details.',
    'If FACTS_JSON is sparse, you may carefully incorporate details from SOURCE_TRANSCRIPT, but never contradict it.',
    'Use IMAGE_LABELS only as secondary hints. Avoid repetition; vary sentence openings.',
    'Conclude with a friendly call to action.',
    languageDirective,
  ].join(' ');

  const parts: string[] = [`FACTS_JSON: ${JSON.stringify(facts)}`, 'SOURCE_TRANSCRIPT (verbatim):', transcript];
  if (Array.isArray(labels) && labels.length > 0) {
    parts.unshift(`IMAGE_LABELS: ${labels.join(', ')}`);
  }

  const res: unknown = await createWithContinuation({
    model: 'gpt-5-mini',
    input: [
      { role: 'system', content: system },
      { role: 'user', content: parts.join('\n') },
    ],
    text: { verbosity: 'low' },
    reasoning: { effort: 'low' },
    // No temperature/top_p here
    max_output_tokens: 640, // give the writer more room than the extractor
  });

  if (DEBUG) {
    const usage: unknown = res && typeof res === 'object' && 'usage' in res ? (res as any).usage : undefined;
    console.log('[OpenAI] Stage B status:', (res as any)?.status, 'usage:', usage);
  }

  const text = collectText(res);
  return text
    .replaceAll(/\s+\n/g, '\n')
    .replaceAll(/\n{3,}/g, '\n\n')
    .trim();
}

/* ─────────────────────────────── Public API ─────────────────────────────── */

/**
 * summarizeWithOpenAI
 *
 * Generates a polished bio. If extractor omits deterministic hints (species/coat)
 * that are clear from labels, we merge them before writing.
 */
export async function summarizeWithOpenAI(
  transcript: string,
  labels?: string[],
  options?: { outputLanguage?: 'auto' | string },
): Promise<string> {
  // Stage A: extract facts
  const facts = await extractFacts(transcript, labels);

  // Merge deterministic hints from labels if extractor omitted them
  const derived = deriveSpeciesAndCoat(labels);
  if (!facts.species && derived.species) facts.species = derived.species;
  if (!facts.coat_length && derived.coat_length) facts.coat_length = derived.coat_length;

  if (DEBUG) console.log('[OpenAI] summarize facts:', JSON.stringify(facts));

  // Stage B: compose final profile
  let profile = await composeProfile(facts, transcript, labels, options);

  // Safety net: if somehow empty, fall back to single-pass generation.
  if (!profile) {
    const languageDirective = buildLanguageDirective(options);

    const fallback = await createWithContinuation({
      model: 'gpt-5-mini',
      input: [
        {
          role: 'system',
          content: [
            'Write a 120–180 word adoption bio.',
            'Use only user-provided details.',
            'Avoid repetition.',
            'End with a friendly call to action.',
            languageDirective,
          ].join(' '),
        },
        {
          role: 'user',
          content: [
            Array.isArray(labels) && labels.length > 0 ? `IMAGE_LABELS: ${labels.join(', ')}` : 'IMAGE_LABELS: (none)',
            'TRANSCRIPT (verbatim):',
            transcript,
          ].join('\n'),
        },
      ],
      text: { verbosity: 'low' },
      reasoning: { effort: 'low' },
      // No temperature/top_p
      max_output_tokens: 640,
    });
    profile = collectText(fallback).trim();
  }

  return profile;
}
