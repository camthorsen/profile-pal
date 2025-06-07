import { getBestTag } from './getBestTag.ts';
import { type ClipScore, getClipScoresFromImage } from './getClipScoresFromImage.ts';

export async function getBestTagFromImage(filepath: string): Promise<ClipScore> {
  const clipScores = await getClipScoresFromImage(filepath);

  if (clipScores.length === 0) {
    throw new Error('No similarity scores found');
  }

  const bestTag = getBestTag(clipScores);
  return bestTag;
}
