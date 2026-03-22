---
name: "sdd-propose"
description: "SDD Phase 3: propose solution options with trade-offs and get developer buy-in before writing the formal spec."
tier: 2
triggers: ["sdd propose", "sdd phase 3", "propose solution", "solution options", "proposal"]
context_cost: 300
---

# SDD Propose — Phase 3: Proposal

## Purpose
Present 2-3 solution options with trade-offs, and get explicit developer buy-in on the chosen approach before investing in a formal spec. This is the cheapest phase to change direction.

## Use when
- `02-explore.md` is complete.
- There are meaningful trade-offs to discuss.

## Do not use when
- There is only one viable option — skip to `sdd-spec` directly (document the decision in spec).
- The developer has already chosen an approach — document it in the spec and proceed.

## Proposal Structure

Each option must include:
- **Summary** — 1-2 sentences
- **How it works** — key mechanism
- **Pros** — concrete benefits
- **Cons** — concrete costs and risks
- **Effort** — rough estimate (hours/days)

## Output: 03-proposal.md

```markdown
# Proposal — <Change Title>

**Date:** YYYY-MM-DD
**Phase:** 3 — Proposal
**Status:** PENDING | APPROVED

## Context (from Exploration)
Brief reminder of the core problem and key constraints from Phase 2.

## Option A: <Name>
**Summary:** Add refresh token support with sliding expiry.

**How it works:**
- Issue short-lived access tokens (15min) + long-lived refresh tokens (7d)
- Client stores refresh token in httpOnly cookie
- `/api/auth/refresh` endpoint issues new access token

**Pros:**
- Industry standard, well-understood
- Limits exposure window of a compromised access token

**Cons:**
- Requires client-side changes (mobile app update needed)
- More state to manage (refresh token table in DB)

**Effort:** 3-4 days

---

## Option B: <Name>
**Summary:** Keep current token model, add token rotation via Redis.

**How it works:**
- Access tokens stay long-lived but are stored in Redis
- Token invalidation becomes possible (logout works)
- No client changes required

**Pros:**
- No mobile client changes
- Logout/revoke works immediately

**Cons:**
- Adds Redis dependency
- Stateful — loses the stateless scaling benefit of JWT

**Effort:** 2 days

---

## Recommendation
**Recommended: Option A** — The mobile client changes are manageable (one release cycle) and the security model is significantly stronger.

## Developer Decision
- [ ] Option A approved
- [ ] Option B approved
- [ ] Neither — rethink needed

**Chosen:** ___________
**Reason:** ___________

## Next Phase
→ `sdd-spec` — formal specification of the chosen approach.
```

## Rules
- Never present only one option — if there's only one, note it and proceed to spec.
- Recommendation is mandatory — don't force the developer to choose blind.
- Trade-offs must be concrete, not vague ("more complex" is not useful; "adds Redis as a prod dependency" is).
- Do not begin implementation until developer explicitly approves an option.

## Checklist Before Exiting Phase 3
- [ ] `specs/<change-id>/03-proposal.md` created
- [ ] At least 2 options presented (or documented why only 1 exists)
- [ ] Concrete pros/cons and effort for each option
- [ ] Recommendation stated
- [ ] Developer has marked their decision in the document
