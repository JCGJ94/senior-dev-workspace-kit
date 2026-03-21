# 🚢 Deploy Workflow (Agnostic Runtime)

## Purpose
Execute deploy work with explicit domain detection, preflight validation, smoke testing, and rollback readiness.

---

## 🟢 Phase 1: Plan (Domain Detection)
1. Detect or confirm the target platform.
2. Load `registry/deploy_domains.json`.
3. Execute skill: `deploy-orchestrator`.

---

## 🟡 Phase 2: Prepare (Preflight)
1. Confirm build, environment, artifact, and rollout assumptions.
2. Confirm rollback plan exists.
3. Execute skill: `security-reviewer` when infra, secrets, or public runtime behavior are affected.

---

## 🔵 Phase 3: Execute (Readiness)
1. Execute `[OP_INSTALL]` if needed.
2. Execute `[OP_TYPECHECK]`, `[OP_LINT]`, and `[OP_TEST]` when relevant.
3. Execute any required build or domain-specific validation.
4. Record results in the active verification artifact.

---

## 🔴 Phase 4: Verify (Deploy + Smoke)
1. Execute the approved deploy action.
2. Run smoke checks immediately after release.
3. Stop and rollback if critical validation fails.
4. Execute skill: `verification-before-completion`.

---

## 🏁 Phase 5: Close (Archive)
1. Update the active spec archive with deploy evidence and follow-up work.
2. Promote reusable release lessons to Engram via `engram-manager` when relevant.
3. Present deploy status, smoke evidence, and rollback posture.

---

## ⚙️ Operational Resolution
*Consult `.agent/state/allowed_ops.json` to resolve these tokens:*
- `[OP_INSTALL]` · `[OP_TEST]` · `[OP_TYPECHECK]` · `[OP_LINT]` · `[OP_BUILD]` · `[OP_DEPLOY]`
