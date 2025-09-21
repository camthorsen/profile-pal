import { type ReactElement } from 'react';

interface UploadIconProps {
  className?: string;
  'aria-hidden'?: boolean;
}

// Icon SVG taken from https://lucide.dev/icons/
export function UploadIcon({ className, 'aria-hidden': ariaHidden = true }: UploadIconProps): ReactElement {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m17 8-5-5-5 5" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
      />
    </svg>
  );
}
