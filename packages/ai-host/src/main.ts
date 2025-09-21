import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { serve } from '@hono/node-server';
// Load the repo root .env no matter the current working directory
import { config as loadEnv } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));

// From packages/ai-host/src to repo root: ../../..
loadEnv({ path: resolve(__dirname, '../../..', '.env') });

import { app } from './app.ts';

const port = process.env.PORT ? Number(process.env.PORT) : 8787;

serve({ fetch: app.fetch, port }, (info) => {
  console.info(
    `SUCCESS: ai-host is listening at http://localhost:${info.port} (healthcheck: http://localhost:${info.port}/health)`,
  );
});
