import { homedir } from 'node:os';
import path from 'node:path';
import { getBestTagFromImage } from '../../src/image/getBestTagFromImage.ts';

const imageTags = await getBestTagFromImage(path.join(homedir(), 'Downloads', 'cat.jpg'));
console.log(imageTags);
//
// const bestTag = getBestTag(imageTags.type);
// console.log(bestTag);
