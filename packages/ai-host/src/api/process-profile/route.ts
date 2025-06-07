import { Hono } from 'hono';
import { type ClipScore, getBestClipScore, getClipScoresFromImage, transcribeAudio } from 'pet-profiler-api';

import { streamToTempFile } from '../../lib/stream-to-tempfile.ts';

const app = new Hono();

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
    const [imagePath, audioPath] = await Promise.all([
      streamToTempFile(imageFile.stream(), '.jpg'),
      streamToTempFile(audioFile.stream(), '.webm'),
    ]);

    const [clipScores, summary]: [clipScores: ClipScore[], summary: string] = await Promise.all([
      getClipScoresFromImage(imagePath),
      transcribeAudio(audioPath),
    ]);

    return c.json({
      clipScores: clipScores,
      bestTag: getBestClipScore(clipScores).label,
      summary, // You can swap this out for `generateSummary(tags, transcript)` if ready
    });
  } catch (error: unknown) {
    console.error('❌ Failed to process profile:', error);
    return c.text('Internal server error', 500);
  }
});

export default app;
