'use client';

import { type ReactElement, type ReactNode } from 'react';
import { cn } from '@/utils/cn.ts';

interface PrimaryButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
  icon?: ReactNode;
  text?: string;
  textClassName?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function PrimaryButton({
  onClick,
  children,
  icon,
  text,
  textClassName = '',
  className = '',
  type = 'button',
  disabled = false,
}: PrimaryButtonProps): ReactElement {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-5 py-2 rounded-full text-sm font-medium text-white bg-brand-pink border border-brand-pink hover:bg-brand-pink-dark focus:z-10 focus:ring-4 focus:ring-gray-100 transition-colors cursor-pointer disabled:opacity-50  disabled:hover:bg-brand-pink disabled:cursor-default',
        className,
      )}
      type={type}
      disabled={disabled}
    >
      {children || (
        <span className="inline-flex items-center">
          {icon && <span className={textClassName}>{icon}</span>}
          {text && <span className={`${icon ? 'ml-2' : ''} font-semibold ${textClassName}`}>{text}</span>}
        </span>
      )}
    </button>
  );
}
