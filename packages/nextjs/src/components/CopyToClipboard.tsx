'use client';

import { type ReactElement, useState } from 'react';

interface CopyToClipboardProps {
  text: string;
  buttonText?: string;
  successText?: string;
  className?: string;
}

export function CopyToClipboard({
  text,
  buttonText = 'Copy',
  successText = 'Copied!',
  className = '',
}: CopyToClipboardProps): ReactElement {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const copyIcon = (
    <svg
      className="w-3 h-3"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 18 20"
    >
      <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
    </svg>
  );

  const successIcon = (
    <svg
      className="w-3 h-3 text-blue-700"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 12"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M1 5.917 5.724 10.5 15 1.5"
      />
    </svg>
  );

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 focus:text-blue-700 transition-colors ${className}`}
      type="button"
    >
      {isCopied ? (
        <span className="inline-flex items-center">
          {successIcon}
          <span className="ml-2 text-xs font-semibold text-blue-700">{successText}</span>
        </span>
      ) : (
        <span className="inline-flex items-center">
          {copyIcon}
          <span className="ml-2 text-xs font-semibold">{buttonText}</span>
        </span>
      )}
    </button>
  );
}