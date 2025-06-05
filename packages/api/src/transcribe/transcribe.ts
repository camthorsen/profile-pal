// packages/api/src/transcribe.ts
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';

const execFileAsync = promisify(execFile);

const WHISPER_BIN = `${process.env.HOME}/repos/clones/whisper.cpp/build/bin/whisper-cli`;
const MODEL_PATH = `${process.env.HOME}/repos/clones/whisper.cpp/models/ggml-tiny.en.bin`;

export async function transcribe(filePath: string): Promise<string> {
  const workDir = await mkdtemp(join(tmpdir(), 'whisper-out-'));

  try {
    await execFileAsync(WHISPER_BIN, [
      '-m', MODEL_PATH,
      '-f', filePath,
      '-otxt',
      '-of', 'out', // saves as out.txt
      '-osrt',      // suppress optional formats
    ], { cwd: workDir });

    const outputPath = join(workDir, 'out.txt');
    const outputText = await readFile(outputPath, 'utf8');
    return outputText.trim();
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}
