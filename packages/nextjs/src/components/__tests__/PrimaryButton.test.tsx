import { cleanup,fireEvent, render, screen } from '@testing-library/react';
import { afterEach,describe, expect, it, vi } from 'vitest';

import { PrimaryButton } from '../PrimaryButton.tsx';

describe('PrimaryButton', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders with text', () => {
    render(<PrimaryButton text="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<PrimaryButton text="Test Button" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Test Button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('respects disabled state', () => {
    const handleClick = vi.fn();
    render(<PrimaryButton text="Disabled Button" onClick={handleClick} disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
