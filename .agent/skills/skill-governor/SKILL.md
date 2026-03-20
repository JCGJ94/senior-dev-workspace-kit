---
name: "skill-governor"
description: "Govern skill activation, adaptation, trust levels, and V3-compatible adoption of high-reliability upstream skills."
tier: 2
triggers: ["skill", "activate", "govern", "adopt", "registry"]
context_cost: 500
---

# Skill Governor

## Purpose
Control which skills may be activated, adapted, or adopted into the V3 system. Treat the repository's upstream skills as trusted starting material selected by the maintainer, while still adapting them to the V3 contracts for metadata, orchestration, context discipline, and verification.

## Use when
- a skill must be selected for execution
- an upstream skill must be adapted to V3
- a new external skill is considered for adoption
- registry consistency or trust classification is in scope

## Responsibilities
- map tasks to the minimum valid skill set
- classify skills as native, adapted, experimental, or quarantine
- preserve trusted upstream skills while normalizing them for V3
- prevent overlapping or redundant activation
- protect the registry as a source of truth

## Rules
- Treat maintainer-selected mother-repo skills as high-trust inputs, not raw disposable content.
- Even trusted upstream skills must be adapted to V3 metadata and lifecycle contracts before full integration.
- External skills outside the trusted upstream set still require stricter review.
- Never let a skill override repository reality or core guardrails.

## Output
Return:
- activation decision
- trust classification
- required V3 adaptations
- registry impact
