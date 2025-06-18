import { isNextRuntime, isViteRuntime } from '../internal/env';

/**
 * Options for getting the API base URL.
 */
export interface ApiBaseUrlOptions {
  /** Optional custom API base URL. */
  customBaseUrl?: string;
  /** Optional custom API path. */
  customApiPath?: string;
}

/**
 * Returns the API base URL based on the current environment.
 * Uses environment variables in the following order:
 * 1. NEXT_PUBLIC_API_URL (Next.js)
 * 2. VITE_API_BASE_URL (Vite)
 * 3. process.env.API_URL (Node.js)
 *
 * If customBaseUrl and customApiPath are provided, always returns their joined value.
 * Any trailing slashes will be removed from the returned URL.
 *
 * @param options - The options for getting the API base URL.
 * @returns The API base URL without trailing slash.
 */
export function getApiBaseUrl({
  customBaseUrl,
  customApiPath,
}: ApiBaseUrlOptions = {}): string {
  if (customBaseUrl && customApiPath) {
    const cleanBase = customBaseUrl.replace(/\/+$/, '');
    const cleanPath = customApiPath.replace(/^\/+|\/+$/g, '');
    return `${cleanBase}/${cleanPath}`;
  }
  if (customBaseUrl) {
    return customBaseUrl.replace(/\/+$/, '');
  }

  let baseUrl = '';

  if (isNextRuntime() && process.env.NEXT_PUBLIC_API_URL) {
    baseUrl = process.env.NEXT_PUBLIC_API_URL;
  } else if (isViteRuntime() && import.meta.env?.VITE_API_BASE_URL) {
    baseUrl = import.meta.env.VITE_API_BASE_URL;
  } else if (isNextRuntime() && process.env.API_URL) {
    baseUrl = process.env.API_URL;
  }

  if (customApiPath) {
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const cleanPath = customApiPath.replace(/^\/+|\/+$/g, '');
    return `${cleanBase}/${cleanPath}`;
  }

  return baseUrl.replace(/\/+$/, '');
}

/**
 * Checks if the current environment is development.
 * Returns true if:
 * - NODE_ENV is 'development' (Next.js)
 * - MODE is 'development' (Vite)
 *
 * @returns True if in development environment.
 */
export function isDevEnv(): boolean {
  return (
    (isNextRuntime() && process.env.NODE_ENV === 'development') ||
    (isViteRuntime() && import.meta.env.MODE === 'development')
  );
}
