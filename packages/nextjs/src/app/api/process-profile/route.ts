import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 1) Parse incoming multipart/form-data
    const formData = await request.formData();
    const imageFileWeb = formData.get('image') as File | null;
    const audioFileWeb = formData.get('audio') as File | null;
    if (!imageFileWeb || !audioFileWeb) {
      return NextResponse.json({ error: 'Missing "image" or "audio" field in form data.' }, { status: 400 });
    }

    // 2) Send audio to local Python service (/transcribe)
    const transcribeForm = new FormData();
    transcribeForm.append('audio_file', audioFileWeb);
    const transcribeResp = await fetch('http://localhost:8787/audio/transcribe', {
      method: 'POST',
      body: transcribeForm,
    });
    if (!transcribeResp.ok) {
      const errText = await transcribeResp.text();
      console.error('Transcription error:', errText);
      return NextResponse.json({ error: 'Transcription failed.' }, { status: 500 });
    }
    const { text: transcription } = (await transcribeResp.json()) as {
      text: string;
    };

    // 3) Send image to local Python service (/clip_tags)
    const tagsForm = new FormData();
    tagsForm.append('image_file', imageFileWeb);
    const tagsResp = await fetch('http://localhost:8787/clip_tags', {
      method: 'POST',
      body: tagsForm,
    });
    if (!tagsResp.ok) {
      const errText = await tagsResp.text();
      console.error('CLIP tags error:', errText);
      return NextResponse.json({ error: 'Image tagging failed.' }, { status: 500 });
    }
    const { tags } = (await tagsResp.json()) as { tags: string[] };

    // 4) Send transcription + tags to local Python service (/summarize)
    const summaryResp = await fetch('http://localhost:8000/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcription, tags }),
    });
    if (!summaryResp.ok) {
      const errText = await summaryResp.text();
      console.error('Summarization error:', errText);
      return NextResponse.json({ error: 'Summarization failed.' }, { status: 500 });
    }
    const { summary } = (await summaryResp.json()) as { summary: string };

    // 5) Return tags + summary
    return NextResponse.json({ tags, summary }, { status: 200 });
  } catch (err: any) {
    console.error('Error in /api/process-profile:', err);
    return NextResponse.json({ error: 'Failed to generate profile. See server logs.' }, { status: 500 });
  }
}
