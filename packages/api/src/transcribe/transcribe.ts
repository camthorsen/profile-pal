export async function transcribe(filePath: string): Promise<string> {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const exec = promisify(execFile);

  const { stdout } = await exec('./main', ['-m', 'models/ggml-tiny.en.bin', '-f', filePath, '-otxt']);
  return stdout.trim();
}
