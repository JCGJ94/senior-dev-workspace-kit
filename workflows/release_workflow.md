# Release Workflow
## Purpose
Standardize deployment and versioning preparation.

## Scope
Production releases, CI/CD, semantic versioning.

## Priority
High

## Rules
- Run full test suite and `tsc --noEmit`.
- Generate CHANGELOG based on Conventional Commits.
- Bump version appropriately.
- Require manual verification for final deployment triggers.
