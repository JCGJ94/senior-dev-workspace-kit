---
name: "sdd-spec"
description: "SDD Phase 4: write the formal specification — contracts, interfaces, data models, and acceptance criteria."
tier: 2
triggers: ["sdd spec", "sdd phase 4", "formal spec", "specification", "write spec", "spec document"]
context_cost: 340
---

# SDD Spec — Phase 4: Formal Specification

## Purpose
Produce the formal specification: API contracts, data models, interfaces, error codes, and acceptance criteria. This document is the ground truth for implementation and verification.

## Use when
- A proposal has been approved (Phase 3 complete).
- The change has non-trivial contracts or interfaces that must be agreed upon before coding.

## Do not use when
- The change is purely internal refactor with no API surface changes.
- Phase 3 was skipped (single option) — merge spec with proposal context.

## Spec Sections

### Required
- **Contracts** — API endpoints, function signatures, event shapes
- **Data Models** — DB schemas, TypeScript interfaces, Zod schemas
- **Error Handling** — error codes, messages, HTTP status codes
- **Acceptance Criteria** — verifiable conditions that define "done"

### Optional (include when relevant)
- **State Machine** — for features with complex state transitions
- **Sequence Diagram** — for multi-service flows
- **Migration Plan** — for breaking changes

## Output: 04-spec.md

```markdown
# Spec — <Change Title>

**Date:** YYYY-MM-DD
**Phase:** 4 — Specification
**Based on:** Proposal Option A

## Contracts

### POST /api/auth/refresh
**Request:**
```json
{ "refreshToken": "string (JWT)" }
```
**Response 200:**
```json
{ "accessToken": "string (JWT, 15min expiry)" }
```
**Response 401:**
```json
{ "error": "REFRESH_TOKEN_INVALID" | "REFRESH_TOKEN_EXPIRED" }
```

### DELETE /api/auth/logout
**Auth:** Required (Bearer token)
**Response 204:** No body — refresh token revoked

---

## Data Models

### TypeScript
```ts
interface RefreshToken {
  id: string;          // uuid
  userId: string;
  token: string;       // hashed, never stored raw
  expiresAt: Date;
  createdAt: Date;
  revokedAt: Date | null;
}
```

### DB Schema (Postgres)
```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
```

---

## Error Codes
| Code | HTTP | Condition |
|---|---|---|
| `REFRESH_TOKEN_INVALID` | 401 | Token not found or malformed |
| `REFRESH_TOKEN_EXPIRED` | 401 | Token past `expires_at` |
| `REFRESH_TOKEN_REVOKED` | 401 | `revoked_at` is set |

---

## Acceptance Criteria
- [ ] `POST /api/auth/refresh` with valid token returns new access token
- [ ] `POST /api/auth/refresh` with expired token returns 401 `REFRESH_TOKEN_EXPIRED`
- [ ] `DELETE /api/auth/logout` revokes the refresh token (subsequent refresh fails)
- [ ] Refresh tokens older than 7 days are automatically pruned by a cron job
- [ ] Raw token is never stored — only SHA-256 hash

## Next Phase
→ `sdd-design` — technical design and implementation approach.
```

## Rules
- Spec is the contract. If implementation deviates, update the spec first and get approval.
- Acceptance criteria in the spec must match `08-verification.md` exactly.
- Error codes must be defined before implementation — no ad-hoc error strings.
- Data models must be typed (TypeScript interfaces + Zod schema if used for validation).

## Checklist Before Exiting Phase 4
- [ ] `specs/<change-id>/04-spec.md` created
- [ ] All API contracts defined (request/response shapes + error codes)
- [ ] Data models typed in TypeScript
- [ ] Acceptance criteria are verifiable (not vague)
- [ ] Developer has reviewed and approved the spec
