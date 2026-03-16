# Context Optimization Rules

## Purpose
Minimize token usage, prevent hallucination loops, and speed up AI inference by strictly controlling what enters the context window.

## Scope
File reading, token management, search operations. (Tier 3 Priority).

## Strict Context Hygiene
- **Surgical Reading:** Load ONLY the files critically relevant to the immediate step of the task. Do not load entire directories of code arbitrarily.
- **Context Purge:** When transitioning between distinct phases (e.g., moving from building the Database Schema to building the UI View), explicitly forget/close previous files that are no longer strictly needed. This prevents token bloat.
- **Search Filtering:** ALWAYS aggressively filter out build folders (`.next`, `dist`, `build`), lockfiles, and dependencies (`node_modules`, `site-packages`) when using GREP or file search tools.

## Information Condensation
- If reading large documentation or terminal outputs, summarize the key findings conceptually rather than dumping raw 500-line logs.
- If a file is too large to read entirely, read in chunks or rely on semantic grep searching.
- Reference existing facts from KIs (Knowledge Items), `/core` rules, or `/docs` instead of rewriting them fully in chat prompts.

## V3 Stable Context Policy
- The active context window must remain stable across iterations; growing the knowledge base must not imply loading all accumulated knowledge.
- Prefer `specs/<change-id>/summary.md`, `docs/engram/index.md`, and compact phase artifacts over reloading broad history.
- Use `context-keeper` and `context-distiller` to preserve signal while protecting continuity.
