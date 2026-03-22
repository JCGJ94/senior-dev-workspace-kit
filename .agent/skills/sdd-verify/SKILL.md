---
name: "sdd-verify"
description: "SDD Phase 8: verify all acceptance criteria from the spec are met with explicit evidence before marking work complete."
tier: 2
triggers: ["sdd verify", "sdd phase 8", "verification", "verify spec", "acceptance criteria", "done criteria"]
context_cost: 300
---

# SDD Verify — Phase 8: Verification

## Purpose
Confirm that every acceptance criterion from `04-spec.md` is met. Produce `08-verification.md` as evidence. No work is complete without it.

## Use when
- Implementation (Phase 7) is complete.
- All tasks in `06-tasks.md` are checked off.

## Do not use when
- Implementation is still in progress — finish `sdd-apply` first.

## Verification Process

### 1. Run Automated Tests
```bash
bun test                    # unit tests
bun test:integration        # integration tests
bunx playwright test        # E2E (if applicable)
```

All tests must pass. A partial pass is not verification.

### 2. Check Acceptance Criteria
Go through each criterion in `04-spec.md` one by one. For each, provide evidence:
- Test name and result
- Command output
- Screenshot (for UI changes)
- API response example

### 3. Manual Spot Checks
For critical flows, run manual verification even if tests pass:
- Auth flows
- Data mutation paths
- Error paths

### 4. Regression Check
Confirm no existing tests broke:
```bash
bun test --reporter verbose
```

## Output: 08-verification.md

```markdown
# Verification — <Change Title>

**Date:** YYYY-MM-DD
**Phase:** 8 — Verification
**Verdict:** PASS ✓ | FAIL ✗ | PARTIAL

## Test Results

```
bun test src/auth/
✓ RefreshTokenService › validates a valid token (2ms)
✓ RefreshTokenService › rejects expired token (1ms)
✓ RefreshTokenService › rejects revoked token (1ms)
✓ RefreshTokenRepository › creates and finds by hash (8ms)
✓ POST /auth/refresh › returns 200 for valid token (45ms)
✓ POST /auth/refresh › returns 401 for expired token (12ms)
✓ DELETE /auth/logout › revokes token (18ms)

7 tests passed, 0 failed
```

## Acceptance Criteria Evidence

| Criterion | Status | Evidence |
|---|---|---|
| POST /refresh with valid token returns new accessToken | ✓ | Test: "returns 200 for valid token" |
| POST /refresh with expired token returns 401 REFRESH_TOKEN_EXPIRED | ✓ | Test: "returns 401 for expired token" |
| DELETE /logout revokes token — subsequent refresh fails | ✓ | Test: "revokes token" → follow-up: "returns 401 for revoked token" |
| Refresh tokens older than 7 days are pruned by cron | ✓ | T09 cron task implemented; verified via unit test |
| Raw token never stored — only SHA-256 hash | ✓ | Code review: `token_hash = sha256(rawToken)` — raw token never persisted |

## Regression Check

```
bun test
247 tests passed, 0 failed
```
No regressions. Full suite passes.

## Known Limitations / Deferred Items
- Token rotation (each use issues a new refresh token) deferred to follow-up per Phase 5 design decision.

## Verdict
**PASS ✓** — All acceptance criteria met. Ready to archive.

## Next Phase
→ `sdd-archive` — capture lessons and close the spec.
```

## Rules
- Verification is a phase, not a footnote. It produces an artifact.
- A "it works on my machine" claim without evidence is not verification.
- If any acceptance criterion fails, return to Phase 7 (Apply) and fix before verifying again.
- Deferred items must be logged — they are not failures, but they must be tracked.

## Checklist Before Exiting Phase 8
- [ ] `specs/<change-id>/08-verification.md` created
- [ ] All acceptance criteria from `04-spec.md` have explicit evidence
- [ ] Full test suite passes (no regressions)
- [ ] Verdict is recorded (`PASS` / `FAIL` / `PARTIAL`)
- [ ] Developer has reviewed verification evidence
