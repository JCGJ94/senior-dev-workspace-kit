# Design

## Components
- `.agent/workflows/feature_workflow.md`
- `.agent/workflows/bugfix_workflow.md`
- `.agent/workflows/refactor_workflow.md`
- `.agent/workflows/release_workflow.md`
- `.agent/workflows/deploy_workflow.md`
- `docs/engram/decisions/003-unified-stage-vocabulary.md`

## Boundaries
- Does not modify custom script workflows, only the 5 core software lifecycle workflows.
- Does not implement new skills, merely calls the newly repaired skills correctly.

## Data Flow
```
Developer invokes workflow -> Workflow dictates 5 Stages
  -> Stage 1 (Plan) -> uses SDD Manager (specs/<change-id>)
  -> Stage 2 (Prepare) -> uses Worktrees / Env
  -> Stage 3 (Execute) -> uses TDD / Context Distiller
  -> Stage 4 (Verify) -> uses test-verifier + verification-before-completion
  -> Stage 5 (Close) -> uses finishing-a-development-branch + commit-sentinel
```

## Key Decisions
1. **5-Stage Vocabulary**: Plan, Prepare, Execute, Verify, Close. This fits everything from a minor bugfix to a full release.
2. **Universal Verification**: Regardless of workflow, Stage 4 ALWAYS employs `verification-before-completion` to guarantee evidence.
3. **Engram Logging**: Making a structural change universally across 5 files requires a permanent architectural decision log.
