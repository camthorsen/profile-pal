'use client';

import { Check, Copy } from 'lucide-react';
import { type ReactElement, useState } from 'react';

import { SecondaryButton } from './SecondaryButton.tsx';

interface CopyToClipboardProps {
  text: string;
  buttonText?: string;
  successText?: string;
  className?: string;
}

export function CopyToClipboardButton({
  text,
  buttonText = 'Copy',
  successText = 'Copied!',
  className = '',
}: CopyToClipboardProps): ReactElement {
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Show success message on button for 2 seconds after copy
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }

  return (
    <SecondaryButton
      onClick={handleCopy}
      className={className}
      icon={isCopied ? <Check /> : <Copy />}
      text={isCopied ? successText : buttonText}
      textClassName={isCopied ? 'text-green-700' : ''}
    />
  );
}
