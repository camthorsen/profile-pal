import { type ReactElement } from 'react';

interface CheckIconProps {
  className?: string;
  'aria-hidden'?: boolean;
}

// Icon SVG taken from https://lucide.dev/icons/
export function CheckIcon({ className, 'aria-hidden': ariaHidden = true }: CheckIconProps): ReactElement {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
