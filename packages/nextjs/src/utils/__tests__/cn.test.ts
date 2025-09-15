import { describe, expect, it } from 'vitest';

import { cn } from '../cn';

describe('cn utility', () => {
  it('combines basic class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('merges conflicting Tailwind classes', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles conditional classes with clsx', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active');
  });

  it('handles arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('handles empty/falsy values', () => {
    expect(cn('base', null, undefined, false, '')).toBe('base');
  });

  it('merges complex Tailwind classes', () => {
    expect(cn('bg-red-500 text-white', 'bg-blue-500')).toBe('text-white bg-blue-500');
  });
});
