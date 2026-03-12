# Memory Rules

## Purpose
Maintain long-term architectural continuity across distinct sessions without confusing global prompt directives with local technical decisions.

## Scope
Historical context retrieval, documentation persistence. (Tier 3 Priority).

## Separation of Memory
1. **Global Prompt Memory:** Instructions on how the agent behaves (Language, habits) live in the system `.cursorrules` or platform-level `user_global` instructions. These are read-only.
2. **Local Repository Memory:** Architectural knowledge of the *project* lives directly inside the project tree, typically in `docs/architecture/` or `docs/decisions/` (ADRs - Architecture Decision Records).

## Updating Local Memory (Local Engram Pattern)
- When a complex bug is resolved, a new pattern is introduced, or a major architecture decision is made, the agent should update or create an ADR in `docs/decisions/`.
- This ensures that future sessions do not lose the "Why" behind the "How" (supporting Chesterton’s Fence).

## Bootstrapping 
- The agent should scan `docs/decisions/` or the project `README.md` to understand the domain before making deep infrastructural changes, relying on these persisted text artifacts instead of expecting an active persistent state daemon.
