import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import processProfile from './api/process-profile/route';
import transcribeAudioRoute from './api/audio/transcribe/route';

export const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.route('/api/process-profile', processProfile);
app.route('/api/audio/transcribe', transcribeAudioRoute);
