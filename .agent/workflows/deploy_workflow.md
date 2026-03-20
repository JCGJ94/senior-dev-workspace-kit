# Deploy Workflow (V3)

## Purpose
Execute deploy work with explicit domain detection, preflight validation, smoke testing, and rollback readiness.

---

## Phase 1: Identify the Deploy Domain
1. Detect or confirm the target platform.
2. Load `registry/deploy_domains.json`.
3. Execute skill: `deploy-orchestrator`.

---

## Phase 2: Preflight
1. Confirm build, environment, artifact, and rollout assumptions.
2. Confirm rollback plan exists.
3. Execute skill: `security-reviewer` when infra, secrets, or public runtime behavior are affected.

---

## Phase 3: Readiness Validation
1. Run `[OP_INSTALL]` if needed.
2. Run `[OP_TYPECHECK]`, `[OP_LINT]`, and `[OP_TEST]` when relevant.
3. Execute any required build or domain-specific validation.
4. Record results in the active verification artifact.

---

## Phase 4: Deploy and Smoke
1. Execute the approved deploy action.
2. Run smoke checks immediately after release.
3. Stop and rollback if critical validation fails.

---

## Phase 5: Archive and Handover
1. Update the active spec archive with deploy evidence and follow-up work.
2. Promote reusable release lessons to Engram when relevant.
3. Present deploy status, smoke evidence, and rollback posture.
