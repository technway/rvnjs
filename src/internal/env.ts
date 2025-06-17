/**
 * Returns true if running in a Node.js/Next.js runtime (process.env is defined).
 *
 * @returns {boolean} True if running in Next.js/Node.js, false otherwise.
 */
export function isNextRuntime(): boolean {
  return typeof process !== 'undefined' && typeof process.env !== 'undefined';
}

/**
 * Returns true if running in a Vite environment (import.meta.env is available).
 *
 * @returns {boolean} True if running in Vite, false otherwise.
 */
export function isViteRuntime(): boolean {
  return (
    typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined'
  );
}
