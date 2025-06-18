import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getDefaultProfilePhoto,
  getDisplayName,
  resolveAvatar,
} from '../utils/user';

describe('User Utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('resolveAvatar', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
    });

    it('returns HTTPS URLs as-is', () => {
      const result = resolveAvatar({
        path: 'https://example.com/photo.jpg',
      });
      expect(result).toBe('https://example.com/photo.jpg');
    });

    it('returns HTTP URLs in development mode', () => {
      process.env.NODE_ENV = 'development';
      const result = resolveAvatar({
        path: 'http://example.com/photo.jpg',
      });
      expect(result).toBe('http://example.com/photo.jpg');
    });

    it('returns fallback for HTTP URLs in production mode', () => {
      process.env.NODE_ENV = 'production';
      const result = resolveAvatar({
        path: 'http://example.com/photo.jpg',
        fallback: '/default.webp',
      });
      expect(result).toBe('/default.webp');
    });

    it('prefixes relative paths with API base URL', () => {
      const result = resolveAvatar({
        path: '/uploads/photo.jpg',
      });
      expect(result).toBe('https://api.example.com/uploads/photo.jpg');
    });

    it('prefixes relative paths with custom base URL', () => {
      const result = resolveAvatar({
        path: '/uploads/photo.jpg',
        baseUrl: 'https://custom.example.com',
      });
      expect(result).toBe('https://custom.example.com/uploads/photo.jpg');
    });

    it('returns path as-is when baseUrl is false', () => {
      const result = resolveAvatar({
        path: '/uploads/photo.jpg',
        baseUrl: false,
      });
      expect(result).toBe('/uploads/photo.jpg');
    });

    it('returns fallback when path is null', () => {
      const result = resolveAvatar({
        path: null,
        fallback: '/default.webp',
      });
      expect(result).toBe('/default.webp');
    });

    it('returns fallback when path is empty string', () => {
      const result = resolveAvatar({
        path: '',
        fallback: '/default.webp',
      });
      expect(result).toBe('/default.webp');
    });

    it('returns default fallback when not specified', () => {
      const result = resolveAvatar({
        path: null,
      });
      expect(result).toBe('/avatars/avatar.webp');
    });

    it('handles trailing slashes in base URL', () => {
      const result = resolveAvatar({
        path: 'photo.jpg',
        baseUrl: 'https://example.com/',
      });
      expect(result).toBe('https://example.com/photo.jpg');
    });

    it('handles leading slashes in path', () => {
      const result = resolveAvatar({
        path: '/photo.jpg',
        baseUrl: 'https://example.com',
      });
      expect(result).toBe('https://example.com/photo.jpg');
    });
  });

  describe('getDefaultProfilePhoto', () => {
    it('returns custom photo path when provided', () => {
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
      const result = getDefaultProfilePhoto({
        photoPath: 'custom/photo.jpg',
      });
      expect(result).toBe('http://localhost:3000/custom/photo.jpg');
    });

    it('returns admin avatar when role is admin and adminAvatarPath is provided', () => {
      const result = getDefaultProfilePhoto({
        role: 'admin',
        adminAvatarPath: '/avatars/admin.png',
      });
      expect(result).toBe('/avatars/admin.png');
    });

    it('returns default user avatar when role is not admin', () => {
      const result = getDefaultProfilePhoto({
        role: 'user',
      });
      expect(result).toBe('/avatars/user.png');
    });

    it('returns default user avatar when role is null', () => {
      const result = getDefaultProfilePhoto({
        role: null,
      });
      expect(result).toBe('/avatars/user.png');
    });

    it('returns default user avatar when role is undefined', () => {
      const result = getDefaultProfilePhoto();
      expect(result).toBe('/avatars/user.png');
    });

    it('returns custom user avatar path when provided', () => {
      const result = getDefaultProfilePhoto({
        userAvatarPath: '/custom/user.png',
      });
      expect(result).toBe('/custom/user.png');
    });
  });

  describe('getDisplayName', () => {
    it('returns empty string for empty input', () => {
      expect(getDisplayName({ fullName: '' })).toBe('');
    });

    it('returns empty string for whitespace input', () => {
      expect(getDisplayName({ fullName: '   ' })).toBe('');
    });

    it('returns empty string for null input', () => {
      expect(getDisplayName({ fullName: null as any })).toBe('');
    });

    it('returns empty string for undefined input', () => {
      expect(getDisplayName({ fullName: undefined as any })).toBe('');
    });

    it('returns single name as is', () => {
      expect(getDisplayName({ fullName: 'John' })).toBe('John');
    });

    it('returns first two names when combined length <= 12', () => {
      expect(getDisplayName({ fullName: 'John Smith' })).toBe('John Smith');
    });

    it('returns first name when combined length > 12', () => {
      expect(getDisplayName({ fullName: 'John Smith-Jones' })).toBe('John');
    });

    it('returns full name when useFullName is true', () => {
      expect(
        getDisplayName({ fullName: 'John Smith', useFullName: true })
      ).toBe('John Smith');
    });

    it('truncates full name when length exceeds maxLength', () => {
      expect(
        getDisplayName({
          fullName: 'John Smith-Jones',
          useFullName: true,
          maxLength: 10,
        })
      ).toBe('John Sm...');
    });

    it('handles multiple spaces between names', () => {
      expect(getDisplayName({ fullName: 'John   Smith' })).toBe('John Smith');
    });

    it('handles tabs between names', () => {
      expect(getDisplayName({ fullName: 'John\tSmith' })).toBe('John Smith');
    });

    it('handles newlines between names', () => {
      expect(getDisplayName({ fullName: 'John\nSmith' })).toBe('John Smith');
    });
  });
});
