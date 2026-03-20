# Memory Rules

## Purpose
Maintain long-term architectural continuity across distinct sessions without confusing global prompt directives with local technical decisions.

## Scope
Historical context retrieval, documentation persistence. (Tier 3 Priority).

## Separation of Memory
1. **Global Prompt Memory:** Instructions on how the agent behaves (Language, habits) live in platform-level instructions. These are read-only.
2. **Durable Repository Memory:** Architectural and reusable project knowledge lives in `docs/engram/` and linked architecture docs.
3. **Active Change Memory:** Current work artifacts live in `specs/<change-id>/`.
4. **Ephemeral Runtime Memory:** Session-only runtime summaries may live in `.agent/`, but they are not the durable source of truth.

## Updating Local Memory (Local Engram Pattern)
- When a complex bug is resolved, a reusable pattern is introduced, or a major architecture decision is made, the agent should promote knowledge into `docs/engram/`.
- Decisions may still link to ADR-style documents, but `docs/engram/` is the canonical durable memory index for V3.
- Promotion should be selective, evidence-backed, and retrieval-friendly.

## Bootstrapping 
- The agent should scan `docs/engram/index.md`, relevant Engram entries, active specs, or the project `README.md` before making deep infrastructural changes.
- Do not assume `.agent/` contains the full architectural memory of the project.
