---
name: "commit-sentinel"
description: "Act as the gateway for Git history health by auditing every commit for strict atomicity, type-safety, and conventional compliance."
tier: 1
triggers: ["commit", "history", "atomic", "conventional", "git-quality"]
context_cost: 280
---
# Commit Sentinel

## Purpose
Act as the gateway for Git history health by auditing every commit for strict atomicity, type-safety, and conventional compliance. Eradicate "History Pollution."

## Use when
- Performing `git commit`, `git rebase`, or staging files.
- Concluding a bugfix or a feature sprint.
- Preparing changes for push to a shared branch.

## Do not use when
- Experimenting locally in an un-tracked throwaway branch.
- Performing code quality review (use `code-review-pro`).
- Debugging runtime issues (use `debugging`).

## The 4-Step Validation Protocol
Before every commit, execute:
1. **Surgical Diff Review**: `git diff --cached` to verify every line. Filter out `console.log` and unapproved `TODO`s.
2. **Strict Type Audit**: Run `bun x tsc --noEmit` (or equivalent). Zero type errors allowed.
3. **Linter Enforcement**: Run `bun run lint`. Ensure strict syntactic and security adherence.
4. **Logical Atomicity**: A commit must do exactly ONE thing. If the diff covers multiple fixes, use interactive staging (e.g., `git add -p` or script equivalents) to separate them.

## History Sculpting & Standards
- Enforce Conventional Commits always (`feat(scope):`, `fix(scope):`, `refactor(scope):`).
- NEVER push messy history. Clean up local commits via Interactive Rebase (`git rebase -i`) before pushing.
- Prevent the addition of "AI Smells" (over-specification, generated noise) to the commit history.
- Never use `--no-verify` to bypass safety hooks.

## Rules
- One logical change per commit.
- Follow repository commit conventions strictly.
- Commit only verified changes (type-check + lint passed).
- Keep messages concise, imperative, and descriptive.
- Never mix unrelated modifications in a single commit.
- Do not create commits if verification failed.
- Avoid committing generated artifacts, debug logs, or temporary files.

## Context Efficiency
Review only:
- staged files (`git diff --cached`)
- diff summaries
- affected module interfaces

Avoid reviewing:
- entire repository
- unchanged files
- build outputs

## Validation
Before confirming the commit:

- The commit represents a single logical change.
- No unrelated modifications are included.
- Conventional Commits format is respected.
- Type-check and linter succeeded.
- No generated artifacts were included accidentally.

## Output

Return:

### Commit Scope
Files and modules affected.

### Commit Message
Proposed commit message in Conventional Commits format.

### Verification Status
Commands executed and their results.

### Risks
Potential impacts or follow-ups needed.
