export interface ClipScore {
  label: string;
  score: number;
}

/**
 * Parses clip.cpp output and returns an array of { label, score } pairs
 */
export function parseClipScores(raw: string): ClipScore[] {
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
