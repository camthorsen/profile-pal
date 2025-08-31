import { serve } from '@hono/node-server';

// Load the repo root .env no matter the current working directory
import { config as loadEnv } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// FIXME: REMOVE THIS log
console.log(
  `[ai-host] env loaded. OPENAI_API_KEY=…${(process.env.OPENAI_API_KEY ?? '').slice(-4)}`
);


// From packages/ai-host/src to repo root: ../../..
loadEnv({ path: resolve(__dirname, '../../..', '.env') });

import { app } from './app.ts';

const port = process.env.PORT ? Number(process.env.PORT) : 8787;

serve({ fetch: app.fetch, port }, (info) => {
  console.info(
    `🟢 ai-host is listening at http://localhost:${info.port} (healthcheck: http://localhost:${info.port}/health)`,
  );
});
