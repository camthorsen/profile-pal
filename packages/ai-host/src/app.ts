import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import transcribeAudioRoute from './api/audio/transcribe/route.ts';
import imageTagsRoute from './api/image/tags/route.ts';
import processProfile from './api/process-profile/route.ts';

export const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.route('/api/process-profile', processProfile);
app.route('/api/audio/transcribe', transcribeAudioRoute);
app.route('/api/image/tags', imageTagsRoute);
