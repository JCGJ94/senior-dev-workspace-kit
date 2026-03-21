# 🔨 Refactor Workflow (Agnostic Runtime)

## Purpose
Safe and structured procedure for improving code quality without altering external behavior.

---

## 🟢 Phase 1: Plan (Analysis)
1. **Identify Target**: Locate files > 500 lines, duplicated logic, or technical debt.
2. **Impact Assessment**: Determine which dependencies will be affected by the internal change.
3. **Plan Refactor**: Execute skill: `writing-plans`.
   - For non-trivial refactors, route into the SDD lifecycle via `sdd-manager`. The active artifact space is `specs/<change-id>/`.

---

## 🟡 Phase 2: Prepare (Baseline)
1. **Current Status**: Execute `[OP_TEST]` and `[OP_TYPECHECK]` before starting. Do not refactor on broken code.
2. **State Snapshot**: Consult `.agent/state/env_state.json` to confirm the current stack.

---

## 🔵 Phase 3: Execute (Clean Code)
1. **Behavior Preservation**: Apply structural changes. **Forbidden** to add new features during a refactor.
2. **Modularization**: Split large components into smaller, specialized units.
3. Execute skill: `commit-sentinel`.

---

## 🔴 Phase 4: Verify (Parity)
0. **Context Purge**: Clear non-essential files from the context window and load strictly the files needed for testing.
1. **Functional Parity**: Execute `[OP_TEST]`. Tests must pass exactly as they did in Phase 2.
2. **Type Safety**: Execute `[OP_TYPECHECK]`. A Senior refactor must improve type precision.
3. **Linting**: Execute `[OP_LINT]` to ensure style consistency.
4. Execute skill: `verification-before-completion`.

---

## 🏁 Phase 5: Close (Quality Audit)
1. Execute skill: `code-review-pro` to audit the refactored code for architectural smells and remaining debt.
2. **Clean Up**: Remove dead code or obsolete comments resulting from the change.
3. **Evidence**: Show comparative diff and validation results.

---

## ⚙️ Operational Resolution
*Consult `.agent/state/allowed_ops.json` to resolve these tokens:*
- `[OP_TEST]` · `[OP_TYPECHECK]` · `[OP_LINT]`
