<div align="center">

<h1>RVNJS - React using Vite & Next.js Utilities</h1>

<img src="https://github.com/user-attachments/assets/91e4b5dc-2db5-42d3-8814-586f3def72dd" alt="RVNJS Logo" width="130">

<p>A minimal utility library providing essential functions for Vite + React and Next.js applications.</p>

<a href="https://www.npmjs.com/package/@technway/rvnjs"><img src="https://img.shields.io/npm/v/@technway/rvnjs.svg" alt="npm version"></a> <a href="https://github.com/technway/rvnjs/actions"><img src="https://github.com/technway/rvnjs/actions/workflows/ci.yml/badge.svg" alt="CI Status"></a> <a href="https://github.com/technway/rvnjs/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/rvnjs.svg" alt="License"></a> <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg" alt="TypeScript"></a>

</div>

---

- [Installation](#installation)
- [Environment Setup](#environment-setup)
  - [For Vite Applications](#for-vite-applications)
  - [For Next.js Applications](#for-nextjs-applications)
- [Usage Example](#usage-example)
  - [Environment Utilities](#environment-utilities)
- [TypeScript Support](#typescript-support)
- [API Reference](#api-reference)
  - [User Utilities](#user-utilities)
  - [Logging Utilities](#logging-utilities)
  - [Type Exports](#type-exports)
  - [Environment Utilities](#environment-utilities-1)
- [License](#license)

## Installation

```bash
# Using npm
npm install @technway/rvnjs

# Using yarn
yarn add @technway/rvnjs

# Using pnpm
pnpm add @technway/rvnjs
```

## Environment Setup

### For Vite Applications

Add these environment variables to your `.env` file:

```env
# Required to use the API-related utils
VITE_API_BASE_URL=https://your-api.com

# Optional to use the logger util
VITE_ENABLE_LOGGING=true
```

### For Next.js Applications

Add these environment variables to your `.env.local` file:

```env
# Required to use the API-related utils
NEXT_PUBLIC_API_URL=https://your-api.com

# Optional to use the logger util
NEXT_PUBLIC_ENABLE_LOGGING=true
```

## Usage Example

### Environment Utilities

```typescript
import { isDevEnv, getApiBaseUrl } from '@technway/rvnjs';

// Check if running in development
if (isDevEnv()) {
  console.log('Running in development mode');
}

// Get API base URL (automatically detects environment)
const apiUrl = getApiBaseUrl();

// Get API base URL with custom path
const apiUrlWithPath = getApiBaseUrl({
  customBaseUrl: 'https://api.example.com',
  customApiPath: 'v1'
});
```

---

## TypeScript Support

This library is written in TypeScript and includes full type definitions. All functions are properly typed and documented.

---

## API Reference

### User Utilities

| Function                 | Description                                           | Parameters                                                                                                                                                                                                                                                                  | Returns                              | Notes                                                                                                                                                                                                                                                                                             |
| ------------------------ | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getDefaultProfilePhoto` | Returns the profile photo URL for a user              | `options: {`<br>`  role?: string \| null` - User role ('admin' \| 'user')<br>`  photoPath?: string \| null` - Custom photo path<br>`  userAvatarPath?: string` - User avatar path (default: '/avatars/user.png')<br>`  adminAvatarPath?: string` - Admin avatar path<br>`}` | `string` - Full URL to profile photo | If `photoPath` is provided, returns full URL with API base. Otherwise uses role-based default avatars. `adminAvatarPath` is optional and only used when role is 'admin'. **Requires environment variables:** `VITE_API_BASE_URL` (Vite) or `NEXT_PUBLIC_API_URL` (Next.js) for custom photo URLs. |
| `getDisplayName`         | Creates a user-friendly display name from a full name | `options: {`<br>`  fullName: string` - The user's full name<br>`  useFullName?: boolean` - Use full name (default: false)<br>`  maxLength?: number` - Max length for full name (default: 20)<br>`}`                                                                         | `string` - Formatted display name    | When `useFullName` is false, returns first + second word if combined length ≤ 12, otherwise just first word. Trims whitespace and handles empty strings gracefully. **No environment variables required.**                                                                                        |

**Examples:**

```typescript
import { getDefaultProfilePhoto, getDisplayName } from '@technway/rvnjs';

// Profile photo examples
const photoUrl = getDefaultProfilePhoto({
  role: 'user',
  photoPath: '/uploads/profile.jpg'
});
// Returns: "https://your-api.com/uploads/profile.jpg"

const defaultPhoto = getDefaultProfilePhoto({
  role: 'admin'
});
// Returns: "/avatars/admin.png"

// Display name examples
const shortName = getDisplayName({
  fullName: 'John Doe'
});
// Returns: "John Doe"

const longName = getDisplayName({
  fullName: 'John Michael Doe Smith'
});
// Returns: "John"

const fullName = getDisplayName({
  fullName: 'John Michael Doe Smith',
  useFullName: true,
  maxLength: 15
});
// Returns: "John Michael..."
```

### Logging Utilities

> **Why use these logging utilities instead of `console.log`?**
> 
> - **Environment-aware**: Logging is automatically disabled in production unless explicitly enabled
> - **Performance**: No logging overhead in production when disabled
> - **Centralized control**: Easy to enable/disable logging across your entire application
> - **Visual distinction**: Emoji prefixes make it easy to quickly identify log levels in the console
> - **Easy filtering**: Consistent log format makes it easier to filter logs in browser console using search or log level filters

> **Limitations:**
> 
> - **No Console Grouping**: The logger doesn't support `console.group()` and `console.groupEnd()` for hierarchical logging
> - **No Advanced Console Features**: Advanced console features like `console.table()`, `console.time()`, and `console.profile()` are not supported
> - **No Custom Styling**: Console styling using `%c` CSS is not supported
> - **No Stack Traces**: Automatic stack trace formatting is not included
> 
> If you need these features, consider using the native `console` methods directly or extending the logger.

**Main Logger vs Development-Only Logger:**

| Feature               | Main Logger (`logger()`)     | Development Logger (`devLog`, etc.) |
| --------------------- | ---------------------------- | ----------------------------------- |
| **Availability**      | Always available             | Only in development mode            |
| **Configuration**     | Controlled by env vars       | Always enabled in development       |
| **Interface**         | Method-based (`log.debug()`) | Function-based (`devLog()`)         |
| **Customization**     | Fixed emoji prefixes         | Customizable prefixes               |
| **Use Case**          | Production logging           | Development debugging               |
| **Performance**       | Optimized for production     | Development-focused                 |
| **Data Handling**     | Multiple arguments           | Single data object                  |
| **Advanced Features** | Not supported                | Not supported                       |

**When to use which:**

- **Use Main Logger (`logger()`)** when:
  - You need logging in both development and production
  - You want consistent logging across environments
  - You need to control logging via environment variables
  - You're logging application events or errors

- **Use Development Logger (`devLog`, etc.)** when:
  - You're debugging during development
  - You want simpler, more direct logging
  - You need custom prefixes for different types of logs
  - You're logging temporary debug information

| Function           | Description                                                   | Parameters | Returns                                                              | Notes                                                                                                                                                                                                                       |
| ------------------ | ------------------------------------------------------------- | ---------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isLoggingEnabled` | Returns true if logging is enabled in the current environment | None       | `boolean` - True if logging is enabled                               | Automatically enabled in development mode. Can be explicitly enabled via environment variables. **Optional environment variables:** `VITE_ENABLE_LOGGING=true` (Vite) or `NEXT_PUBLIC_ENABLE_LOGGING=true` (Next.js).       |
| `logger`           | Returns a logger instance with emoji-enhanced logging methods | None       | `LoggerType` - Logger instance with debug, info, warn, error methods | Each log level has a unique emoji prefix. Logging only occurs when `isLoggingEnabled()` returns true. **Optional environment variables:** `VITE_ENABLE_LOGGING=true` (Vite) or `NEXT_PUBLIC_ENABLE_LOGGING=true` (Next.js). |

**Development-Only Logging Utilities:**

These utilities are only active in development mode and provide a simpler interface for common logging needs.

| Function   | Description                               | Parameters                                                      | Notes                                               |
| ---------- | ----------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------- |
| `devLog`   | Logs a message in development environment | `options: { message: string, data?: unknown, prefix?: string }` | Only logs if in development mode. Default prefix: 🔧 |
| `devError` | Logs an error in development environment  | `options: { message: string, data?: unknown, prefix?: string }` | Only logs if in development mode. Default prefix: ❌ |
| `devWarn`  | Logs a warning in development environment | `options: { message: string, data?: unknown, prefix?: string }` | Only logs if in development mode. Default prefix: ⚠️ |
| `devInfo`  | Logs info in development environment      | `options: { message: string, data?: unknown, prefix?: string }` | Only logs if in development mode. Default prefix: ℹ️ |

**Logger Methods:**

| Method                    | Emoji | Description         | Notes                                                  |
| ------------------------- | ----- | ------------------- | ------------------------------------------------------ |
| `debug(message, ...args)` | 🐛     | DEBUG level logging | Use for detailed debugging information                 |
| `info(message, ...args)`  | ℹ️     | INFO level logging  | Use for general application information                |
| `warn(message, ...args)`  | ⚠️     | WARN level logging  | Use for warning conditions that don't stop execution   |
| `error(message, ...args)` | ❌     | ERROR level logging | Use for error conditions that may affect functionality |

**Type Exports:**

| Type         | Description                                               | Notes                                                                                                         |
| ------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `LogLevel`   | TypeScript type: `'debug' \| 'info' \| 'warn' \| 'error'` | Use this type when creating custom logging functions or when you need to specify log levels programmatically. |
| `LogOptions` | TypeScript interface for logging options                  | `{ message: string, data?: unknown, prefix?: string }` - Use for development-only logging utilities.          |

**Environment Variables for Logging:**
- Next.js: `NEXT_PUBLIC_ENABLE_LOGGING=true`
- Vite: `VITE_ENABLE_LOGGING=true`
- Automatically enabled in development mode

**Examples:**

```typescript
import { logger, devLog, devError } from '@technway/rvnjs';

// Using the main logger
const log = logger();
log.info('Application started');
// Output: ℹ️ INFO: Application started

log.error('Failed to connect', new Error('Connection timeout'));
// Output: ❌ ERROR: Failed to connect Error: Connection timeout

// Using development-only utilities
devLog({ message: 'Debug info', data: { userId: 123 } });
// Output: 🔧 Debug info { userId: 123 }

devError({ 
  message: 'API Error', 
  data: new Error('Network error'),
  prefix: '🚫' // Custom prefix
});
// Output: 🚫 API Error Error: Network error
```

### Type Exports

| Type       | Description                                               | Notes                                                                                                         |
| ---------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `LogLevel` | TypeScript type: `'debug' \| 'info' \| 'warn' \| 'error'` | Use this type when creating custom logging functions or when you need to specify log levels programmatically. |

### Environment Utilities

| Function        | Description                                               | Parameters                                                                                                                     | Returns                                 | Notes                                                                                                                                                                                                                                                   |
| --------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isDevEnv`      | Returns true if running in development environment        | None                                                                                                                           | `boolean` - True if in development mode | Checks both `NODE_ENV` and Vite's `VITE_ENABLE_LOGGING` environment variables. Used internally by other utilities. **No additional environment variables required.**                                                                                    |
| `getApiBaseUrl` | Returns the appropriate API base URL based on environment | `options: {`<br>`  customBaseUrl?: string` - Optional custom base URL<br>`  customApiPath?: string` - Optional API path<br>`}` | `string` - API base URL                 | Follows environment variable priority order. Returns empty string if no valid URL is found. Used by `getDefaultProfilePhoto` for building full URLs. **Requires environment variables:** `VITE_API_BASE_URL` (Vite) or `NEXT_PUBLIC_API_URL` (Next.js). |

**Environment Variable Priority:**
1. Next.js: `NEXT_PUBLIC_API_URL`
2. Vite: `VITE_API_BASE_URL`
3. Fallback: Empty string

## License

MIT
