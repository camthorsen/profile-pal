import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Chip } from '../Chip';

describe('Chip', () => {
  it('renders with label', () => {
    render(<Chip label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with default variant', () => {
    render(<Chip label="Default" />);
    const chip = screen.getByText('Default');
    expect(chip).toHaveClass('bg-neutral-50', 'text-neutral-600');
  });

  it('renders with primary variant', () => {
    render(<Chip label="Primary" variant="primary" />);
    const chip = screen.getByText('Primary');
    expect(chip).toHaveClass('bg-brand-pink', 'text-white');
  });

  it('renders with secondary variant', () => {
    render(<Chip label="Secondary" variant="secondary" />);
    const chip = screen.getByText('Secondary');
    expect(chip).toHaveClass('bg-brand-orange', 'text-white');
  });

  it('applies custom className', () => {
    render(<Chip label="Custom" className="custom-class" />);
    const chip = screen.getByText('Custom');
    expect(chip).toHaveClass('custom-class');
  });

  it('maintains base classes', () => {
    render(<Chip label="Base" />);
    const chip = screen.getByText('Base');
    expect(chip).toHaveClass('inline-flex', 'items-center', 'px-3', 'py-1', 'rounded-sm', 'text-sm', 'font-medium');
  });

  it('combines variant and custom classes correctly', () => {
    render(<Chip label="Combined" variant="primary" className="m-2" />);
    const chip = screen.getByText('Combined');
    expect(chip).toHaveClass('bg-brand-pink', 'text-white', 'm-2');
  });
});
