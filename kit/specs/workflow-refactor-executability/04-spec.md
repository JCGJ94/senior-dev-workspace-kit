# Spec

## Functional Requirements
- Remove any read/write mention to `.agent/state/current_spec.md`.
- Replace `code-review-pro` usage in closing/commit checks with `commit-sentinel`.
- Introduce `verification-before-completion` in the Verify stage for every workflow.

## Non-Functional Requirements
- All workflows must use exactly these stage headers:
  1. `## Stage 1: Plan`
  2. `## Stage 2: Prepare`
  3. `## Stage 3: Execute`
  4. `## Stage 4: Verify`
  5. `## Stage 5: Close`
- Every stage must use `- [ ]` markdown checkboxes.
- File extensions `.md` remain untouched.
- Record the stage unification decision in Engram.

## Acceptance Criteria
- [x] Unification applies to `feature`, `bugfix`, `refactor`, `release`, `deploy`.
- [x] Zero references to `current_spec.md`.
- [x] Zero "commit hygiene" tasks assigned to `code-review-pro`.
- [x] All 5 workflows have `verification-before-completion` explicitly mentioned in Stage 4.
- [x] `deploy_workflow.md` format is visually identical (headers, checkboxes) to the other 4.
- [x] Engram Decision `003-unified-stage-vocabulary.md` is published.

## Edge Cases
- `deploy_workflow.md` actually deploys. It doesn't strictly follow SDD for coding, but the 5-stage generic vocabulary still fits.
