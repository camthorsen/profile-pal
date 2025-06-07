import { execFile } from 'node:child_process';
import { homedir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { isObject } from '@williamthorsen/toolbelt.objects';

const execFileAsync = promisify(execFile);

const CLIP_BIN = path.join(homedir(), '/repos/clones/clip.cpp/build/bin/main');
const MODEL_PATH= path.join(homedir(), '/repos/clones/clip.cpp/models/clip-vit-base-patch32.gguf');

export async function getClipOutput(filePath: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync(CLIP_BIN, [
      `-m ${MODEL_PATH}`,
      `--image ${filePath}`, //
      '--text cat',
      '--text dog',
      '--text rabbit',
      '--text other',
    ], {
      timeout: 10_000, // ms
      killSignal: 'SIGKILL',
    });
    console.log('Raw output:', stdout);
    return stdout.trim();
  } catch (error: unknown) {
    console.error('An error occurred.');
    if (isObject(error) && 'stdout' in error && typeof error.stdout === 'string') {
      return ['An error occurred.', error.stdout.trim()].join(' | ');
    }
    throw new Error('CLIP engine failed');
  }
}
