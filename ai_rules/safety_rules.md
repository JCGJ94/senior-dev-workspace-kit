# Safety Rules
## Purpose
Prevent destructive actions and security lapses.

## Scope
Database manipulation, Git tracking, file overwrites.

## Priority
High

## Rules
- Never use `git add .` automatically. Use precise git staging.
- Generate and use numbered migrations (e.g. `001_name.sql`) instead of direct SQL.
- Protect secrets from being committed or logged.
- Require manual verification before applying irreversible infra changes.
