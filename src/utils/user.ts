import { getApiBaseUrl } from './env';

/**
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
