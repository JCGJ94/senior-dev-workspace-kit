---
name: "sdd-archive"
description: "SDD Phase 9: close the spec, capture lessons learned, and promote reusable knowledge to Engram."
tier: 2
triggers: ["sdd archive", "sdd phase 9", "close spec", "archive spec", "lessons learned", "wrap up spec"]
context_cost: 270
---

# SDD Archive — Phase 9: Archive

## Purpose
Close the SDD change formally. Capture lessons, decisions worth remembering, and patterns worth reusing. Promote durable knowledge to Engram. Mark the spec as ARCHIVED.

## Use when
- Verification (Phase 8) passed with a PASS verdict.
- The change is deployed or merged to main.

## Do not use when
- Verification has not passed — do not archive incomplete or failing work.

## Archive Activities

### 1. Write 09-archive.md
Capture:
- What was built (2-3 sentences)
- What went well
- What was harder than expected
- Patterns worth reusing
- Decisions worth remembering

### 2. Update summary.md
Mark status as ARCHIVED with the completion date.

### 3. Promote to Engram
For any significant decision or pattern, create an Engram entry:
```bash
POST /observations
{
  "type": "decision" | "pattern" | "lesson",
  "content": "...",
  "tags": ["auth", "jwt", "refresh-tokens"],
  "source": "specs/feat-auth-refresh/09-archive.md"
}
```

### 4. Update docs/engram/index.md
Add a pointer to the new Engram entries if the archive contains significant reusable knowledge.

## Output: 09-archive.md

```markdown
# Archive — <Change Title>

**Date:** YYYY-MM-DD
**Phase:** 9 — Archive
**Status:** ARCHIVED
**Spec:** specs/feat-auth-refresh/

## What Was Built
Added refresh token support to the auth service. Short-lived access tokens (15min) backed by long-lived refresh tokens (7d) stored as SHA-256 hashes. Includes `/auth/refresh` and `/auth/logout` endpoints.

## What Went Well
- Keeping the token hashing in a single utility function made the repository clean and testable.
- Integration tests with a real DB caught a subtle index issue that unit tests missed.
- The task breakdown was accurate — all 8 tasks fit within the estimated effort.

## What Was Harder Than Expected
- The SHA-256 hashing approach required verifying that `crypto.createHash` is available in the Bun runtime (it is — part of Node.js compat).
- Cron job scheduling was not in the original task list — discovered during verification.

## Reusable Patterns
- **Token hashing pattern:** `crypto.createHash('sha256').update(rawToken).digest('hex')` — reusable for any token-as-hash storage need.
- **Repository null return:** `findByHash()` returns `null` (not throws) for not-found — consistent with other repositories in this codebase.

## Decisions for Engram
- [x] Promoted: "Refresh token hashing — use SHA-256, never bcrypt for tokens" → `engram/decisions/003-token-hashing.md`
- [x] Promoted: "Token rotation deferred — v1 uses single token per session" → implementation log

## Spec Files
- `01-intake.md` ✓
- `02-explore.md` ✓
- `03-proposal.md` ✓
- `04-spec.md` ✓
- `05-design.md` ✓
- `06-tasks.md` ✓ (9 tasks)
- `07-implementation-log.md` ✓
- `08-verification.md` ✓ (PASS)
- `09-archive.md` ✓ (this file)
```

## Rules
- Archive is not optional — it is the mechanism by which the team learns from what was built.
- Engram promotion should be selective: only decisions and patterns that are genuinely reusable.
- Do not archive until verification passes. A PARTIAL verdict requires explicit developer sign-off.
- The archive is the last place to note "we should do X next" — file follow-up issues in the tracker, not in the archive.

## Checklist for Completing Phase 9
- [ ] `specs/<change-id>/09-archive.md` created
- [ ] `specs/<change-id>/summary.md` updated with ARCHIVED status and completion date
- [ ] Significant decisions/patterns promoted to Engram
- [ ] `docs/engram/index.md` updated if new Engram entries were created
- [ ] Developer has signed off on the archive
- [ ] Follow-up items filed as issues (not left as TODOs in the archive)
