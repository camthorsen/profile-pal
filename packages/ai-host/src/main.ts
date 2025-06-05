import { serve } from '@hono/node-server';

import app from './app.ts';

const port = process.env.PORT ? Number(process.env.PORT) : 8787;

serve({ fetch: app.fetch, port }, (info) => {
  console.info(
    `🟢 ai-host is listening at http://localhost:${info.port} (healthcheck: http://localhost:${info.port}/health)`,
  );
});
