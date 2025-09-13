import { render, screen, cleanup } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { Stopwatch } from '../Stopwatch';

describe('Stopwatch', () => {
  afterEach(() => {
    cleanup();
  });

  it('does not render when inactive and no time recorded', () => {
    const { container } = render(<Stopwatch isActive={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders initial time when active', () => {
    render(<Stopwatch isActive={true} />);
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });
});
