---
name: "sdd-design"
description: "SDD Phase 5: technical design — architecture decisions, module breakdown, and implementation approach."
tier: 2
triggers: ["sdd design", "sdd phase 5", "technical design", "architecture design", "implementation design"]
context_cost: 320
---

# SDD Design — Phase 5: Technical Design

## Purpose
Define HOW the spec will be implemented: which files to create/modify, how modules interact, which patterns to follow, and any architectural decisions. The output is a blueprint that makes Phase 6 (Tasks) mechanical.

## Use when
- The formal spec (Phase 4) is approved.
- The implementation spans multiple files, layers, or services.

## Do not use when
- The spec is trivially small (1-2 files, obvious implementation) — proceed directly to tasks.

## Design Concerns

### Architecture
- Which layers are touched? (presentation, service, data, infra)
- New abstractions? (services, repositories, hooks, utils)
- Module boundaries and dependencies

### Patterns
- Which existing patterns in the codebase to follow?
- Any new patterns being introduced? (document the decision)

### Data Flow
- How does data move through the system?
- Where is state held? (DB, cache, in-memory, client)

### Testing Strategy
- Unit: which functions/modules need unit tests?
- Integration: which paths need integration tests?
- E2E: does this require Playwright tests?

## Output: 05-design.md

```markdown
# Design — <Change Title>

**Date:** YYYY-MM-DD
**Phase:** 5 — Technical Design

## Architecture Overview

```
Client
  └── POST /api/auth/refresh
        └── RefreshController
              └── AuthService.refreshToken(token)
                    ├── TokenRepository.findByHash(hash)
                    ├── validate: expiry + revoked check
                    └── JwtService.signAccessToken(userId)
```

## New Files
| File | Purpose |
|---|---|
| `src/auth/refresh-token.repository.ts` | DB access for refresh_tokens table |
| `src/auth/refresh-token.service.ts` | Business logic: validate, rotate, revoke |
| `src/auth/controllers/refresh.controller.ts` | HTTP handler for POST /auth/refresh |
| `db/migrations/0015_add_refresh_tokens.sql` | Schema migration |

## Modified Files
| File | Change |
|---|---|
| `src/auth/auth.service.ts` | Add `issueRefreshToken()`, `revokeRefreshToken()` |
| `src/auth/auth.router.ts` | Register new routes |
| `src/auth/auth.types.ts` | Add `RefreshToken` interface |

## Key Design Decisions

### Token Hashing
Store SHA-256 hash of the refresh token, never the raw value. The client holds the raw token; the DB holds only the hash. Rotation: on each use, old token is revoked and new token issued.

**Why:** Limits blast radius of a DB breach — hashes cannot be used to authenticate.

### No Token Rotation (simplified)
Initial version does NOT rotate tokens on use — single refresh token per session, revoked on logout. Rotation can be added in a follow-up without changing the schema.

**Why:** Reduces complexity for v1; rotation adds client-side state management complexity.

## Testing Strategy
- **Unit:** `RefreshTokenService` — validate/revoke logic (mock repository)
- **Integration:** `POST /auth/refresh` endpoint with real DB (Testcontainers or test DB)
- **E2E:** Not needed — covered by integration tests

## Migration Plan
1. Deploy migration `0015_add_refresh_tokens.sql` (additive — no data loss)
2. Deploy new auth service (issues refresh tokens on login)
3. Existing sessions unaffected — old tokens still work until expiry

## Next Phase
→ `sdd-tasks` — break this design into atomic implementation tasks.
```

## Rules
- Design is a blueprint, not a specification. Keep it implementation-level.
- Every new file must have a stated purpose.
- Architectural decisions must be explained with a **Why** — not just documented.
- The testing strategy must be defined before tasks are written.

## Checklist Before Exiting Phase 5
- [ ] `specs/<change-id>/05-design.md` created
- [ ] All new and modified files listed with purpose
- [ ] Key architectural decisions documented with rationale
- [ ] Testing strategy defined
- [ ] Migration/rollout plan included (for data or breaking changes)
- [ ] Developer has reviewed and approved the design
