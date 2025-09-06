import { type ReactElement } from 'react';

interface SuccessIconProps {
  className?: string;
  'aria-hidden'?: boolean;
}

export function SuccessIcon({ className, 'aria-hidden': ariaHidden = true }: SuccessIconProps): ReactElement {
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
        d="M5 13l4 4L19 7" 
      />
    </svg>
  );
}
