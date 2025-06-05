import { improveText } from '../../src/text/improveText.ts';

const inputText = `This is test. It has some errors, like typoes and bad grammar.`;

async function testImproveText() {
  try {
    const improvedText = await improveText(inputText);
    console.log(improvedText);
  } catch (error) {
    console.error('Error improving text:', error);
  }
}

void testImproveText();
