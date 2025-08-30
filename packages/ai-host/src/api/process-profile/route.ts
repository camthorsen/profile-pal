import { Hono } from 'hono';
import { type ClipScore, getBestClipScore, getClipScoresFromImage } from 'pet-profiler-api';

import { streamToTempFile } from '../../lib/stream-to-tempfile.ts';
import { transcribeWithDockerWhisper } from '../audio/transcribe/transcribeWithDockerWhisper.js';
import { summarizeWithDockerLLM } from '../text/summarize/summarizeWithDockerLLM.js';
import { summarizeWithOpenAI } from '../text/summarize/summarizeWithOpenAi.js';

const app = new Hono();

const useHosted = process.env.USE_HOSTED_LLM === 'true';

export async function summarizeHandler(transcript: string, animalType: string) {
  if (useHosted) {
    return summarizeWithOpenAI(transcript, animalType);
  }
  return summarizeWithDockerLLM(transcript, animalType);
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
    const [clipScores, transcript]: [clipScores: ClipScore[], transcript: string] = await Promise.all([
      getClipScoresFromImage(imagePath),
      transcribeWithDockerWhisper(audioFile),
    ]);

    // Step 2: Get the best tag (animal type) for context
    const bestTag = getBestClipScore(clipScores).label;

    // Step 3: Generate summary using LLM with animal type context
    const summary = await summarizeHandler(transcript, bestTag);

    return context.json({
      clipScores: clipScores,
      bestTag, // Use the bestTag variable we already computed
      transcript, // Add transcript to response
      summary, // Use LLM-generated summary
    });
  } catch (error: unknown) {
    console.error('❌ Failed to process profile:', error);
    return context.text('Internal server error', 500);
  }
});

export default app;
