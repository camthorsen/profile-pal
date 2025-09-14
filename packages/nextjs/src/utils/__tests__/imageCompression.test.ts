import { describe, expect, it, vi } from 'vitest';
import { compressImage, formatFileSize } from '../imageCompression';

// Mock the browser-image-compression library
vi.mock('browser-image-compression', () => ({
  default: vi.fn(),
}));

import imageCompression from 'browser-image-compression';

// Mock File constructor for tests
class MockFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;

  constructor(parts: BlobPart[], filename: string, options?: FilePropertyBag) {
    this.name = filename;
    this.size = parts.reduce((total, part) => {
      if (typeof part === 'string') return total + part.length;
      if (part instanceof ArrayBuffer) return total + part.byteLength;
      return total + (part as any).size || 0;
    }, 0);
    this.type = options?.type || '';
    this.lastModified = options?.lastModified || Date.now();
  }
}

// Mock Blob constructor
class MockBlob {
  size: number;
  type: string;

  constructor(parts: BlobPart[], options?: BlobPropertyBag) {
    this.size = parts.reduce((total, part) => {
      if (typeof part === 'string') return total + part.length;
      if (part instanceof ArrayBuffer) return total + part.byteLength;
      return total + (part as any).size || 0;
    }, 0);
    this.type = options?.type || '';
  }
}

// Replace globals with test mocks
global.File = MockFile as any;
global.Blob = MockBlob as any;

describe('compressImage', () => {
  it('compresses image successfully', async () => {
    const originalFile = new File(['original content'], 'test.jpg', { type: 'image/jpeg' });
    const compressedBlob = new MockBlob(['compressed'], { type: 'image/jpeg' });

    // Mock successful compression
    (imageCompression as any).mockResolvedValue(compressedBlob);

    const result = await compressImage(originalFile as File);

    expect(result).toEqual({
      compressedFile: expect.any(File),
      originalSize: originalFile.size,
      compressedSize: compressedBlob.size,
      compressionRatio: compressedBlob.size / originalFile.size,
    });

    expect(imageCompression).toHaveBeenCalledWith(originalFile, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    });
  });

  it('uses custom compression options', async () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    const compressedBlob = new MockBlob(['compressed'], { type: 'image/jpeg' });

    (imageCompression as any).mockResolvedValue(compressedBlob);

    const customOptions = {
      maxSizeMB: 1.0,
      maxWidthOrHeight: 1200,
      useWebWorker: false,
    };

    await compressImage(file as File, customOptions);

    expect(imageCompression).toHaveBeenCalledWith(file, customOptions);
  });

  it('throws error for null/undefined file', async () => {
    await expect(compressImage(null as any)).rejects.toThrow('File is required for compression');
    await expect(compressImage(undefined as any)).rejects.toThrow('File is required for compression');
  });

  it('throws error for non-image file', async () => {
    const textFile = new File(['content'], 'test.txt', { type: 'text/plain' });

    await expect(compressImage(textFile as File)).rejects.toThrow('File must be an image');
  });

  it('handles compression failure by returning original file', async () => {
    const originalFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

    // Mock compression failure
    (imageCompression as any).mockRejectedValue(new Error('Compression failed'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await compressImage(originalFile as File);

    expect(result).toEqual({
      compressedFile: originalFile,
      originalSize: originalFile.size,
      compressedSize: originalFile.size,
      compressionRatio: 1,
    });

    expect(consoleSpy).toHaveBeenCalledWith('Image compression failed:', expect.any(Error));

    consoleSpy.mockRestore();
  });
});

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(1023)).toBe('1023 B');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(1024 * 1023)).toBe('1023.0 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
    expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
    expect(formatFileSize(10 * 1024 * 1024)).toBe('10.0 MB');
  });

  it('handles decimal places correctly', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(1587)).toBe('1.5 KB'); // Rounds down
    expect(formatFileSize(1638)).toBe('1.6 KB'); // Rounds up
  });
});
