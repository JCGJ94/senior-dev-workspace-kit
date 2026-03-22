# Tasks

## Ordered Tasks
1. Rewrite `feature_workflow.md`: 5 stages, removing `current_spec.md`, applying `verification-before-completion` and `commit-sentinel`.
2. Rewrite `bugfix_workflow.md`: Match structural template from step 1. Use correct bug-oriented verbs.
3. Rewrite `refactor_workflow.md`: Match structural template. Add `code-review-pro` to Stage 2 (Prepare) to audit technical debt before refactoring.
4. Rewrite `release_workflow.md`: Match structural template. Ensure correct versioning verbs.
5. Rewrite `deploy_workflow.md`: Remove `<!-- step -->` format. Match structural template. 
6. Draft and save Engram Decision 003: `003-unified-stage-vocabulary.md`.

## Verification Points
- Post Task 5: Use `grep "## Stage "` across `.agent/workflows/*` to ensure exact match of the 5 headings.
- Post Task 5: Use `grep current_spec` to verify 0 hits.
- Post Task 6: Verify decision is linked.
