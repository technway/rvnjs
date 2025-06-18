<div align="center">

<img src="https://github.com/user-attachments/assets/867c5d8c-0c1a-45f1-87ce-cf333c4987ba" alt="RVNJS Logo" width="190" />

<h1>RVNJS – Utilities for React (using Vite) and Next.js</h1>

<p>A minimal utility library offering essential helpers for React (using Vite) and Next.js applications.</p>

<a href="https://www.npmjs.com/package/@technway/rvnjs"><img src="https://img.shields.io/npm/v/@technway/rvnjs.svg" alt="npm version"></a> <a href="https://www.npmjs.com/package/@technway/rvnjs"><img src="https://img.shields.io/npm/dt/@technway/rvnjs.svg" alt="npm downloads"></a> <a href="https://github.com/technway/rvnjs/actions"><img src="https://github.com/technway/rvnjs/actions/workflows/ci.yml/badge.svg" alt="CI Status"></a> <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg" alt="TypeScript"></a>

</div>

- [Features](#features)
- [Installation](#installation)
- [API Reference](#api-reference)
  - [User Utilities](#user-utilities)
    - [Type Exports](#type-exports)
    - [Examples](#examples)
  - [Logging Utilities](#logging-utilities)
    - [Why use this?](#why-use-this)
    - [Limitations](#limitations)
    - [Comparison](#comparison)
    - [Main Logging](#main-logging)
    - [Dev Logging Functions](#dev-logging-functions)
    - [Logger Methods](#logger-methods)
    - [Type Exports](#type-exports-1)
    - [Examples](#examples-1)
  - [Environment Utilities](#environment-utilities)
    - [Environment Variable Priority](#environment-variable-priority)
    - [Type Exports](#type-exports-2)
- [License](#license)

---

## Features

* Automatically supports both Vite (React) and Next.js environments
* TypeScript support with full definitions and JSDoc for all functions
* Utilities adapt based on environment variables
* Most-featured utilities: [Logging Utilities](#logging-utilities)

## Installation

```bash
# npm
npm install @technway/rvnjs

# yarn
yarn add @technway/rvnjs

# pnpm
pnpm add @technway/rvnjs
```

---

## API Reference

### User Utilities

| Function                 | Description                                                        | Parameters                                                                                                          | Returns                      | Notes                                                                                                                                                                                                                                |
| ------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `resolveAvatar`          | Resolves a user profile image URL                                  | `options: { path?: string \| null, fallback?: string, baseUrl?: string \| false }`                                  | `string` - Final image URL   | HTTPS URLs returned as-is. HTTP URLs only allowed in dev. Relative paths are prefixed with API base URL. Fallback is returned for empty or disallowed paths. Requires `VITE_API_BASE_URL` (Vite) or `NEXT_PUBLIC_API_URL` (Next.js). |
| `getDisplayName`         | Builds a readable name from a full name                            | `options: { fullName: string, useFullName?: boolean, maxLength?: number }`                                          | `string` - Display name      | Returns full name or a shortened version depending on flags. Trims and safely handles edge cases. No environment variables required.                                                                                                 |
| `getDefaultProfilePhoto` | ~~Returns a user avatar based on role or fallback~~ *(deprecated)* | `options: { role?: string \| null, photoPath?: string \| null, userAvatarPath?: string, adminAvatarPath?: string }` | `string` - Profile photo URL | **Deprecated**. Use `resolveAvatar` instead. Falls back to role-specific avatars or API base + `photoPath`.                                                                                                                          |

#### Type Exports

| Type                  | Description                                         | Notes                                                                     |
| --------------------- | --------------------------------------------------- | ------------------------------------------------------------------------- |
| `AvatarOptions`       | Options for `resolveAvatar()`                       | `{ path?: string \| null, fallback?: string, baseUrl?: string \| false }` |
| `DisplayNameOptions`  | Options for `getDisplayName()`                      | `{ fullName: string, useFullName?: boolean, maxLength?: number }`         |
| `ProfilePhotoOptions` | *(Deprecated)* Legacy options for avatar resolution | Used by `getDefaultProfilePhoto()`. Prefer `AvatarOptions`.               |

#### Examples

```ts
import { resolveAvatar, getDisplayName } from '@technway/rvnjs';

resolveAvatar({ path: 'https://example.com/photo.jpg' });
// → 'https://example.com/photo.jpg'

resolveAvatar({ path: '/uploads/user.jpg' });
// → 'https://your-api.com/uploads/user.jpg'

getDisplayName({ fullName: 'John Michael Doe Smith' });
// → 'John'

getDisplayName({ fullName: 'John Michael Doe Smith', useFullName: true, maxLength: 15 });
// → 'John Michael...'
```

---

### Logging Utilities

> Logging is automatically disabled in production unless explicitly enabled.

#### Why use this?

* 🧠 Environment-aware: auto-disables in production
* ⚡ Zero cost in prod when unused
* ℹ️ Emoji-prefixed logs for easier scanning
* 🔧 Central toggle via env vars
* 🧼 Cleaner, filterable output in browser console

#### Limitations

* No `console.group()`, `console.table()`, `console.trace()` support
* No custom styles (`%c`)
* Use native `console` directly for advanced cases

#### Comparison

| Feature             | `logger()` (Main Logger)          | `devLog()` etc (Dev-Only)         |
| ------------------- | --------------------------------- | --------------------------------- |
| Logging Mode        | Env-controlled (`ENABLE_LOGGING`) | Only in development               |
| Interface           | Object with `.debug()` etc        | Function with `LogOptions` object |
| Output Format       | Emoji-prefixed messages           | Emoji-prefixed messages           |
| Performance in Prod | No-op unless explicitly enabled   | No-op always                      |
| Use Case            | General app logging               | Dev debugging & warnings          |

#### Main Logging

| Function           | Description                                    | Returns      | Notes                                                                |
| ------------------ | ---------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| `isLoggingEnabled` | Returns true if logging is enabled             | `boolean`    | Controlled via `VITE_ENABLE_LOGGING` or `NEXT_PUBLIC_ENABLE_LOGGING` |
| `logger`           | Returns a logger object (`debug`, `info`, etc) | `LoggerType` | Each log prefixed with emoji (🐛, ⚠️, ❌, ℹ️)                            |

#### Dev Logging Functions

| Function   | Description                      | Parameters                            | Notes             |
| ---------- | -------------------------------- | ------------------------------------- | ----------------- |
| `devLog`   | Logs debug in development only   | `{ message: string, data?, prefix? }` | Default prefix: 🔧 |
| `devError` | Logs error in development only   | `{ message: string, data?, prefix? }` | Default prefix: ❌ |
| `devWarn`  | Logs warning in development only | `{ message: string, data?, prefix? }` | Default prefix: ⚠️ |
| `devInfo`  | Logs info in development only    | `{ message: string, data?, prefix? }` | Default prefix: ℹ️ |

#### Logger Methods

| Method        | Emoji | Purpose        |
| ------------- | ----- | -------------- |
| `log.debug()` | 🐛     | Debugging info |
| `log.info()`  | ℹ️     | General info   |
| `log.warn()`  | ⚠️     | Warnings       |
| `log.error()` | ❌     | Errors         |

#### Type Exports

| Type         | Description                       | Notes                                                  |        |           |                     |
| ------------ | --------------------------------- | ------------------------------------------------------ | ------ | --------- | ------------------- |
| `LogLevel`   | \`'debug'                         | 'info'                                                 | 'warn' | 'error'\` | Internal log levels |
| `LogOptions` | Options for dev logging functions | `{ message: string, data?: unknown, prefix?: string }` |        |           |                     |

#### Examples

```ts
import { logger, devLog, devError } from '@technway/rvnjs';

const log = logger();
log.info('App started');
// → ℹ️ INFO: App started

devLog({ message: 'User loaded', data: { id: 123 } });
// → 🔧 User loaded { id: 123 }

devError({ message: 'Something failed', prefix: '🚫' });
// → 🚫 Something failed
```

---

### Environment Utilities

| Function        | Description                                    | Parameters                                           | Returns   | Notes                                                                                                                      |
| --------------- | ---------------------------------------------- | ---------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| `isDevEnv`      | Returns `true` if running in development mode  | None                                                 | `boolean` | Checks `NODE_ENV === 'development'` or `import.meta.env.MODE === 'development'`                                            |
| `getApiBaseUrl` | Returns base API URL from env or custom inputs | `{ customBaseUrl?: string, customApiPath?: string }` | `string`  | Reads from `VITE_API_BASE_URL` or `NEXT_PUBLIC_API_URL`. Appends path if provided. Trailing slashes removed automatically. |

#### Environment Variable Priority

1. `NEXT_PUBLIC_API_URL` (Next.js)
2. `VITE_API_BASE_URL` (Vite)
3. `API_URL` (fallback)

#### Type Exports

| Type                | Description                   | Notes                                                |
| ------------------- | ----------------------------- | ---------------------------------------------------- |
| `ApiBaseUrlOptions` | Options for `getApiBaseUrl()` | `{ customBaseUrl?: string, customApiPath?: string }` |

---

## License

MIT License © [Technway Solutions](https://technway.biz)