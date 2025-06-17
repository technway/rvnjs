import { isNextRuntime, isViteRuntime } from '../internal/env';
import { isDevEnv } from './env';

/**
 * Supported log argument types for the logger.
 */
type LogArg =
  | string
  | number
  | boolean
  | null
  | undefined
  | Error
  | Record<string, unknown>
  | unknown;

/**
 * Supported log levels for the logger.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Logger interface with methods for each log level.
 */
interface LoggerType {
  /**
   * Log a debug message.
   * @param message - The log message.
   * @param args - Additional arguments to log.
   */
  debug: (message: string, ...args: LogArg[]) => void;
  /**
   * Log an info message.
   * @param message - The log message.
   * @param args - Additional arguments to log.
   */
  info: (message: string, ...args: LogArg[]) => void;
  /**
   * Log a warning message.
   * @param message - The log message.
   * @param args - Additional arguments to log.
   */
  warn: (message: string, ...args: LogArg[]) => void;
  /**
   * Log an error message.
   * @param message - The log message.
   * @param args - Additional arguments to log.
   */
  error: (message: string, ...args: LogArg[]) => void;
}

/**
 * Returns true if logging is enabled in the current environment.
 *
 * Checks both Next.js and Vite environment variables, and enables logging in development mode by default.
 * For Next.js:
 * - NODE_ENV === 'development'
 * - NEXT_PUBLIC_ENABLE_LOGGING === 'true'
 * For Vite:
 * - MODE === 'development'
 * - VITE_ENABLE_LOGGING === 'true'
 *
 * @returns True if logging is enabled, false otherwise.
 */
export function isLoggingEnabled(): boolean {
  return (
    (isNextRuntime() &&
      (process.env.NODE_ENV === 'development' ||
        process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true')) ||
    (isViteRuntime() &&
      (import.meta.env?.MODE === 'development' ||
        import.meta.env?.VITE_ENABLE_LOGGING === 'true'))
  );
}

/**
 * Returns a logger instance with methods for debug, info, warn, and error levels.
 *
 * Logging is only active if isLoggingEnabled() returns true. Each log is prefixed with an emoji and log level.
 *
 * @returns Logger instance with methods for each log level.
 */
export function logger(): LoggerType {
  const log =
    (level: LogLevel, emoji: string) =>
    (message: string, ...args: LogArg[]) => {
      if (!isLoggingEnabled()) return;
      console[level](`${emoji} ${level.toUpperCase()}: ${message}`, ...args);
    };

  return {
    debug: log('debug', '🐛'),
    info: log('info', 'ℹ️'),
    warn: log('warn', '⚠️'),
    error: log('error', '❌'),
  };
}

/**
 * Options for logging messages.
 */
export interface LogOptions {
  /** The message to log. */
  message: string;
  /** Optional data to log alongside the message. */
  data?: unknown;
  /** Optional prefix for the message. */
  prefix?: string;
}

/**
 * Logs a message in development environment.
 * Only logs if NODE_ENV is 'development' or if VITE_ENABLE_LOGGING is 'true'.
 *
 * @param options - The options for logging.
 */
export function devLog({ message, data, prefix = '🔧' }: LogOptions): void {
  if (!isDevEnv()) return;

  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

/**
 * Logs an error message in development environment.
 * Only logs if NODE_ENV is 'development' or if VITE_ENABLE_LOGGING is 'true'.
 *
 * @param options - The options for logging.
 */
export function devError({ message, data, prefix = '❌' }: LogOptions): void {
  if (!isDevEnv()) return;

  if (data) {
    console.error(`${prefix} ${message}`, data);
  } else {
    console.error(`${prefix} ${message}`);
  }
}

/**
 * Logs a warning message in development environment.
 * Only logs if NODE_ENV is 'development' or if VITE_ENABLE_LOGGING is 'true'.
 *
 * @param options - The options for logging.
 */
export function devWarn({ message, data, prefix = '⚠️' }: LogOptions): void {
  if (!isDevEnv()) return;

  if (data) {
    console.warn(`${prefix} ${message}`, data);
  } else {
    console.warn(`${prefix} ${message}`);
  }
}

/**
 * Logs an info message in development environment.
 * Only logs if NODE_ENV is 'development' or if VITE_ENABLE_LOGGING is 'true'.
 *
 * @param options - The options for logging.
 */
export function devInfo({ message, data, prefix = 'ℹ️' }: LogOptions): void {
  if (!isDevEnv()) return;

  if (data) {
    console.info(`${prefix} ${message}`, data);
  } else {
    console.info(`${prefix} ${message}`);
  }
}
