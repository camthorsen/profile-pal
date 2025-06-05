import { describe, expect, it } from 'vitest';

import { improveText } from '../improveText.ts';

describe(improveText, () => {
  it.skip('it returns refined text', async () => {
    // This test takes too long to run.
    const inputText = `This is test. It has some errors, like typoes and bad grammar.`;

    const improvedText = await improveText(inputText);

    expect(improvedText).not.toBe(inputText);
  }, 30_000);
});
