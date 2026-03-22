# Project Rules

## Purpose
Define minimum scaffolding, documentation, and metadata standards for any workspace project.

## Scope
Project initialization, package management, and repository structure. (Tier 2 Priority).

## Project Scaffolding Minimums
- Every project MUST have a valid `README.md` defining setup, dev commands (`dev`, `build`, `lint`), and environment requirements.
- `.gitignore` MUST be established before the first line of code is written, covering `node_modules`, build outputs (`.next`, `dist`), `.env` files, and OS noise.

## Dependency Management & Scripts
- Maintain a single source of truth for dependencies (e.g., only one `package.json` package manager footprint per workspace).
- Standardize npm/bun scripts: `lint`, `typecheck` (e.g., `tsc --noEmit`), `test`, `build`, `dev`. Avoid fragmented execution commands.

## Naming & Folder Conventions
- File and folder names should use `kebab-case` for URLs/routing and generic files, and `PascalCase` strictly for React/Vue UI Component files.
- Tests must be clearly separated (e.g., `__tests__/` folder or `*.test.ts` / `*.spec.ts` suffix alongside the file).

## Ownership & Versioning
- Commits must use Conventional Commits format (`feat:`, `fix:`, `chore:`, `refactor:`).
- Keep dependencies updated but lock versions for critical infrastructural tools.

## V3 Project Memory & Specs
- Non-trivial work should create or update an artifact directory under `specs/`.
- Durable project knowledge should live in `docs/engram/`, not only in ephemeral runtime state.
- Projects integrating this kit should keep setup, validation, and deploy knowledge linkable from repository docs.
