import { type ReactElement } from 'react';

interface ChevronIconProps {
  className?: string;
  'aria-hidden'?: boolean;
}

export function ChevronIcon({ className, 'aria-hidden': ariaHidden = true }: ChevronIconProps): ReactElement {
  return (
    <svg 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      aria-hidden={ariaHidden}
      className={className}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M8 9l4-4 4 4m0 6l-4 4-4-4" 
      />
    </svg>
  );
}
