# TypeScript Ecosystem Adapter

## Purpose
Manage TypeScript/JavaScript environment resolution, package management, and validation standards.

## Use when
- Resolving which package manager to use in a TypeScript or JavaScript project.
- Running type-checks, linting, or tests in a TS/JS environment.
- Detecting monorepo workspace boundaries before running commands.
- Any task requiring ecosystem-aware command execution in a TypeScript codebase.

## Do not use when
- Working in a Python-only or shell-only project (use `python-ecosystem`).
- Reviewing code quality (use `code-review-pro`).

## Requirements
- Prefer `bun` if `bun.lockb` or `bun.lock` is present.
- Support `pnpm`, `npm`, or `yarn` based on lockfile detection.
- Respect monorepo workspace configurations.

## Ecosystem Detection Workflow
1. **Identifier Check:** Search for `bun.lockb`, `pnpm-lock.yaml`, `package-lock.json`, or `yarn.lock`.
2. **Tool Selection:** Map the lockfile to the correct execution command (`bun run`, `npm run`, etc.).
3. **Workspace Check:** Identify if the current path is part of a larger TS-monorepo workspace.

## Validation Mapping
When core rules request "Ecosystem Validation", execute:
- **Typechecking:** `tsc --noEmit` (default) or `tsc -p tsconfig.json`.
- **Linting:** `eslint .` or `biome check .` (if configured).
- **Formatting:** `prettier --check .` or `biome format .`.
- **Testing:** `npm test`, `vitest`, or `bun test`.

## Rules
- Strictly avoid `any`; enforce interfaces and custom types.
- Never use a global package manager command if a lockfile is present.
- Support strict mode in `tsconfig.json`.
- Prefer `Bun` for high-performance execution if no legacy constraints exist.
- Use `tsc --noEmit` as the final source of truth for type safety before any commit.

## Output
When reporting status, include:
- Detected package manager (bun, npm, pnpm, yarn).
- Type-check status (tsc).
- Linting/Formatting results.
