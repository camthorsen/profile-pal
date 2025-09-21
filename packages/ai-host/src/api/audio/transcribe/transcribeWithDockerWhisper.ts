import { assert } from '@williamthorsen/toolbelt.guards';
import { isObject } from '@williamthorsen/toolbelt.objects';

export async function transcribeWithDockerWhisper(audioFile: File): Promise<string> {
  try {
    // Forward the request to the Docker Whisper service
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await fetch('http://localhost:7861/audio/transcribe', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`ERROR: Whisper service responded with ${response.status}: ${response.statusText}`);
    }

    const result: unknown = await response.json();
    assert(isObject(result));
    assert(typeof result.transcript === 'string');
    return result.transcript;
  } catch (error: unknown) {
    console.error('ERROR: Whisper transcription failed:', error);
    throw error;
  }
}
