import { Hono } from 'hono';
import { getImageTags } from 'packages/api/src/image/getClipOutput.js';
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
    const tags = await getImageTags(imagePath);
    return c.json(tags);
  } catch (err) {
    console.error('❌ CLIP image tag error:', err);
    return c.text('Failed to tag image', 500);
  }
});

export default app;
