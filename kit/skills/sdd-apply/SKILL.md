---
name: "sdd-apply"
description: "SDD Phase 7: execute implementation tasks from 06-tasks.md in order, checking off each task as it completes."
tier: 2
triggers: ["sdd apply", "sdd phase 7", "implement spec", "execute tasks", "apply spec"]
context_cost: 310
---

# SDD Apply — Phase 7: Implementation

## Purpose
Execute the implementation tasks from `06-tasks.md` in dependency order. Check off each task as it completes. Log deviations, surprises, and unresolved risks in `07-implementation-log.md`.

## Use when
- Phase 6 task list is approved.
- Ready to write production code.

## Do not use when
- Tasks haven't been defined (run `sdd-tasks` first).
- Exploration or design is still open.

## Execution Rules

1. **One task at a time** — complete T01 before starting T02.
2. **Verify before proceeding** — each task's acceptance condition must pass before moving to the next.
3. **Log deviations immediately** — if implementation diverges from the spec, log it and decide: update spec or revert implementation.
4. **Do not expand scope** — if new work is discovered, add it as a new task in `06-tasks.md`, do not implement it silently.
5. **Commit per task** — each task should produce a clean, atomic commit.

## Implementation Log: 07-implementation-log.md

```markdown
# Implementation Log — <Change Title>

**Date:** YYYY-MM-DD
**Phase:** 7 — Implementation

## Progress

| Task | Status | Notes |
|---|---|---|
| T01 | ✓ Complete | — |
| T02 | ✓ Complete | Added `RevokedToken` helper type (not in spec — minor) |
| T03 | ⚡ In Progress | — |
| T04-T08 | ☐ Pending | — |

## Deviations from Spec

### Deviation 001
**Task:** T02
**What happened:** Added `RevokedToken = Omit<RefreshToken, 'revokedAt'> & { revokedAt: Date }` helper type.
**Why:** Makes the `revoke()` return type more precise in TypeScript without changing the DB schema.
**Decision:** Minor additive change — spec not updated; logged here for traceability.

---

### Deviation 002
**Task:** T03
**What happened:** `findByHash()` returns `null` instead of throwing when not found.
**Why:** Spec didn't specify; null return is idiomatic for repository pattern.
**Decision:** Spec updated in 04-spec.md to reflect this. Caller handles null case.

## Unresolved Risks
- Cron job for pruning expired tokens (from acceptance criteria) not yet scheduled — marked as T09 added to task list.

## Surprises
- `bcrypt` is used for password hashing but is not available as an abstraction for token hashing. Using `crypto.createHash('sha256')` directly.
```

## Commit Convention
Follow the project's commit convention. Each task produces one commit:
```
feat(auth): add refresh_tokens DB migration [T01]
feat(auth): add RefreshToken interface [T02]
feat(auth): add RefreshTokenRepository [T03]
```

## Rules
- Never skip the implementation log — it is the evidence trail for Phase 8 (Verify).
- If a task's acceptance condition fails, fix the task before moving to the next.
- Deviations from spec require a decision: log + update spec, or revert the deviation.
- Do not commit debug code, console.logs, or TODO comments without a linked task.

## Checklist Before Exiting Phase 7
- [ ] All tasks in `06-tasks.md` marked complete
- [ ] `specs/<change-id>/07-implementation-log.md` maintained throughout
- [ ] All deviations from spec are logged and resolved
- [ ] No new TODOs or debug artifacts left in code
- [ ] All commits are clean and follow convention
