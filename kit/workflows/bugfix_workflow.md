# 🐞 Bugfix Workflow (Agnostic Runtime)

## Purpose
Resolve software defects using reproducible tests and minimal fixes.

---

## 🟢 Phase 1: Plan (Triage)
1. **Define the Failure**: Identify expected vs. actual behavior.
2. **Reproduction Test**: Create a failing unit or integration test (Red phase). **Mandatory** before touching logic.
3. **Trace Analysis**: Consult logs or error traces to identify the source.
4. **Stack Analysis**: Consult `.agent/state/env_state.json` to rule out environment or configuration issues.
5. **Plan Fix**: Execute skill: `writing-plans` for a surgical patch.
   - For non-trivial fixes, route into the SDD lifecycle via `sdd-manager`. The active artifact space is `specs/<change-id>/`.

---

## 🟡 Phase 2: Prepare (Diagnosis)
1. **Root Cause**: Identify why the reproduction test fails. Do not apply patches to symptoms.
2. **Baseline**: Confirm the failing test is the only new failure — existing tests must still pass.

---

## 🔵 Phase 3: Execute (Fix)
1. **Atomic Patch**: Apply the minimum change necessary to resolve the bug.
2. Execute skill: `commit-sentinel`.

---

## 🔴 Phase 4: Verify (Regression)
0. **Context Purge**: Clear non-essential files from the context window and load strictly the files needed for testing.
1. **Green Phase**: Execute `[OP_TEST]` on the reproduction test.
2. **Regression**: Execute `[OP_TEST]` on the entire affected suite to ensure no collateral damage.
3. **Type Integrity**: Execute `[OP_TYPECHECK]` to validate that the fix is type-safe.
4. Execute skill: `verification-before-completion`.

---

## 🏁 Phase 5: Close (Post-Mortem)
1. **Evidence**: Present the previously failing test now passing to the user.
2. **Knowledge Update**: If the bug was complex, document the solution as a lesson learned via `engram-manager`.

---

## ⚙️ Operational Resolution
*Consult `.agent/state/allowed_ops.json` to resolve these tokens:*
- `[OP_TEST]` · `[OP_TYPECHECK]`
