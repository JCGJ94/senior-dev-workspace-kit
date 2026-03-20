# 🚀 Release Workflow (Agnostic Runtime)

## Purpose
Standard operational procedure for preparing, validating, and tagging a new software release.

---

## 🟢 Phase 1: Audit (Pre-flight)
1. **Changelog Review**: Analyze conventional commits to preview the release impact.
2. **State Check**: Consult `.agent/state/env_state.json` to ensure the environment is stable (No pending tasks).
3. Execute skill: `writing-plans`.

---

## 🟡 Phase 2: Freezing (Staging)
1. Ensure working tree is clean.
2. **Fresh Deps**: Execute `[OP_INSTALL]` to guarantee dependencies are synchronized.

---

## 🔵 Phase 3: Preparation (Versioning)
1. Update project version metadata according to semantic versioning.
2. **Docs Sync**: Generate or update the `CHANGELOG.md` file.
3. Execute skill: `code-review-pro`.

---

## 🔴 Phase 4: Total Validation (Hardening)
1. **Full Test Suite**: Execute `[OP_TEST]`. Must have 100% success rate.
2. **Static Analysis**: Execute `[OP_TYPECHECK]` and `[OP_LINT]`. No warnings allowed.
3. Execute `[OP_BUILD]` if the project defines a build step.

---

## 🏁 Phase 5: Closing and Shipping (Ship)
1. **Artifact Tagging**: Create release commit and version tag (e.g., `v1.2.3`).
2. **Release Notes**: Produce final release notes with evidence of successful tests.
3. **Final Handover**: Notify the user of complete readiness for deployment.

---

## ⚙️ Operational Resolution
*Consult `env_state.json` to translate these tokens:*
- `[OP_INSTALL]`: `npm install`, `pip install -r req.txt`, `bun install`, etc.
- `[OP_TEST]`: `npm test`, `pytest`, `bun test`, etc.
- `[OP_TYPECHECK]`: `tsc --noEmit`, `mypy .`, etc.
- `[OP_LINT]`: `eslint`, `ruff`, etc.
- `[OP_BUILD]`: `npm run build`, `bun run build`, etc.

