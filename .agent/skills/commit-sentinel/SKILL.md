# Commit Sentinel

## Purpose
Act as the gateway for Git history health by auditing every commit for strict atomicity, type-safety, and conventional compliance. Eradicate "History Pollution."

## Use when
- Performing `git commit`, `git rebase`, or staging files.
- Concluding a bugfix or a feature sprint.

## Do not use when
- Experimenting locally in an un-tracked throwaway branch.

## The 4-Step Validation Protocol
Before every commit, execute:
1. **Surgical Diff Review**: `git diff --cached` to verify every line. Filter out `console.log` and unapproved `TODO`s.
2. **Strict Type Audit**: Run `bun x tsc --noEmit` (or equivalent). Zero type errors allowed.
3. **Linter Enforcement**: Run `bun run lint`. Ensure strict syntactic and security adherence.
4. **Logical Atomicity**: A commit must do exactly ONE thing. If the diff covers multiple fixes, use interactive staging (e.g., `git add -p` or script equivalents) to separate them.

## History Sculpting & Standards
- enforce Conventional Commits always (`feat(scope):`, `fix(scope):`, `refactor(scope):`).
- NEVER push messy history. Clean up local commits via Interactive Rebase (`git rebase -i`) before pushing.
- Prevent the addition of "AI Smells" (over-specification, generated noise) to the commit history.
- Never use `--no-verify` to bypass safety hooks.
