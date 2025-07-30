'use client';

import { type ReactElement, type ReactNode } from 'react';

interface SecondaryButtonProps {
  onClick?: () => void;
  children?: ReactNode;
  icon?: ReactNode;
  text?: string;
  textClassName?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function SecondaryButton({
  onClick,
  children,
  icon,
  text,
  textClassName = '',
  className = '',
  type = 'button',
  disabled = false,
}: SecondaryButtonProps): ReactElement {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-5 py-2 rounded-full text-sm font-medium text-neutral-700 bg-gray-50 border border-neutral-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-100 focus:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
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