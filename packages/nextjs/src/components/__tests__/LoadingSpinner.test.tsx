import { cleanup,render, screen } from '@testing-library/react';
import { afterEach,describe, expect, it } from 'vitest';

import { LoadingSpinner } from '../LoadingSpinner.tsx';

describe('LoadingSpinner', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders spinner SVG', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner.tagName).toBe('svg');
  });

  it('has correct default classes', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('animate-spin', 'fill-sky-600', 'w-5', 'h-5');
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="w-8 h-8 text-red-500" />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('w-8', 'h-8', 'text-red-500', 'animate-spin', 'fill-sky-600');
  });

  it('has aria-hidden attribute', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });

  it('has correct SVG attributes', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveAttribute('viewBox', '0 0 100 101');
    expect(spinner).toHaveAttribute('fill', 'none');
  });
});
