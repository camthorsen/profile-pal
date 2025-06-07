import { homedir } from 'node:os';
import path from 'node:path';

import { getClipScoresFromImage } from '../../src/image/getClipScoresFromImage.ts';

const clipScores = await getClipScoresFromImage(path.join(homedir(), 'Downloads', 'cat.jpg'));
console.info(clipScores);
