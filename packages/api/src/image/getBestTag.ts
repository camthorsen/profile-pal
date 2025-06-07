import type { ClipScore } from './parseClipScores.ts';

export function getBestTag(tags: ClipScore[]): ClipScore {
  if (tags.length === 0) {
    return { label: 'unknown', score: 0 };
  }

  // Sort by score in descending order and return the label of the highest score
  const bestTag = tags.reduce((best, current) => (current.score > best.score ? current : best));
  return bestTag;
}
