import { assert } from '@williamthorsen/toolbelt.guards';
import { isObject } from '@williamthorsen/toolbelt.objects';

export async function summarizeWithDockerLLM(transcript: string): Promise<string> {
  try {
    // Forward the request to the Docker LLM service
    const response = await fetch('http://localhost:7862/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: transcript,
        model: 'tiny', // Use the tiny model for faster response
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM service responded with ${response.status}: ${response.statusText}`);
    }

    const result: unknown = await response.json();
    assert(isObject(result));
    assert(typeof result.text === 'string');
    return result.text;
  } catch (error: unknown) {
    console.error('❌ LLM summarization failed:', error);
    throw error;
  }
} 