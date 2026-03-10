# Commit Sentinel

## Purpose
Guard repository integrity by ensuring commits are atomic, meaningful, and aligned with repository conventions before they are created.

## Use when
- Preparing a commit after completing a task.
- Reviewing staged changes before committing.
- Ensuring commit messages follow repository standards.
- Splitting large changes into safe atomic commits.

## Do not use when
- The repository does not use Git.
- No changes are staged.
- The task is still incomplete or unverified.
- Verification commands have not been executed.

## Commit Workflow

1. **Inspect the Change Set**
   - Review the staged diff.
   - Identify what problem the change solves.
   - Detect unrelated modifications in the same commit.

2. **Ensure Atomic Scope**
   - Each commit must represent **one logical change**.
   - Split commits when changes include:
     - feature + refactor
     - bug fix + formatting
     - multiple independent modules.

3. **Remove Noise**
   Avoid committing:

   - generated files
   - lockfile noise unrelated to the task
   - debug logs
   - temporary files
   - build artifacts

4. **Check Repository Conventions**
   Detect and follow the repository’s commit style:

   Examples:
   - Conventional commits
   - custom project style
   - simple imperative messages

   Never impose a format if the repository already defines one.

5. **Write a Deterministic Commit Message**

   Good commit messages:

   - describe **what changed**
   - optionally explain **why**
   - stay concise

   Example:
    fix(auth): validate JWT expiration correctly


Avoid:


changes
update stuff
fixes

6. **Verify Before Commit**
Ensure the change passes repository verification:

Examples may include:

- tests
- lint
- type checks
- build validation

Only commit verified changes.

7. **Check for Hidden Risks**

Review the commit for:

- breaking API changes
- schema migrations
- dependency updates
- configuration changes

These may require documentation or additional commits.

## Rules
- One logical change per commit.
- Never mix unrelated modifications.
- Follow repository commit conventions.
- Avoid committing generated artifacts.
- Commit only verified changes.
- Keep messages concise and descriptive.
- Prefer imperative tense in commit titles.
- Do not create commits if verification failed.

## Context Efficiency
To minimize context usage:

Review only:
- staged files
- diff summaries
- affected modules

Avoid reviewing:
- entire repository
- unchanged files
- build outputs

## Validation
Before confirming the commit:

- The commit represents a single logical change.
- No unrelated modifications are included.
- Repository commit style is respected.
- Verification commands succeeded.
- No generated artifacts were included accidentally.

## Output

Return:

### Commit Scope
Files and modules affected.

### Commit Message
Proposed commit message.

### Verification Status
Commands executed and result.

### Risks
Potential impacts or follow-ups.