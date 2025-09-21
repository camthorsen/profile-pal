import { type ReactElement } from 'react';

import { cn } from '@/utils/cn.ts';

interface ChipProps {
  label: string;
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
}

export function Chip({ label, variant = 'default', className }: ChipProps): ReactElement {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-sm text-sm font-medium';
  
  const variantClasses = {
    default: 'bg-neutral-50 text-neutral-600 ring-1 ring-brand-orange ring-inset',
    primary: 'bg-brand-pink text-white',
    secondary: 'bg-brand-orange text-white',
  };

  return (
    <span className={cn(baseClasses, variantClasses[variant], className)}>
      {label}
    </span>
  );
} 
