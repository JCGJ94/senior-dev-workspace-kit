---
name: "pr-review"
description: "Conduct systematic, actionable PR reviews: correctness, security, tests, design, and constructive feedback."
tier: 2
triggers: ["pr review", "code review", "pull request review", "review pr", "review this pr", "review this code"]
context_cost: 380
---

# PR Review

## Purpose
Conduct thorough, actionable, and constructive code reviews on pull requests. Surface real issues — correctness, security, test coverage, and design — without nitpicking style.

## Use when
- Reviewing a pull request before merge.
- Self-reviewing code before requesting review.
- Teaching review methodology to the team.

## Do not use when
- The task is an audit of the full codebase (use `code-review-pro`).
- The task is pure style/formatting enforcement (use linters).

## Review Tiers

| Tier | Blocks Merge? | Examples |
|---|---|---|
| **BLOCKER** | Yes | Security vulnerability, data loss, incorrect logic, broken tests |
| **ISSUE** | Yes | Missing error handling, missing test, bad API contract |
| **SUGGESTION** | No | Better naming, simpler implementation, edge case worth noting |
| **NIT** | No | Minor style, small readability improvement |

Always label comments with the tier: `[BLOCKER]`, `[ISSUE]`, `[SUGGESTION]`, `[NIT]`.

## Review Checklist

### 1. Correctness
- [ ] Does the code do what the PR description says?
- [ ] Are edge cases handled? (null/undefined, empty arrays, 0, negative numbers)
- [ ] Is concurrency handled correctly? (race conditions, mutex, atomic ops)
- [ ] Are error paths tested and handled?

### 2. Security
- [ ] No secrets, API keys, or tokens in code
- [ ] User input is validated/sanitized before use
- [ ] SQL queries use parameterized inputs (no concatenation)
- [ ] Authentication/authorization is correct at every endpoint
- [ ] No sensitive data in logs

### 3. Tests
- [ ] New code has tests
- [ ] Tests cover the happy path and at least one error path
- [ ] Tests are not testing implementation details (test behavior, not internals)
- [ ] No `test.skip` without a linked issue

### 4. Design
- [ ] Is the abstraction level appropriate? (not too generic, not too specific)
- [ ] Does this fit the existing architecture?
- [ ] Are dependencies justified? (no new dep for a one-liner utility)
- [ ] Is the public API backward compatible?

### 5. Readability
- [ ] Can you understand what this code does without reading every line?
- [ ] Are complex sections commented? (explain *why*, not *what*)
- [ ] Are variable/function names clear and consistent?

### 6. Performance (flag only when relevant)
- [ ] No N+1 queries in loops
- [ ] No unnecessary re-renders in React components
- [ ] Large data structures are paginated or streamed

## Comment Format

```
[BLOCKER] This SQL query concatenates user input directly into the query string.

User input `req.params.id` flows into:
  db.query(`SELECT * FROM users WHERE id = ${req.params.id}`)

This allows SQL injection. Use parameterized queries:
  db.query('SELECT * FROM users WHERE id = ?', [req.params.id])
```

```
[SUGGESTION] The `processItems` function does three things (filter, transform, sort).
Consider splitting into `filterItems`, `transformItems`, `sortItems` for testability.
Not a blocker — but would make unit tests for each step straightforward.
```

```
[NIT] `getUserData` → `getUser` is more consistent with the rest of the codebase
(see userService.ts).
```

## Constructive Tone Rules
- Critique the code, never the author. "This variable name is ambiguous" not "you named this poorly".
- Explain *why* something is an issue, not just that it is.
- For blockers, always provide a concrete fix or example.
- Acknowledge good patterns: "Nice use of useOptimistic here — keeps the UX fast."
- If unsure, ask: "I'm not sure I follow the intent here — can you clarify why X?"

## Self-Review Before Requesting Review
Run through this before pushing:
1. Read the diff as if you've never seen this code.
2. Can you explain every change in one sentence?
3. Does the PR do ONE thing? If not, split it.
4. Did you remove debug code, console.logs, TODOs?
5. Do the tests actually test the new behavior?

## PR Description Checklist
A good PR description includes:
- **What**: What changed?
- **Why**: Why is this change needed?
- **How**: Any non-obvious implementation decisions?
- **Testing**: How was this tested?
- **Screenshots**: For UI changes.

## Output
When reviewing, produce:
1. **Summary** — 2-3 sentences on what the PR does and overall quality.
2. **Blockers** — listed first, with fix suggestions.
3. **Issues** — listed second.
4. **Suggestions / Nits** — listed last.
5. **Verdict**: `APPROVE` / `REQUEST CHANGES` / `NEEDS DISCUSSION`.
