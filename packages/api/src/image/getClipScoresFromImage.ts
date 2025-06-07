import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

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

  return response.json() as Promise<ClipScore[]>;
}

export interface ClipScore {
  label: string;
  score: number;
}
