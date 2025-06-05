import os from 'node:os';
import path from 'node:path';

const MODEL = 'ggml-tiny.en.bin';
const WHISPER_CPP_PATH = path.join(os.homedir(), 'repos', 'clones', 'whisper.cpp');

export async function transcribe(filePath: string): Promise<string> {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const exec = promisify(execFile);

  const { stdout } = await exec(path.join(WHISPER_CPP_PATH, 'build/bin/whisper-cli'), [
    '-m',
    path.join(WHISPER_CPP_PATH, 'models', MODEL),
    '-f',
    filePath,
    '-otxt',
  ]);
  return stdout.trim();
}
