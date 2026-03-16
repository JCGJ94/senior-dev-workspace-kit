# Deploy Rules

## Purpose
Define the V3 release and deploy contract so delivery work is explicit, repeatable, and reversible.

## Scope
Build, release, environment validation, smoke checks, rollback, and observability. (Tier 2 Priority).

## Preflight Contract
- Detect the deploy domain before execution.
- Confirm build command, artifact expectations, environment variables, and release target.
- Verify rollback steps exist before any deployment claim.

## Validation Contract
- Run structural quality gates before deploy.
- Run domain-appropriate build and smoke checks.
- Record deploy evidence in the active verification artifact for non-trivial work.

## Safety Contract
- No deploy readiness claim without rollback.
- No deploy readiness claim without smoke validation.
- No deploy workflow bypasses security review when the change affects infrastructure, secrets, auth, or public runtime behavior.
