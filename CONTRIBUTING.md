# Contributing

Thank you for your interest in contributing to **@technway/rvnjs**. This guide outlines the contribution process and development standards.

## Code of Conduct

By participating in this project, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please review it before contributing.

## Creating an Issue

Before submitting a new issue:

* Search [existing issues](https://github.com/technway/rvnjs/issues) to avoid duplicates.
* Use the appropriate [issue template](.github/ISSUE_TEMPLATE) for bug reports, feature requests, or questions.
* Provide complete and relevant details as requested in the template.

Incomplete or vague issues may be closed without review.

## Creating a Pull Request

To contribute code:

1. Fork the repository and create a new branch from `main`.
2. Follow the project's coding conventions and file structure.
3. Ensure the following are complete:
   * All tests pass
   * Types are valid
   * Code is linted and properly formatted
   * Documentation is updated (for any props, methods, slots, or styles)
  
4. Use meaningful and Conventional Commit messages.
5. Open a pull request using the [PR template](.github/PULL_REQUEST_TEMPLATE.md).

> ✅ Keep PRs focused. Avoid mixing unrelated changes in a single PR.

### CI Checks

All pull requests trigger a GitHub Actions CI workflow. The following checks must pass for your PR to be considered:

* **Formatting** (`pnpm format:check`)
* **Linting** (`pnpm lint`)
* **Type checks** (`pnpm type-check`)
* **Unit/Integration tests** (`pnpm test`)
* **Build process** (`pnpm build`)

CI runs on Node.js versions `18.x` and `20.x`.

## Development Setup

### Prerequisites

* Node.js ≥ 18.0.0
* pnpm ≥ 9.0.0

### Installation

```bash
git clone https://github.com/technway/rvnjs.git
cd rvnjs
pnpm install
```

### Available Scripts

```bash
# Run all unit and integration tests
pnpm test

# Watch tests while developing
pnpm test:watch

# Check formatting
pnpm format:check

# Format all source files
pnpm format

# Lint code for issues
pnpm lint

# Run TypeScript type checks
pnpm type-check

# Build the library
pnpm build
```

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org) specification. Commit messages are automatically validated using [commitlint](https://github.com/conventional-changelog/commitlint).

### Format

```
<type>(optional scope): <description>

[optional body]

[optional footer]
```

**Examples:**

```
feat(env): add support for custom API base URL

Allows users to set a custom API base URL via environment variables.

Closes #123
```

```
fix(logger): prevent undefined error in production

Avoids crashes when logging is disabled by checking for undefined properties.
```

### Common Types

| Type       | Description                              |
| ---------- | ---------------------------------------- |
| `feat`     | Introduces a new feature                 |
| `fix`      | Fixes a bug                              |
| `docs`     | Documentation-only changes               |
| `style`    | Code formatting (no logic changes)       |
| `refactor` | Refactors code without changing behavior |
| `test`     | Adds or updates tests                    |
| `chore`    | Maintenance tasks (e.g., tooling, deps)  |