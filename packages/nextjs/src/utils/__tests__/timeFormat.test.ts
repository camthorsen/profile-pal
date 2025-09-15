import { describe, expect, it } from 'vitest';

import { formatDuration, formatTime, parseTimeToSeconds } from '../timeFormat.ts';

describe('formatTime', () => {
  it('formats zero seconds', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formats seconds less than a minute', () => {
    expect(formatTime(30)).toBe('00:30');
  });

  it('formats exactly one minute', () => {
    expect(formatTime(60)).toBe('01:00');
  });

  it('formats minutes and seconds', () => {
    expect(formatTime(125)).toBe('02:05');
  });

  it('formats large numbers', () => {
    expect(formatTime(3661)).toBe('61:01');
  });

  it('handles negative numbers', () => {
    expect(formatTime(-10)).toBe('00:00');
  });
});

describe('formatDuration', () => {
  it('formats milliseconds to time string', () => {
    expect(formatDuration(30_000)).toBe('00:30');
    expect(formatDuration(125_000)).toBe('02:05');
  });

  it('handles fractional milliseconds', () => {
    expect(formatDuration(30_500)).toBe('00:30');
  });
});

describe('parseTimeToSeconds', () => {
  it('parses valid time strings', () => {
    expect(parseTimeToSeconds('00:00')).toBe(0);
    expect(parseTimeToSeconds('00:30')).toBe(30);
    expect(parseTimeToSeconds('01:00')).toBe(60);
    expect(parseTimeToSeconds('02:05')).toBe(125);
  });

  it('handles single digit minutes', () => {
    expect(parseTimeToSeconds('1:30')).toBe(90);
    expect(parseTimeToSeconds('5:00')).toBe(300);
  });

  it('throws error for invalid format', () => {
    expect(() => parseTimeToSeconds('invalid')).toThrow('Invalid time format');
    expect(() => parseTimeToSeconds('1:2:3')).toThrow('Invalid time format');
    expect(() => parseTimeToSeconds('01')).toThrow('Invalid time format');
  });

  it('throws error for invalid seconds', () => {
    expect(() => parseTimeToSeconds('01:60')).toThrow('Seconds must be less than 60');
    expect(() => parseTimeToSeconds('01:99')).toThrow('Seconds must be less than 60');
  });
});
