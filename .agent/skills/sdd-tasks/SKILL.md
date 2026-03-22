---
name: "sdd-tasks"
description: "SDD Phase 6: break the design into atomic, ordered implementation tasks with explicit dependencies and acceptance conditions."
tier: 2
triggers: ["sdd tasks", "sdd phase 6", "task breakdown", "implementation tasks", "task list"]
context_cost: 300
---

# SDD Tasks — Phase 6: Task Breakdown

## Purpose
Convert the technical design into an ordered list of atomic implementation tasks. Each task must be completable in a single session, have clear input/output, and carry its own acceptance condition.

## Use when
- The technical design (Phase 5) is approved.
- The implementation work needs to be organized for execution.

## Do not use when
- Tasks are already defined in Phase 5 design (rare but valid).
- The change is a single-task implementation — go directly to `sdd-apply`.

## Task Format

Each task includes:
- **ID** — `T01`, `T02`, etc.
- **Title** — imperative verb phrase ("Create X", "Add Y", "Update Z")
- **Depends on** — task IDs this must wait for (empty = parallelizable)
- **Deliverable** — what file/function/test exists when this is done
- **Acceptance** — verifiable condition to check off

## Output: 06-tasks.md

```markdown
# Tasks — <Change Title>

**Date:** YYYY-MM-DD
**Phase:** 6 — Tasks
**Total:** 8 tasks

## Task List

| ID | Title | Depends | Status |
|---|---|---|---|
| T01 | Write DB migration for refresh_tokens table | — | ☐ |
| T02 | Create RefreshToken TypeScript interface | — | ☐ |
| T03 | Create RefreshTokenRepository (DB access) | T01, T02 | ☐ |
| T04 | Create RefreshTokenService (validate/revoke logic) | T02, T03 | ☐ |
| T05 | Update AuthService — add issueRefreshToken(), revokeRefreshToken() | T04 | ☐ |
| T06 | Create POST /auth/refresh controller + route | T05 | ☐ |
| T07 | Create DELETE /auth/logout controller + route | T05 | ☐ |
| T08 | Write integration tests for T06 + T07 | T06, T07 | ☐ |

---

## Task Details

### T01 — Write DB migration for refresh_tokens table
**Deliverable:** `db/migrations/0015_add_refresh_tokens.sql`
**Acceptance:** Migration runs without error on a clean DB; `refresh_tokens` table exists with correct columns and indexes.

### T02 — Create RefreshToken TypeScript interface
**Deliverable:** `RefreshToken` interface in `src/auth/auth.types.ts`
**Acceptance:** Interface matches the spec's data model; no TypeScript errors.

### T03 — Create RefreshTokenRepository
**Deliverable:** `src/auth/refresh-token.repository.ts` with `findByHash()`, `create()`, `revoke()`, `pruneExpired()`
**Acceptance:** All methods implemented; unit tests pass with mock DB.

### T04 — Create RefreshTokenService
**Deliverable:** `src/auth/refresh-token.service.ts` with `validate()` (checks expiry + revoked) and `rotate()` methods
**Acceptance:** Unit tests cover: valid token, expired token, revoked token.

### T05 — Update AuthService
**Deliverable:** `issueRefreshToken(userId)` and `revokeAllForUser(userId)` in `src/auth/auth.service.ts`
**Acceptance:** Existing auth tests still pass; new methods have unit tests.

### T06 — POST /auth/refresh controller
**Deliverable:** `src/auth/controllers/refresh.controller.ts` + route registered in `auth.router.ts`
**Acceptance:** Returns 200 with new accessToken for valid refresh token; returns 401 for invalid/expired.

### T07 — DELETE /auth/logout controller
**Deliverable:** Logout controller + route registered in `auth.router.ts`
**Acceptance:** Revokes refresh token; subsequent refresh returns 401.

### T08 — Integration tests
**Deliverable:** `src/auth/__tests__/refresh.integration.test.ts`
**Acceptance:** Tests cover all acceptance criteria from 04-spec.md; all tests pass.
```

## Rules
- Tasks must be atomic — completable in one focused session without leaving things half-done.
- Dependencies must be explicit — no implicit ordering.
- Every task has an acceptance condition — "done" is verifiable, not subjective.
- Tasks should build on each other: data layer → service layer → controller → tests.
- Do not begin Phase 7 (Apply) until this task list is approved.

## Checklist Before Exiting Phase 6
- [ ] `specs/<change-id>/06-tasks.md` created
- [ ] All tasks from Phase 5 design are covered
- [ ] Dependencies are explicitly mapped
- [ ] Every task has a deliverable and acceptance condition
- [ ] Developer has reviewed and approved the task list
