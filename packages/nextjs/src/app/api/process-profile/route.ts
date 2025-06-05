import { isObject } from '@williamthorsen/toolbelt.objects';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs'; // or 'edge' if using server-side fs access

export async function POST(req: NextRequest): Promise<Response> {
  const formData = await req.formData();
  const audio = formData.get('audio');

  if (!(audio instanceof File)) {
    return new Response(JSON.stringify({ error: 'Missing audio file' }), { status: 400 });
  }

  const proxyForm = new FormData();
  proxyForm.append('file', audio);

  const resp = await fetch('http://localhost:8787/audio/transcribe', {
    method: 'POST',
    body: proxyForm,
  });

  if (!resp.ok) {
    return new Response(await resp.text(), { status: resp.status });
  }

  const data: unknown = await resp.json();
  const summary = isObject(data) && 'text' in data ? data.text : 'No text found in response';

  // TEMP: since CLIP + Mistral not ready, return dummy values for `tags` and `summary`
  return Response.json({
    tags: ['placeholder'],
    summary,
  });
}
