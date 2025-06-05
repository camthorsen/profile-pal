//ai-host/src/app.ts
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { transcribe } from 'pet-profiler-api';

const app = new Hono();

app.use('*', cors());

app.get('/health', (context) => {
  return context.text('ok');
});

app.post('/audio/transcribe', async (context) => {
  const body = await context.req.parseBody();
  const file = body.file;

  if (!(file instanceof File)) {
    return context.json({ error: 'Missing or invalid file' }, 400);
  }

  const temporaryPath = join(tmpdir(), `${randomUUID()}.wav`);
  await writeFile(temporaryPath, new Uint8Array(await file.arrayBuffer()));

  const text = await transcribe(temporaryPath);

  return context.json({ text });
});

export default app;
