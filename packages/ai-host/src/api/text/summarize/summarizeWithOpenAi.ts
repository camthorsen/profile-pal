/**
 * Two-stage OpenAI flow (Responses API):
 *  1) gpt-5-nano  → extract schema-bound facts
 *  2) gpt-5-mini  → write a 120–180 word adoption bio
 *
 * Uses lazy client init so .env is loaded first.
 * NOTE: With structured outputs + strict: true, the schema must provide a `required`
 * array listing all properties. To keep "optional" semantics, each field allows null;
 * we coerce nulls away after parsing.
 */

import OpenAI from 'openai';
import { isObject } from '@williamthorsen/toolbelt.objects';

/* ------------------------- Lazy OpenAI client ------------------------- */

let cachedClient: OpenAI | undefined;

function getOpenAI(): OpenAI {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.OPENAI_API_KEY;
  if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    throw new Error('OPENAI_API_KEY is missing. Ensure ai-host loads the root .env before use.');
  }
  cachedClient = new OpenAI({ apiKey });
  return cachedClient;
}

/* ---------------------------- Data & helpers -------------------------- */

export interface AnimalFacts {
  name?: string;
  species?: string;
  age?: string;
  size?: string;
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

/**
 * Coerce parsed JSON into a safe AnimalFacts.
 * - Treat null or empty strings/arrays as "missing" and drop them.
 */
function coerceFacts(v: unknown): AnimalFacts {
  const out: AnimalFacts = {};
  if (!isObject(v)) return out;

  const str = (x: unknown) => (typeof x === 'string' && x.trim().length > 0 ? x.trim() : undefined);
  const arr = (x: unknown) => (isStringArray(x) && x.length > 0 ? x : undefined);

  out.name = str(v.name);
  out.species = str(v.species);
  out.age = str(v.age);
  out.size = str(v.size);
  out.likes = arr(v.likes);
  out.dislikes = arr(v.dislikes);
  out.temperament = arr(v.temperament);
  out.medical = str(v.medical);
  out.adoption_notes = str(v.adoption_notes);
  out.red_flags = arr(v.red_flags);

  return out;
}

/* ---------------------- Structured output schema ---------------------- */
/**
 * IMPORTANT: With `strict: true`, the API requires `required` to include all keys
 * in `properties`. To allow "optional" info, each field is `["string","null"]`
 * or `["array","null"]`. The model will output every key; unknowns as null/[].
 */
const ANIMAL_FACTS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: ['string', 'null'] },
    species: { type: ['string', 'null'] },
    age: { type: ['string', 'null'] },
    size: { type: ['string', 'null'] },
    likes: { type: ['array', 'null'], items: { type: 'string' } },
    dislikes: { type: ['array', 'null'], items: { type: 'string' } },
    temperament: { type: ['array', 'null'], items: { type: 'string' } },
    medical: { type: ['string', 'null'] },
    adoption_notes: { type: ['string', 'null'] },
    red_flags: { type: ['array', 'null'], items: { type: 'string' } },
  },
  // Required must list *every* property when strict: true is used.
  required: [
    'name',
    'species',
    'age',
    'size',
    'likes',
    'dislikes',
    'temperament',
    'medical',
    'adoption_notes',
    'red_flags',
  ],
} as const;

/* ----------------- Stage A — extract facts with nano ------------------ */

async function extractFacts(transcript: string, animalType: string): Promise<AnimalFacts> {
  if (typeof transcript !== 'string' || transcript.trim().length === 0) throw new Error('Transcript is required.');
  if (typeof animalType !== 'string' || animalType.trim().length === 0) throw new Error('Animal type is required.');

  const system =
    'Extract only facts present in the input. If a detail is unknown, set it to null or an empty array. Do not invent details.';
  const user = [`ANIMAL_TYPE: ${animalType}`, 'TRANSCRIPT (verbatim):', transcript].join('\n');

  const client = getOpenAI();
  const res = await client.responses.create({
    model: 'gpt-5-nano',
    input: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    // NEW Responses API shape: structured outputs under text.format
    text: {
      format: {
        type: 'json_schema',
        name: 'AnimalFacts',
        description: 'Structured facts extracted from transcript and animal type.',
        schema: ANIMAL_FACTS_SCHEMA,
        strict: true,
      },
    },
    max_output_tokens: 400,
  });

  const raw = typeof res.output_text === 'string' ? res.output_text : '';
  try {
    return coerceFacts(JSON.parse(raw));
  } catch {
    // If parsing fails (rare with strict schemas), return empty facts.
    return {};
  }
}

/* --------------- Stage B — compose profile with mini ------------------ */

async function composeProfile(facts: AnimalFacts): Promise<string> {
  const system = [
    'You write short, empathetic adoption bios for shelters.',
    'Voice: warm, professional, friendly. Length: 120–180 words.',
    'Use only the provided facts; do not invent details.',
    'Avoid repetition; vary sentence openings.',
    'Conclude with a friendly call to action.',
  ].join(' ');

  const user = `FACTS_JSON:\n${JSON.stringify(facts)}`;

  const client = getOpenAI();
  const res = await client.responses.create({
    model: 'gpt-5-mini',
    input: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    max_output_tokens: 320,
  });

  const text = typeof res.output_text === 'string' ? res.output_text : '';
  return text.replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

/* ---------------------------- Public API ------------------------------ */

export async function summarizeWithOpenAI(transcript: string, animalType: string): Promise<string> {
  const facts = await extractFacts(transcript, animalType);
  const profile = await composeProfile(facts);
  return profile;
}
