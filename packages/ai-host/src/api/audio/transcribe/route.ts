// packages/ai-host/src/api/audio/transcribe/route.ts

import { Hono } from 'hono';
import { transcribeAudio } from 'pet-profiler-api/audio/transcribe';
import { streamToTempFile } from '../../../lib/stream-to-tempfile.ts';

const app = new Hono();

app.post(async (c) => {
  const contentType = c.req.header('content-type');
  if (!contentType?.startsWith('multipart/form-data')) {
    return c.text('Expected multipart/form-data', 400);
  }

  const formData = await c.req.formData();
  const audioFile = formData.get('audio');

  if (!(audioFile instanceof File)) {
    return c.text('Audio file missing', 400);
  }

  const audioPath = await streamToTempFile(audioFile.stream(), '.webm');

  try {
    const transcript = await transcribeAudio(audioPath);
    return c.json({ transcript });
  } catch (err) {
    console.error('❌ Whisper transcription failed:', err);
    return c.text('Internal error running Whisper', 500);
  }
});

export default app;
