// packages/ai-host/src/api/audio/transcribe/route.ts

import { Hono } from 'hono';

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

  try {
    // Forward the request to the Docker Whisper service
    const whisperFormData = new FormData();
    whisperFormData.append('audio', audioFile);

    const response = await fetch('http://localhost:7861/audio/transcribe', {
      method: 'POST',
      body: whisperFormData,
    });

    if (!response.ok) {
      throw new Error(`Whisper service responded with ${response.status}: ${response.statusText}`);
    }

    const result = await response.json() as { transcript: string };
    return c.json({ transcript: result.transcript });
  } catch (err) {
    console.error('❌ Whisper transcription failed:', err);
    return c.text('Internal error running Whisper', 500);
  }
});

export default app;
