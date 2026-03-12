# Memory Rules
## Purpose
Maintain and utilize historical and global context.

## Scope
Context retrieval, cross-session continuity.

## Priority
Medium

## Rules
- Always scan `user_global` memory for preferences.
- **Local Engram Pattern**: Maintain a `.agent/state/global_memory.md` (or `decisions.md`) file. Record all architectural decisions, complex bug resolutions, and system patterns here.
- **Boot Sequence**: The agent MUST implicitly read `global_memory.md` upon initialization/resumption to load the shared project brain.
- Store architectural decisions in documentation or specific artifacts.
- Reload local rules over remote defaults.
- Do not duplicate context excessively; rely on established files.
