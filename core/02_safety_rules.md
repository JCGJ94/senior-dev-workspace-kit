# Safety Rules

## Purpose
Prevent catastrophic data loss, security breaches, and untraceable regressions.

## Scope
Database operations, Git tracking, environment variables, destructive shell commands. (Tier 0 Priority).

## Security & Secrets
- **No Commitment of Secrets:** NEVER commit API keys, connection strings, or `.env` files. Ensure `.env` is always in `.gitignore`.
- **Environment Handling:** Never execute `cat .env` to output secrets into the context window unless explicitly asked to debug an authentication issue. Provide masked templates (`.env.example`) instead.

## Destructive Operations (Require Explicit Affirmation)
- **Database:** NEVER execute raw destructive SQL (e.g., `DROP TABLE`, `ALTER TABLE`) directly in a live terminal. All schema changes must be written as discrete, numbered migration files (`001_create_users.sql`).
- **File System:** Never execute recursive deletion (`rm -rf /` or similar) on broad patterns. Delete files targeting exact explicit paths only.
- **Production Branches:** Assume `main`/`master` are protected. If deploying or modifying remote infrastructure, summarize the impact and wait for user confirmation.

## Git Protocol
- **Prohibited Atomicity Breaks:** NEVER execute `git add .` or `git commit -am`. This destroys atomic history.
- **Surgical Staging:** Only stage the exact files modified for the current task (`git add path/to/file`).
- **Use Dedicated Scripts:** Where possible, leverage provided workspace scripts (e.g., `committer.sh`) to ensure conventional commits and code passing before tracking.
