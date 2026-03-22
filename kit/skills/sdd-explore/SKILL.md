---
name: "sdd-explore"
description: "SDD Phase 2: technical exploration — map the codebase, identify constraints, and surface unknowns before proposing a solution."
tier: 2
triggers: ["sdd explore", "sdd phase 2", "explore spec", "technical exploration"]
context_cost: 320
---

# SDD Explore — Phase 2: Exploration

## Purpose
Understand the problem space deeply before proposing a solution. Map affected code, identify constraints, surface unknowns, and produce an exploration report that makes Phase 3 (Proposal) possible.

## Use when
- `01-intake.md` is complete and approved.
- The problem space is not yet fully understood.

## Do not use when
- The solution is already known and exploration would be purely ceremonial.
- Intake has not been completed (use `sdd-init` first).

## Exploration Activities

### 1. Codebase Mapping
- Identify files, modules, and services directly affected.
- Identify indirect dependencies that could break.
- Find existing tests that cover the affected area.

### 2. Constraint Discovery
- Performance requirements
- Security constraints (auth, data access)
- Backward compatibility requirements
- External API contracts

### 3. Prior Art
- Is there existing code that already does part of this?
- Are there patterns in the codebase to follow?
- Check `docs/engram/` for prior decisions on this area.

### 4. Risk Identification
- What could go wrong?
- What is hard to reverse?
- What depends on external systems?

## Output: 02-explore.md

```markdown
# Exploration — <Change Title>

**Date:** YYYY-MM-DD
**Phase:** 2 — Explore

## Affected Areas

### Direct
- `src/auth/middleware.ts` — JWT validation logic
- `src/users/service.ts` — User lookup on token validate

### Indirect
- `src/api/routes/*.ts` — All routes using `requireAuth` middleware

## Key Findings

1. **Finding:** JWT validation currently happens in middleware but errors are swallowed.
   **Impact:** Silent failures mean unauthenticated requests proceed.

2. **Finding:** No refresh token logic exists.
   **Impact:** Tokens never expire in practice — security gap.

## Constraints
- Must remain backward compatible with existing mobile clients (no breaking API changes).
- Token format cannot change (existing tokens in the wild).

## Unknowns / Open Questions
- [ ] What is the current token expiry strategy? (check DB and env vars)
- [ ] Are there integration tests for auth middleware? (only found unit tests)

## Engram References
- Decision `001-jwt-approach` — JWT was chosen over sessions for stateless scaling.

## Recommendation
Ready to propose. Main risk: mobile client backward compatibility requires testing.

## Next Phase
→ `sdd-propose` — present solution options with trade-offs.
```

## Rules
- Exploration is about discovery, not implementation. Write no production code in this phase.
- Open questions must be answered before proceeding to Proposal.
- If exploration reveals the problem is larger than intake suggested, update `01-intake.md` before proceeding.
- Check Engram for prior decisions on the affected area — avoid re-solving solved problems.

## Checklist Before Exiting Phase 2
- [ ] `specs/<change-id>/02-explore.md` created
- [ ] All direct and indirect affected areas listed
- [ ] Open questions are answered (or explicitly deferred with justification)
- [ ] Constraints documented
- [ ] Developer has reviewed exploration findings
