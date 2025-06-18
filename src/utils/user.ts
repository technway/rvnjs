import { getApiBaseUrl, isDevEnv } from './env';

/**
 * Options for resolving a user's profile image.
 */
export interface AvatarOptions {
  /** Custom profile image path or full URL. */
  path?: string | null;
  /** Fallback avatar path to use when `path` is invalid or disallowed. */
  fallback?: string;
  /** Optional base URL to prefix relative paths. Set to `false` to skip prefixing. */
  baseUrl?: string | false;
}

/**
 * Resolves the profile image URL for a user.
 *
 * Behavior:
 * - If `path` is an absolute HTTPS URL, returns it as-is.
 * - If `path` is an HTTP URL, only returns it in development mode.
 * - If `path` is a relative path, prefixes it with `baseUrl` (or `getApiBaseUrl()` if not set).
 * - If `path` is missing or disallowed, returns `fallback` (default: `/avatars/avatar.webp`).
 *
 * @param options - Avatar resolution options.
 * @returns The resolved profile image URL as a string.
 */
export function resolveAvatar({
  path,
  fallback = '/avatars/avatar.webp',
  baseUrl,
}: AvatarOptions): string {
  if (typeof path === 'string' && path.trim()) {
    if (/^https:\/\//.test(path)) {
      return path;
    }

    if (/^http:\/\//.test(path)) {
      if (isDevEnv()) return path;
      return fallback;
    }

    if (baseUrl === false) {
      return path;
    }

    const base = (baseUrl ?? getApiBaseUrl()).replace(/\/+$/, '');
    const clean = path.replace(/^\/+/, '');
    return `${base}/${clean}`;
  }

  return fallback;
}

/**
 * Options for getting a user's display name.
 */
export interface DisplayNameOptions {
  /** The user's full name. */
  fullName: string;
  /** Whether to use the full name, possibly trimmed. */
  useFullName?: boolean;
  /** Maximum length for the full name. Defaults to 20. */
  maxLength?: number;
}

/**
 * Creates a user-friendly display name from a full name.
 *
 * - If useFullName is true, returns the full name (truncated to maxLength with ellipsis if needed).
 * - Otherwise, returns the first and second word if their combined length is <= 12, else just the first word.
 *
 * @param options - The options for getting the display name.
 * @returns A display name string.
 */
export function getDisplayName({
  fullName,
  useFullName,
  maxLength = 20,
}: DisplayNameOptions): string {
  if (!fullName) return '';

  const words = fullName.trim().split(/\s+/);
  if (words.length === 0) return '';

  if (useFullName) {
    const trimmed = fullName.trim();
    if (trimmed.length > maxLength) {
      const truncated = trimmed.slice(0, maxLength - 3).trim();
      return `${truncated}...`;
    }
    return trimmed;
  }

  const [first, second = ''] = words;
  return first.length + second.length <= 12
    ? `${first} ${second}`.trim()
    : first;
}

/**
 * @deprecated Use `resolveAvatar` instead.
 *
 * Options for getting a user's profile photo.
 */
export interface ProfilePhotoOptions {
  /** The role of the user ('admin' | 'user'). */
  role?: string | null;
  /** Optional path to a custom profile photo. */
  photoPath?: string | null;
  /** Optional custom path for user avatar. Defaults to '/avatars/user.png'. */
  userAvatarPath?: string;
  /** Optional custom path for admin avatar. */
  adminAvatarPath?: string;
}

/**
 * @deprecated Use `resolveAvatar` instead.
 *
 * Returns the profile photo URL for a user.
 *
 * If a custom photoPath is provided, returns the full URL using the API base URL.
 * Otherwise, returns a default avatar based on the user's role.
 *
 * @param options - The options for getting the profile photo.
 * @returns The full URL to the profile photo.
 */
export function getDefaultProfilePhoto({
  role,
  photoPath,
  userAvatarPath = '/avatars/user.png',
  adminAvatarPath,
}: ProfilePhotoOptions = {}): string {
  if (photoPath) {
    return `${getApiBaseUrl()}/${photoPath}`;
  }

  return role === 'admin' && adminAvatarPath ? adminAvatarPath : userAvatarPath;
}
