import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

export async function streamToTempFile(stream: ReadableStream<Uint8Array>, ext = ''): Promise<string> {
  const buffer = Buffer.from(await streamToArrayBuffer(stream));
  const path = join(tmpdir(), `${randomUUID()}${ext}`);
  await writeFile(path, buffer);
  return path;
}

async function streamToArrayBuffer(stream: ReadableStream<Uint8Array>): Promise<ArrayBuffer> {
  const reader = stream.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(...value);
  }
  return new Uint8Array(chunks).buffer;
}
