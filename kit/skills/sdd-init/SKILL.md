---
name: "sdd-init"
description: "Bootstrap Spec-Driven Development in a project: create the specs/ directory, intake artifact, and register the change."
tier: 2
triggers: ["sdd init", "start spec", "new spec", "open spec", "intake"]
context_cost: 280
---

# SDD Init — Phase 1: Intake

## Purpose
Bootstrap a new SDD change. Create the `specs/<change-id>/` directory, write `01-intake.md`, and register the change so it can be tracked through all 9 phases.

## Use when
- Starting non-trivial work (feature, refactor, migration, security change, or deploy workflow).
- The work requires more than a single commit or touches more than one concern.

## Do not use when
- The change is trivial (single-line fix, typo, dependency bump with no side effects).
- A spec for this change already exists — use the appropriate phase skill instead.

## Output: 01-intake.md

```markdown
# Intake — <Change Title>

**ID:** <change-id>   (e.g. feat-user-auth, refactor-payment-service)
**Date:** YYYY-MM-DD
**Type:** feature | refactor | bugfix | migration | security | deploy
**Author:** <agent or developer>

## Problem Statement
One paragraph: what is broken, missing, or needs to change? Why now?

## Success Criteria
- [ ] Criterion 1 (verifiable, specific)
- [ ] Criterion 2
- [ ] Criterion 3

## Out of Scope
- Explicitly list what this change does NOT include.

## Risk Flags
- Any known unknowns, dependencies on external systems, or rollback complexity.

## Next Phase
→ `sdd-explore` — technical deep-dive before proposing a solution.
```

## Rules
- **ID format:** `<type>-<short-slug>` — e.g. `feat-dashboard-export`, `fix-auth-token-expiry`.
- **Success criteria must be verifiable** — "works correctly" is not a criterion; "returns 200 for valid JWT" is.
- **Out of scope is mandatory** — prevents scope creep at later phases.
- Non-trivial work does not skip intake. If the change is already in progress without a spec, create the intake retroactively and proceed from the current phase.

## Checklist Before Exiting Phase 1
- [ ] `specs/<change-id>/01-intake.md` created
- [ ] Problem Statement is 1 paragraph (not a novel)
- [ ] At least 2 verifiable success criteria
- [ ] Out of scope section is explicit
- [ ] Developer has approved the intake before moving to Explore
