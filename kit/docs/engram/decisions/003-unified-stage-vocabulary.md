---
title: "003: Unified Stage Vocabulary for Workflows"
date: "2026-03-20"
status: "accepted"
---
# Decision: Unified Stage Vocabulary for Workflows

## Context
The V3 workspace kit defines 5 workflows (feature, bugfix, refactor, release, deploy). Each workflow had independently named phases with inconsistent terminology:

- Feature: Discovery → Setup → Build → Check → Ship
- Bugfix: Reproduction → Diagnosis → Fix → Regression → Post-Mortem
- Refactor: Detection → Baseline → Clean Coding → Verification → Review
- Release: Pre-flight → Staging → Versioning → Hardening → Ship
- Deploy: (no subtitles)

This made it harder to navigate between workflows, build muscle memory, and reason about which phase the agent was operating in.

Additionally, all development workflows referenced a phantom file `.agent/state/current_spec.md` that never existed. The canonical SDD artifact space is `specs/<change-id>/` as defined by `03_development_super_rule.md` and `sdd-manager`.

## Decision
All workflows now share a **unified 5-phase vocabulary**:

| Phase | Name | Purpose |
|-------|------|---------|
| 🟢 Phase 1 | **Plan** | Intake, discovery, triage |
| 🟡 Phase 2 | **Prepare** | Setup, baseline, staging |
| 🔵 Phase 3 | **Execute** | Build, fix, refactor, version |
| 🔴 Phase 4 | **Verify** | Test, regression, hardening |
| 🏁 Phase 5 | **Close** | Review, handover, archive |

Each phase retains a parenthetical subtitle specific to the workflow context (e.g., "Plan (Triage)" for bugfix, "Close (Quality Audit)" for refactor).

The phantom `current_spec.md` reference was replaced with the canonical `specs/<change-id>/` path, routed through `sdd-manager` for non-trivial work.

## Consequences
- Developers and the agent can reason about workflow phases using a single vocabulary.
- Switching between workflows is faster — the mental model is the same.
- The parenthetical subtitle preserves domain-specific intent without breaking consistency.
- `verification-before-completion` is now the universal gate in Phase 4 across all 5 workflows.
- `code-review-pro` is only invoked where it has legitimate semantic value (refactor workflow — quality audit), not as a generic closing gate.
- Zero phantom file references remain.

## Evidence
- `specs/workflow-refactor-executability/09-archive.md` — confirms outcome and lists this decision as promotion candidate
- `.agent/workflows/` — 5 workflow files updated with unified 5-phase vocabulary

## Retrieval Tags
#workflow #phases #vocabulary #unified #stage #executability #v3
