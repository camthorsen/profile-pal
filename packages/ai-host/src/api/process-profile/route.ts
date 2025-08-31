import { Hono } from 'hono';
import { type ClipScore, getClipScoresFromImage } from 'pet-profiler-api';

import { streamToTempFile } from '../../lib/stream-to-tempfile.ts';
import { transcribeWithDockerWhisper } from '../audio/transcribe/transcribeWithDockerWhisper.js';
import { summarizeWithOpenAI } from '../text/summarize/summarizeWithOpenAi.js';

const app = new Hono();

// updated signature: (transcript, labels?)
export async function summarizeHandler(transcript: string, labels?: string[]) {
  console.log('🤖 Using OpenAI for text summarization');
  return summarizeWithOpenAI(transcript, labels);
}

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

    // Step 1: Process image and audio in parallel
    const [clipScores, transcript]: [ClipScore[], string] = await Promise.all([
      getClipScoresFromImage(imagePath),
      transcribeWithDockerWhisper(audioFile),
    ]);

    // Step 2: Collect labels for LLM grounding
    const labels = clipScores.map(({ label }) => label);

    // Step 3: Generate summary using LLM
    const summary = await summarizeHandler(transcript, labels);

    return context.json({
      clipScores,
      labels, // helpful for the UI
      transcript, // for debugging/preview
      summary, // final bio
    });
  } catch (error: unknown) {
    console.error('❌ Failed to process profile:', error);
    return context.text('Internal server error', 500);
  }
});

export default app;
