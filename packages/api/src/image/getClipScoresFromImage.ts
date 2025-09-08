import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

import type { ClipScore } from '../types.ts';

export async function getClipScoresFromImage(filePath: string): Promise<ClipScore[]> {
  const fileBuffer = await readFile(filePath);
  const fileName = basename(filePath);

  const form = new FormData();
  form.set('file', new File([fileBuffer], fileName, { type: 'image/jpeg' }));

  const response = await fetch('http://localhost:7860/tag', {
    method: 'POST',
    body: form,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed: ${response.status} ${response.statusText}\n${text}`);
  }

  return (await response.json()) as ClipScore[];
}

export function getBestClipScore(tags: ClipScore[]): ClipScore {
  if (tags.length === 0) {
    return { label: 'unknown', score: 0 };
  }

  // Sort by score in descending order and return the label of the highest score
  return tags.reduce((best, current) => (current.score > best.score ? current : best));
}

