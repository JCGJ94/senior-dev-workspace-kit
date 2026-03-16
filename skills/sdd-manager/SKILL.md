---
name: "sdd-manager"
description: "Enforce the full 9-phase Spec-Driven Development lifecycle and keep the active change artifact set complete, ordered, and auditable."
tier: 2
triggers: ["sdd", "spec", "design", "tasks", "workflow"]
context_cost: 650
---

# SDD Manager

## Purpose
Operate the canonical V3 Spec-Driven Development lifecycle. Ensure non-trivial work moves through intake, exploration, proposal, specification, design, tasks, implementation, verification, and archive with explicit artifacts.

## Use when
- A feature, refactor, bugfix, migration, security change, or deploy workflow is non-trivial.
- The repository needs a formal execution artifact set.
- The master orchestrator requires phase control.

## 9 Phases
1. Intake
2. Explore
3. Proposal
4. Spec
5. Design
6. Tasks
7. Apply
8. Verify
9. Archive

## Responsibilities
- create or update the active change directory under `specs/`
- ensure phase order is respected
- block implementation when required earlier artifacts are missing
- keep phase summaries small and actionable
- record deviations from plan and unresolved risks

## Rules
- Non-trivial work does not bypass SDD.
- Each phase must have an explicit deliverable.
- Verification is a phase, not a footnote.
- Archive must capture what is worth reusing.

## Output
Return:
- current phase
- missing artifacts
- next required artifact
- readiness to proceed
