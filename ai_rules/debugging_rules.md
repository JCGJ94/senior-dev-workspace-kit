# Debugging Rules
## Purpose
Systematize error isolation and resolution.

## Scope
Runtime errors, logical bugs, visual glitches.

## Priority
High

## Rules
- Check type errors (`tsc --noEmit`) first.
- Recreate the bug locally before attempting fixes.
- Identify the root cause rather than patching the symptom.
- Use explicit console/logging to isolate logic flows.
