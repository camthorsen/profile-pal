import { Hono } from 'hono';
import { type ClipScore, getBestClipScore, getClipScoresFromImage } from 'pet-profiler-api';

import { streamToTempFile } from '../../lib/stream-to-tempfile.ts';

const app = new Hono();

// Function to call Docker Whisper service
async function transcribeWithDockerWhisper(audioFile: File): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audioFile);

  const response = await fetch('http://localhost:7861/audio/transcribe', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Whisper service responded with ${response.status}: ${response.statusText}`);
  }

  const result = await response.json() as { transcript: string };
  return result.transcript;
}

app.post(async (c) => {
  const contentType = c.req.header('content-type');
  if (!contentType?.startsWith('multipart/form-data')) {
    return c.text('Invalid content type: expected multipart/form-data', 400);
  }

  const formData = await c.req.formData();
  const imageFile = formData.get('image');
  const audioFile = formData.get('audio');

  if (!(imageFile instanceof File) || !(audioFile instanceof File)) {
    return c.text('Both image and audio must be provided', 400);
  }

  try {
    const imagePath = await streamToTempFile(imageFile.stream(), '.jpg');

    // Process image and audio in parallel
    const [clipScores, transcript]: [clipScores: ClipScore[], transcript: string] = await Promise.all([
      getClipScoresFromImage(imagePath),
      transcribeWithDockerWhisper(audioFile),
    ]);

    return c.json({
      clipScores: clipScores,
      bestTag: getBestClipScore(clipScores).label,
      transcript, // Add transcript to response
      summary: transcript, // For now, use transcript as summary (you can enhance this later)
    });
  } catch (error: unknown) {
    console.error('❌ Failed to process profile:', error);
    return c.text('Internal server error', 500);
  }
});

export default app;
