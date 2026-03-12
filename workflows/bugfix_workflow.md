# 🐞 Bugfix Workflow (Agnostic Runtime)

## Purpose
Resolve software defects using reproducible tests and minimal fixes.

---

## 🟢 Phase 1: Triage (Reproduction)
1. **Define the Failure**: Identify expected vs. actual behavior.
2. **Reproduction Test**: Create a failing unit or integration test (Red phase). **Mandatory** before touching logic.
3. **Trace Analysis**: Consult logs or error traces to identify the source.

---

## 🟡 Phase 2: Diagnosis (Discovery)
1. **Stack Analysis**: Consult `.agent/state/env_state.json` to rule out environment or configuration issues.
2. **Root Cause**: Identify why the reproduction test fails. Do not apply patches to symptoms.
3. **Plan Fix (SDD Pinning)**: Execute `writing-plans` for a surgical patch.
   - **MANDATORY**: Create or update `.agent/state/current_spec.md`. The agent MUST read this file at the start of every iteration to prevent context decay.

---

## 🔵 Phase 3: Repair (Fix)
1. **Atomic Patch**: Apply the minimum change necessary to resolve the bug.
2. Execute skill: `commit-sentinel`.

---

## 🔴 Phase 4: Validation (Regression)
0. **Context Purge**: Clear non-essential files from the context window and load strictly the files needed for testing.
1. **Green Phase**: Execute `[OP_TEST]` on the reproduction test.
2. **Regression**: Execute `[OP_TEST]` on the entire affected suite to ensure no collateral damage.
3. **Type Integrity**: Execute `[OP_TYPECHECK]` to validate that the fix is type-safe.

---

## 🏁 Phase 5: Closing (Post-Mortem)
1. **Review**: Audit the change with `code-review-pro` looking for side effects.
2. **Evidence**: Present the previously failing test now passing to the user.
3. **Knowledge Update**: If the bug was complex, document the solution as a "lesson learned".

---

## ⚙️ Operational Resolution
*Consult `env_state.json` to translate these tokens:*
- `[OP_TEST]`: `npm test`, `pytest`, `bun test`, etc.
- `[OP_TYPECHECK]`: `tsc --noEmit`, `mypy .`, etc.
