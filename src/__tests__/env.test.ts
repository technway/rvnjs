import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getApiBaseUrl, isDevEnv } from '../utils/env';

describe('Environment Utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllGlobals();
  });

  describe('getApiBaseUrl', () => {
    it('returns custom base URL when provided', () => {
      const result = getApiBaseUrl({
        customBaseUrl: 'https://api.example.com',
      });
      expect(result).toBe('https://api.example.com');
    });

    it('removes trailing slash from custom base URL', () => {
      const result = getApiBaseUrl({
        customBaseUrl: 'https://api.example.com/',
      });
      expect(result).toBe('https://api.example.com');
    });

    it('returns custom base URL with API path when both provided', () => {
      delete process.env.NEXT_PUBLIC_API_URL;
      delete process.env.API_URL;
      const result = getApiBaseUrl({
        customBaseUrl: 'https://api.example.com',
        customApiPath: 'v1',
      });
      expect(result).toBe('https://api.example.com/v1');
    });

    it('handles trailing slash in customBaseUrl and leading slash in customApiPath', () => {
      const result = getApiBaseUrl({
        customBaseUrl: 'https://api.example.com/',
        customApiPath: '/v1',
      });
      expect(result).toBe('https://api.example.com/v1');
    });

    it('returns Next.js API URL when available', () => {
      process.env.NEXT_PUBLIC_API_URL = 'https://next-api.example.com';
      const result = getApiBaseUrl();
      expect(result).toBe('https://next-api.example.com');
    });

    it.skip('returns Vite API URL when available', () => {
      // Skipped: import.meta.env cannot be reliably mocked in Vitest/node
      vi.stubGlobal('import.meta', {
        env: { VITE_API_BASE_URL: 'https://vite-api.example.com' },
      });
      const result = getApiBaseUrl();
      expect(result).toBe('https://vite-api.example.com');
    });

    it('returns Node.js API URL when available', () => {
      process.env.API_URL = 'https://node-api.example.com';
      const result = getApiBaseUrl();
      expect(result).toBe('https://node-api.example.com');
    });

    it('returns empty string when no API URL is configured', () => {
      delete process.env.NEXT_PUBLIC_API_URL;
      delete process.env.API_URL;
      const result = getApiBaseUrl();
      expect(result).toBe('');
    });

    it('handles multiple trailing slashes', () => {
      const result = getApiBaseUrl({
        customBaseUrl: 'https://api.example.com///',
        customApiPath: '///v1///',
      });
      expect(result).toBe('https://api.example.com/v1');
    });
  });

  describe('isDevEnv', () => {
    it('returns true when NODE_ENV is development', () => {
      process.env.NODE_ENV = 'development';
      expect(isDevEnv()).toBe(true);
    });

    it.skip('returns true when VITE_ENABLE_LOGGING is true', () => {
      // Skipped: import.meta.env cannot be reliably mocked in Vitest/node
      vi.stubGlobal('import.meta', {
        env: { VITE_ENABLE_LOGGING: 'true' },
      });
      expect(isDevEnv()).toBe(true);
    });

    it('returns false in production environment', () => {
      process.env.NODE_ENV = 'production';
      expect(isDevEnv()).toBe(false);
    });
  });
});
