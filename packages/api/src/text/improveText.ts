import { execFile } from 'node:child_process';
import { homedir } from 'node:os';
import { promisify } from 'node:util';

import { isObject } from '@williamthorsen/toolbelt.objects';

import { LLAMA_MODELS } from './constants.js';

const execFileAsync = promisify(execFile);

const LLAMA_BIN = `${homedir()}/repos/clones/llama.cpp/build/bin/llama-simple`;
const MODEL_PATH = `${homedir()}/repos/clones/llama.cpp/models/${LLAMA_MODELS.tiny}`;

// FIXME: The engine doesn't return only the response; it also returns diagnostic information and repeats the prompt.

const STOP_TOKEN = '###';

export async function improveText(inputText: string): Promise<string> {
  const prompt = [
    'Rewrite the following text to read more naturally, with better grammar and spelling:\n',
    inputText.trim() + STOP_TOKEN,
  ].join('\n');

  try {
    const { stdout } = await execFileAsync(LLAMA_BIN, ['-m', MODEL_PATH, '-n 128', '-p', prompt]);
    return stdout.trim();
  } catch (error: unknown) {
    console.error('An error occurred.');
    if (isObject(error) && 'stdout' in error && typeof error.stdout === 'string') {
      return ['An error occurred.', error.stdout.trim()].join(' | ');
    }
    throw new Error('Llama engine failed');
  }
}
