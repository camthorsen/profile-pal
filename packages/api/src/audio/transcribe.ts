// packages/api/src/transcribe.ts
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { mkdtemp, rm } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const WHISPER_BIN = `${homedir()}/repos/clones/whisper.cpp/build/bin/whisper-cli`;
const MODEL_PATH = `${homedir()}/repos/clones/whisper.cpp/models/ggml-tiny.en.bin`;

export async function transcribeAudio(filePath: string): Promise<string> {
  const workDir = await mkdtemp(join(tmpdir(), 'whisper-out-'));

  try {
    await execFileAsync(
      WHISPER_BIN,
      [
        '-m',
        MODEL_PATH,
        '-f',
        filePath,
        '-otxt',
        '-of',
        'out', // saves as out.txt
        '-osrt', // suppress optional formats
      ],
      { cwd: workDir },
    );

    const outputPath = join(workDir, 'out.txt');
    const outputText = await readFile(outputPath, 'utf8');
    return outputText.trim();
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}
