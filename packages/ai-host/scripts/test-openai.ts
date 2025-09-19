// TODO: Readme: TO TEST: From the root, "$ DEBUG_OPENAI=1 pnpm tsx packages/ai-host/scripts/test-openai.ts"
import 'dotenv/config';
import { summarizeWithOpenAI } from '../src/api/text/summarize/summarizeWithOpenAi.js';

const transcript =
  'This is Sassy. She’s a 2-year-old cat. She likes dogs, but is wary of strangers. Healthy, spayed, indoor only.';
const labels = ['cat', 'short haired'];

const out = await summarizeWithOpenAI(transcript, labels);
console.log('\n=== OpenAI output ===\n');
console.log(out);
console.log('\n=====================\n');
