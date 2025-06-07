/**
 * Parses clip.cpp output and returns an array of { label, score } pairs
 */
export function parseClipOutput(raw: string): { label: string; score: number }[] {
  const result: { label: string; score: number }[] = [];

  const lines = raw.split('\n');
  let currentLabel: string | null = null;

  for (const line of lines) {
    const labelMatch = line.match(/^Testing label:\s*(\w+)/);
    if (labelMatch) {
      currentLabel = labelMatch[1];
      continue;
    }

    const scoreMatch = line.match(/Similarity score\s*=\s*([0-9.]+)/);
    if (scoreMatch && currentLabel) {
      const score = parseFloat(scoreMatch[1]);
      result.push({ label: currentLabel, score });
      currentLabel = null;
    }
  }

  return result;
}

const rawText = `Testing label: cat
clip_model_load: model name:   openai/clip-vit-base-patch32
clip_model_load: description:  two-tower CLIP model
clip_model_load: GGUF version: 2
clip_model_load: alignment:    32
clip_model_load: n_tensors:    397
clip_model_load: n_kv:         25
clip_model_load: ftype:        f16

clip_model_load: text_encoder:   1
clip_model_load: vision_encoder: 1
clip_model_load: model size:     289.06 MB
clip_model_load: metadata size:  0.13 MB

clip_model_load: 24 MB of memory allocated
main: Similarity score = 0.296


Timings
main: Model loaded in   297.60 ms
main: Image loaded in    43.20 ms
main: Similarity score calculated in   168.28 ms
main: Total time:   509.25 ms
Score for cat: 0.296
ms
Comparison result: .2960
Testing label: dog
clip_model_load: model name:   openai/clip-vit-base-patch32
clip_model_load: description:  two-tower CLIP model
clip_model_load: GGUF version: 2
clip_model_load: alignment:    32
clip_model_load: n_tensors:    397
clip_model_load: n_kv:         25
clip_model_load: ftype:        f16

clip_model_load: text_encoder:   1
clip_model_load: vision_encoder: 1
clip_model_load: model size:     289.06 MB
clip_model_load: metadata size:  0.13 MB

clip_model_load: 24 MB of memory allocated
main: Similarity score = 0.243


Timings
main: Model loaded in   400.05 ms
main: Image loaded in    44.68 ms
main: Similarity score calculated in   170.88 ms
main: Total time:   615.62 ms
Score for dog: 0.243
ms
Comparison result: .2430
Testing label: rabbit
clip_model_load: model name:   openai/clip-vit-base-patch32
clip_model_load: description:  two-tower CLIP model
clip_model_load: GGUF version: 2
clip_model_load: alignment:    32
clip_model_load: n_tensors:    397
clip_model_load: n_kv:         25
clip_model_load: ftype:        f16

clip_model_load: text_encoder:   1
clip_model_load: vision_encoder: 1
clip_model_load: model size:     289.06 MB
clip_model_load: metadata size:  0.13 MB

clip_model_load: 24 MB of memory allocated
main: Similarity score = 0.244


Timings
main: Model loaded in   399.52 ms
main: Image loaded in    41.79 ms
main: Similarity score calculated in   179.00 ms
main: Total time:   620.35 ms
Score for rabbit: 0.244
ms
Comparison result: .2440
Testing label: other
clip_model_load: model name:   openai/clip-vit-base-patch32
clip_model_load: description:  two-tower CLIP model
clip_model_load: GGUF version: 2
clip_model_load: alignment:    32
clip_model_load: n_tensors:    397
clip_model_load: n_kv:         25
clip_model_load: ftype:        f16

clip_model_load: text_encoder:   1
clip_model_load: vision_encoder: 1
clip_model_load: model size:     289.06 MB
clip_model_load: metadata size:  0.13 MB

clip_model_load: 24 MB of memory allocated
main: Similarity score = 0.233


Timings
main: Model loaded in   307.81 ms
main: Image loaded in    39.85 ms
main: Similarity score calculated in   174.13 ms
main: Total time:   521.80 ms
Score for other: 0.233
ms
Comparison result: .2330
`;

console.log(parseClipOutput(rawText));

function getBestTag(tags: { label: string; score: number }[]): string {
  if (tags.length === 0) return 'unknown';

  // Sort by score in descending order and return the label of the highest score
  const bestTag = tags.reduce((best, current) => (current.score > best.score ? current : best));
  return bestTag.label;
}

console.log(getBestTag(parseClipOutput(rawText)));
