import { Hono } from 'hono';
import { getClipScoresFromImage } from 'pet-profiler-api';

import { streamToTempFile } from '../../../lib/stream-to-tempfile.ts';

const app = new Hono();

app.post(async (c) => {
  const contentType = c.req.header('content-type');
  if (!contentType?.startsWith('multipart/form-data')) {
    return c.text('Expected multipart/form-data', 400);
  }

  const formData = await c.req.formData();
  const imageFile = formData.get('image');

  if (!(imageFile instanceof File)) {
    return c.text('Image file is missing or invalid', 400);
  }

  const imagePath = await streamToTempFile(imageFile.stream(), '.jpg');

  try {
    const clipScores = await getClipScoresFromImage(imagePath);
    return c.json(clipScores);
  } catch (error: unknown) {
    console.error('❌ CLIP image tag error:', error);
    return c.text('Failed to tag image', 500);
  }
});

export default app;
