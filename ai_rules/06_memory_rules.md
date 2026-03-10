# Memory Rules
## Purpose
Maintain and utilize historical and global context.

## Scope
Context retrieval, cross-session continuity.

## Priority
Medium

## Rules
- Always scan `user_global` memory for preferences.
- Store architectural decisions in documentation or specific artifacts.
- Reload local rules over remote defaults.
- Do not duplicate context excessively; rely on established files.
