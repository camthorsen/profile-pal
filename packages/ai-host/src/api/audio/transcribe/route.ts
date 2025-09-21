import { assert } from '@williamthorsen/toolbelt.guards';
import { isObject } from '@williamthorsen/toolbelt.objects';
import { Hono } from 'hono';

const app = new Hono();

app.post(async (context) => {
  const contentType = context.req.header('content-type');
  if (!contentType?.startsWith('multipart/form-data')) {
    return context.text('Expected multipart/form-data', 400);
  }

  const formData = await context.req.formData();
  const audioFile = formData.get('audio');

  if (!(audioFile instanceof File)) {
    return context.text('Audio file missing', 400);
  }

  console.info('Processing audio file', audioFile.name);

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

    const result: unknown = await response.json();
    assert(isObject(result));
    return context.json({ transcript: result.transcript });
  } catch (error: unknown) {
    console.error('ERROR: Whisper transcription failed:', error);
    return context.text('Internal error running Whisper', 500);
  }
});

export default app;
