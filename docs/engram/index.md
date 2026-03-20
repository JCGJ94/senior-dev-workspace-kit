# Engram Index

## Purpose
Act as the durable cross-session memory index for the V3 system.

## Sections
- `decisions/` for architecture and governance decisions
- `patterns/` for reusable implementation and workflow patterns
- `incidents/` for failures, postmortems, and mitigations
- `lessons/` for validated operational learnings
- `domains/` for durable domain knowledge packs

## Retrieval Rules
- Load only the smallest relevant memory slice.
- Prefer summaries and tagged entries over broad scans.
- Durable memory must support future work without inflating the active context window.

## Promotion Rules
- Promote only verified and reusable knowledge.
- Link each memory item back to a spec, workflow, or evidence source.
- Do not store raw session chatter.

## Operational Promotion Rule
Promote to Engram when ALL of the following are true:
1. The knowledge was verified (spec reached Phase 4 or was applied in production)
2. It is reusable (applies to ≥2 future situations)
3. It has evidence (linked to a spec, ADR, or commit)
4. It is not derivable by reading current code alone

Do NOT promote:
- Session-only learnings without evidence
- Decisions reversed in the same sprint
- Raw debugging output or logs

## Active Memory Index

| Type | ID | Title | Tags |
|------|----|-------|------|
| Decision | 001 | [Pedrito Identity](decisions/001-pedrito-identity.md) | #identity #tone #voice #pedrito |
| Decision | 002 | [Skill Runtime Alignment](decisions/002-skill-runtime-alignment.md) | #registry #runtime #drift |
| Decision | 003 | [Unified Stage Vocabulary](decisions/003-unified-stage-vocabulary.md) | #workflow #phases #unified |
| Pattern | 001 | [Skill Identity Validation](patterns/001-skill-identity-validation.md) | #skill #semantic-integrity #provisioning |
| Lesson | 001 | [Registry Drift Silent Failures](lessons/001-registry-drift-silent-failures.md) | #registry #drift #silent-failure |
