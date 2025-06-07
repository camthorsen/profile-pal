import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import processProfile from './api/process-profile/route.ts';
import transcribeAudioRoute from './api/audio/transcribe/route.ts';
import imageTagsRoute from './api/image/tags/route.ts';

export const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.route('/api/process-profile', processProfile);
app.route('/api/audio/transcribe', transcribeAudioRoute);
app.route('/api/image/tags', imageTagsRoute);
