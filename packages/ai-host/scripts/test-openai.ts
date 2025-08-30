// Minimal, direct test of the summarizeWithOpenAI function.
// Loads the root .env explicitly so the script works even if run from ai-host.
import { config as loadEnv } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnv({ path: resolve(__dirname, '../../..', '.env') });

// Import your two-stage function
import { summarizeWithOpenAI } from '../src/api/text/summarize/summarizeWithOpenAi.js';

async function main() {
  const transcript =
    "This is Sassy. She’s a 2-year-old cat. She likes dogs, but she's wary of strangers. Healthy, spayed, indoor only.";
  const animalType = 'cat';

  try {
    const out = await summarizeWithOpenAI(transcript, animalType);
    console.log('\n=== OpenAI output ===\n');
    console.log(out);
    console.log('\n=====================\n');
  } catch (err) {
    console.error('OpenAI test failed:', err);
    process.exitCode = 1;
  }
}

await main();
