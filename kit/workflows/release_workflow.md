# 🚀 Release Workflow (Agnostic Runtime)

## Purpose
Standard operational procedure for preparing, validating, and tagging a new software release.

---

## 🟢 Phase 1: Plan (Pre-flight)
1. **Changelog Review**: Analyze conventional commits to preview the release impact.
2. **State Check**: Consult `.agent/state/env_state.json` to ensure the environment is stable (no pending tasks).
3. Execute skill: `writing-plans`.

---

## 🟡 Phase 2: Prepare (Staging)
1. Ensure working tree is clean.
2. **Fresh Deps**: Execute `[OP_INSTALL]` to guarantee dependencies are synchronized.

---

## 🔵 Phase 3: Execute (Versioning)
1. Update project version metadata according to semantic versioning.
2. **Docs Sync**: Generate or update the `CHANGELOG.md` file.

---

## 🔴 Phase 4: Verify (Hardening)
1. **Full Test Suite**: Execute `[OP_TEST]`. Must have 100% success rate.
2. **Static Analysis**: Execute `[OP_TYPECHECK]` and `[OP_LINT]`. No warnings allowed.
3. Execute `[OP_BUILD]` if the project defines a build step.
4. Execute skill: `verification-before-completion`.

---

## 🏁 Phase 5: Close (Ship)
1. **Artifact Tagging**: Create release commit and version tag (e.g., `v1.2.3`).
2. **Release Notes**: Produce final release notes with evidence of successful tests.
3. **Final Handover**: Notify the user of complete readiness for deployment.

---

## ⚙️ Operational Resolution
*Consult `.agent/state/allowed_ops.json` to resolve these tokens:*
- `[OP_INSTALL]` · `[OP_TEST]` · `[OP_TYPECHECK]` · `[OP_LINT]` · `[OP_BUILD]`
