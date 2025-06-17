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
 *
 * @param options - The options for getting the API base URL.
 * @returns The API base URL.
 */
export function getApiBaseUrl({
  customBaseUrl,
  customApiPath,
}: ApiBaseUrlOptions = {}): string {
  if (customBaseUrl && customApiPath) {
    return `${customBaseUrl.replace(/\/$/, '')}/${customApiPath.replace(/^\//, '')}`;
  }
  if (customBaseUrl) {
    return customBaseUrl;
  }

  const baseUrl =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env.VITE_API_BASE_URL) ||
    (typeof process !== 'undefined' && process.env.API_URL) ||
    '';

  return customApiPath
    ? `${baseUrl.replace(/\/$/, '')}/${customApiPath.replace(/^\//, '')}`
    : baseUrl;
}

/**
 * Checks if the current environment is development.
 * Returns true if:
 * - NODE_ENV is 'development'
 * - VITE_ENABLE_LOGGING is 'true'
 *
 * @returns True if in development environment.
 */
export function isDevEnv(): boolean {
  return (
    (typeof process !== 'undefined' &&
      process.env.NODE_ENV === 'development') ||
    (typeof import.meta !== 'undefined' &&
      import.meta.env.VITE_ENABLE_LOGGING === 'true')
  );
}

/**
 * Checks if the current runtime is Next.js.
 * Returns true if process.env.NEXT_PUBLIC_API_URL is defined.
 *
 * @returns True if running in Next.js.
 */
export function isNextRuntime(): boolean {
  return typeof process !== 'undefined' && !!process.env.NEXT_PUBLIC_API_URL;
}

/**
 * Checks if the current runtime is Vite.
 * Returns true if import.meta.env.VITE_API_BASE_URL is defined.
 *
 * @returns True if running in Vite.
 */
export function isViteRuntime(): boolean {
  return (
    typeof import.meta !== 'undefined' && !!import.meta.env.VITE_API_BASE_URL
  );
}
