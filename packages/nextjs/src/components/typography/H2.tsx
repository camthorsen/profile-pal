import { type ReactElement } from 'react';

import { cn } from '@/utils/cn.ts';

interface H2Props {
  children: React.ReactNode;
  className?: string;
}

export function H2({ children, className }: H2Props): ReactElement {
  return <h2 className={cn('text-lg font-bold text-gray-900', className)}>{children}</h2>;
}
