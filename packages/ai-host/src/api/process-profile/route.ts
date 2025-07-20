import { Hono } from 'hono';
import { type ClipScore, getBestClipScore, getClipScoresFromImage } from 'pet-profiler-api';

import { streamToTempFile } from '../../lib/stream-to-tempfile.ts';
import { transcribeWithDockerWhisper } from '../audio/transcribe/transcribeWithDockerWhisper.js';

const app = new Hono();

app.post(async (context) => {
  const contentType = context.req.header('content-type');
  if (!contentType?.startsWith('multipart/form-data')) {
    return context.text('Invalid content type: expected multipart/form-data', 400);
  }

  const formData = await context.req.formData();
  const imageFile = formData.get('image');
  const audioFile = formData.get('audio');

  if (!(imageFile instanceof File) || !(audioFile instanceof File)) {
    return context.text('Both image and audio must be provided', 400);
  }

  try {
    const imagePath = await streamToTempFile(imageFile.stream(), '.jpg');

    // Process image and audio in parallel
    const [clipScores, transcript]: [clipScores: ClipScore[], transcript: string] = await Promise.all([
      getClipScoresFromImage(imagePath),
      transcribeWithDockerWhisper(audioFile),
    ]);

    return context.json({
      clipScores: clipScores,
      bestTag: getBestClipScore(clipScores).label,
      transcript, // Add transcript to response
      summary: transcript, // For now, use transcript as summary (we will enhance this later)
    });
  } catch (error: unknown) {
    console.error('❌ Failed to process profile:', error);
    return context.text('Internal server error', 500);
  }
});

export default app;
