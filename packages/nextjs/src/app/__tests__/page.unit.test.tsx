import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import HomePage from '../page.jsx';

describe('placeholder component test', () => {
  test('renders the "Hello Next.js" heading', () => {
    render(<HomePage />);
    const headingElement = screen.getByText(/Hello Next.js/i);
    expect(headingElement).toBeInTheDocument();
  });
});
