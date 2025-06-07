import { execFile } from 'node:child_process';
import { resolve } from 'node:path';
import { parseClipOutput } from './parseClipOutput.ts';
import { promisify } from 'node:util';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const thisFilePath = fileURLToPath(import.meta.url);
const thisDirPath = dirname(thisFilePath);
const execFileAsync = promisify(execFile);

const SCRIPT_PATH = resolve(thisDirPath, '../../scripts/clip/tag.sh');

export async function getImageTags(filePath: string): Promise<{ type: string }> {
  try {
    const { stdout } = await execFileAsync(SCRIPT_PATH, [filePath], {
      timeout: 10_000, // ms
      killSignal: 'SIGKILL',
    });

    console.log(stdout);
    const scores = parseClipOutput(stdout);
    if (scores.length === 0) {
      throw new Error('No similarity scores found');
    }

    const best = scores.reduce((a, b) => (b.score > a.score ? b : a), scores[0]);

    return { type: best?.label ?? 'no best label found' };
  } catch (err) {
    console.error('❌ CLIP image tag error:', err);
    throw new Error('CLIP tag error: ' + err);
  }
}
