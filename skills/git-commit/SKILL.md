---
name: "git-commit"
description: "Execute semantic git commit operations using Conventional Commits, parsing the working tree diff automatically."
tier: 1
triggers: ["commit", "git commit", "save changes", "conventional commit", "finalize branch"]
context_cost: 200
---
# Git Commit

## Purpose
Execute semantic `git commit` operations using the Conventional Commits specification, parsing the working tree diff automatically to deduce intent.

## Use when
- The user requests to save progress, commit changes, or finalize a feature branch.
- Standardizing commit histories for CI/CD compliance.

## Do not use when
- The user explicitly requests experimental debugging without aiming to track it permanently in git.
- The environment intentionally lacks Git isolation.

## Conventional Commit Structure
`<type>[optional scope]: <description>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

## Rules
- **No Wildcard Staging of Secrets**: Never run `git add .` indiscriminately without inspecting the directory status. Always protect `.env`, private keys, and config files from exposure. Note: the `committer.sh` script is strictly preferred if the environment supports it.
- **Analyze True Changes**: The commit message MUST accurately reflect the actual diff payload (`git diff --cached`), rather than exclusively relying on what the user verbally requested.
- **Imperative Mood**: Use "fix bug" not "fixed bug" or "fixes bug".
- **Enforce 72 Character Limit**: The summary description header must not exceed 72 characters to maintain legibility in `git log`.

## Context Efficiency
- Only execute `git diff --staged` or `git status --porcelain` rather than loading enormous files into context just to understand the diff.

## Validation
- Git executes the commit without hook failures or type-check failures.
- The commit follows the Conventional Commits specification perfectly.

## Output

Return a Git Execution Report:
### Commit Status
Success state, including any hooks triggered.
### Generated Message
The literal commit message and scope that was generated and applied.
