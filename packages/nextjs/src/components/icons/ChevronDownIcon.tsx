import { type ReactElement } from 'react';

interface ChevronDownIconProps {
  className?: string;
  'aria-hidden'?: boolean;
}

export function ChevronDownIcon({ className, 'aria-hidden': ariaHidden = true }: ChevronDownIconProps): ReactElement {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
