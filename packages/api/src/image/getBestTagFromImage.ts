import { getBestTag } from './getBestTag.ts';
import { getClipOutput } from './getClipOutput.ts';
import { type ClipScore,parseClipScores } from './parseClipScores.ts';

export async function getBestTagFromImage(filepath: string): Promise<ClipScore> {
  const rawClipOutput = await getClipOutput(filepath);
  const clipScores = parseClipScores(rawClipOutput);

  if (clipScores.length === 0) {
   throw new Error('No similarity scores found');
  }

  const bestTag =  getBestTag(clipScores);
  return  bestTag;
}
