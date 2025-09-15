import { cleanup,render, screen } from '@testing-library/react';
import { afterEach,beforeEach, describe, expect, it, vi } from 'vitest';

import { LanguageSelector } from '../LanguageSelector';

describe('LanguageSelector', () => {
  const mockOnLanguageChange = vi.fn();

  beforeEach(() => {
    mockOnLanguageChange.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders with default props', () => {
    render(<LanguageSelector selectedLanguage="English" onLanguageChange={mockOnLanguageChange} />);

    expect(screen.getByText('Output Language')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('displays selected language correctly', () => {
    render(<LanguageSelector selectedLanguage="French" onLanguageChange={mockOnLanguageChange} />);

    expect(screen.getByText('Français')).toBeInTheDocument();
  });
});
