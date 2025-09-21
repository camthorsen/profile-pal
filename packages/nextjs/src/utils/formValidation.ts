export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface GeneratorFormData {
  image: File | undefined;
  audio: File | undefined;
  language: string;
}

export function validateGeneratorForm(data: GeneratorFormData): ValidationResult {
  const errors: string[] = [];

  if (!data.image) {
    errors.push('Please provide an image');
  }

  if (!data.audio) {
    errors.push('Please provide an audio file');
  }

  if (!data.language || data.language.trim() === '') {
    errors.push('Please select a language');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateImageFile(file: File | undefined): ValidationResult {
  const errors: string[] = [];

  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }

  if (!file.type.startsWith('image/')) {
    errors.push('File must be an image');
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push('Image file size must be less than 10MB');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateAudioFile(file: File | undefined): ValidationResult {
  const errors: string[] = [];

  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }

  if (!file.type.startsWith('audio/')) {
    errors.push('File must be an audio file');
  }

  // Check file size (4MB limit for audio)
  const maxSize = 4 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push('Audio file size must be less than 4MB');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export const SUPPORTED_LANGUAGES = [
  'English',
  'French',
  'Spanish',
  'German',
  'Italian',
  'Portuguese',
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export function isValidLanguage(language: string): language is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
}
