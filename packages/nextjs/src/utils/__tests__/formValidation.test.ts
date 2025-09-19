import { describe, expect, it } from 'vitest';

import {
  isValidLanguage,
  SUPPORTED_LANGUAGES,
  validateAudioFile,
  validateGeneratorForm,
  validateImageFile,
} from '../formValidation.ts';

// Mock File constructor for tests
class MockFile {
  name: string;
  size: number;
  type: string;

  constructor(parts: BlobPart[], filename: string, options?: FilePropertyBag) {
    this.name = filename;
    this.size = parts.reduce((total, part) => {
      if (typeof part === 'string') return total + part.length;
      if (part instanceof ArrayBuffer) return total + part.byteLength;
      if (part instanceof Blob) return total + part.size;
      return total;
    }, 0);
    this.type = options?.type || '';
  }
}

// Replace global File with test mock
globalThis.File = MockFile as any;

describe('validateGeneratorForm', () => {
  it('validates complete form data', () => {
    const imageFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const audioFile = new File([''], 'test.mp3', { type: 'audio/mpeg' });

    const result = validateGeneratorForm({
      image: imageFile,
      audio: audioFile,
      language: 'English',
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('validates missing image', () => {
    const audioFile = new File([''], 'test.mp3', { type: 'audio/mpeg' });

    const result = validateGeneratorForm({
      image: undefined,
      audio: audioFile,
      language: 'English',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please provide an image');
  });

  it('validates missing audio', () => {
    const imageFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

    const result = validateGeneratorForm({
      image: imageFile,
      audio: undefined,
      language: 'English',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please provide an audio file');
  });

  it('validates missing language', () => {
    const imageFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const audioFile = new File([''], 'test.mp3', { type: 'audio/mpeg' });

    const result = validateGeneratorForm({
      image: imageFile,
      audio: audioFile,
      language: '',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please select a language');
  });

  it('accumulates multiple errors', () => {
    const result = validateGeneratorForm({
      image: undefined,
      audio: undefined,
      language: '',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(3);
  });
});

describe('validateImageFile', () => {
  it('validates correct image file', () => {
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const result = validateImageFile(file);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects undefined file', () => {
    const result = validateImageFile(undefined);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('No file selected');
  });

  it('rejects non-image file', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const result = validateImageFile(file);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('File must be an image');
  });

  it('rejects oversized image', () => {
    // Create a mock file that's larger than 10MB
    const largeContent = 'x'.repeat(11 * 1024 * 1024);
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
    const result = validateImageFile(file);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Image file size must be less than 10MB');
  });
});

describe('validateAudioFile', () => {
  it('validates correct audio file', () => {
    const file = new File(['test content'], 'test.mp3', { type: 'audio/mpeg' });
    const result = validateAudioFile(file);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects undefined file', () => {
    const result = validateAudioFile(undefined);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('No file selected');
  });

  it('rejects non-audio file', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const result = validateAudioFile(file);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('File must be an audio file');
  });

  it('rejects oversized audio', () => {
    // Create a mock file that's larger than 4MB
    const largeContent = 'x'.repeat(5 * 1024 * 1024);
    const file = new File([largeContent], 'large.mp3', { type: 'audio/mpeg' });
    const result = validateAudioFile(file);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Audio file size must be less than 4MB');
  });
});

describe('isValidLanguage', () => {
  it('validates supported languages', () => {
    expect(isValidLanguage('English')).toBe(true);
    expect(isValidLanguage('French')).toBe(true);
    expect(isValidLanguage('Spanish')).toBe(true);
  });

  it('rejects unsupported languages', () => {
    expect(isValidLanguage('Klingon')).toBe(false);
    expect(isValidLanguage('')).toBe(false);
    expect(isValidLanguage('english')).toBe(false); // case-sensitive
  });

  it('supports all languages in SUPPORTED_LANGUAGES', () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      expect(isValidLanguage(lang)).toBe(true);
    });
  });
});
