import { type ReactElement } from 'react';

interface ChevronUpIconProps {
  className?: string;
  'aria-hidden'?: boolean;
}

export function ChevronUpIcon({ className, 'aria-hidden': ariaHidden = true }: ChevronUpIconProps): ReactElement {
  return (
    <svg 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={ariaHidden}
      className={className}
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}
