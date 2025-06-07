import { homedir } from 'node:os';
import path from 'node:path';
import { getBestTagFromImage } from '../../src/image/getBestTagFromImage.ts';

const clipScore = await getBestTagFromImage(path.join(homedir(), 'Downloads', 'cat.jpg'));
console.log(clipScore);
