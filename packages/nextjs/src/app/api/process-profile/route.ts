// packages/nextjs/app/api/process-profile/route.ts
import { NextRequest } from 'next/server';

export const runtime = 'nodejs'; // or 'edge' if using server-side fs access

export async function POST(req: NextRequest) {
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

  const data = await resp.json();

  // TEMP: since CLIP + Mistral not ready, return dummy values for `tags` and `summary`
  return Response.json({
    tags: ['placeholder'],
    summary: data.text,
  });
}
