---
name: "finishing-a-development-branch"
description: "Execute a clean branch-closing protocol with verification evidence, documentation sync, and merge or release readiness."
tier: 2
triggers: ["finish-branch", "merge-ready", "release-candidate", "handover"]
context_cost: 400
---

# Finishing a Development Branch

## Purpose
Execute a clean, standardized protocol for closing a development cycle, ensuring code integrity, proper documentation, and a state ready for merging or release.

## Use when
- All tasks in the development branch are verified and completed.
- You are ready to merge into `main`, `develop`, or a parent branch.
- You need to ensure the repository is clean before handing over.
- Creating a final pull request or release candidate.

## Do not use when
- Tasks are still in progress or unverified.
- Verification commands (tests, lint, typecheck) are failing.
- The branch is meant for long-term experimentation without merging.

## Branch Finalization Workflow

1. **Final Global Audit**
   - Run a clean verification: `[OP_INSTALL]`, `[OP_TEST]`, `[OP_TYPECHECK]`, `[OP_LINT]`.
   - Ensure the repository produces no unexpected warnings or artifacts.
   - Review the full diff since the branch started.

2. **Environment Cleanup**
   - Remove temporary files, logs, and debug instrumentation.
   - Delete scratch scripts or experimental files not intended for the repository.
   - Reset any sensitive configuration changes made for local development.

3. **Documentation Sync**
   - Update `CHANGELOG.md` or release notes if required.
   - Ensure all public interfaces and new features are documented in JSDoc, TSDoc, or Markdown files.
   - Verify that READMEs reflect any infrastructure or configuration shifts.

4. **Commit & Tagging**
   - Consolidate commits if part of the repository convention (squashing).
   - Ensure the final commit message follows repository standards (e.g., Conventional Commits).
   - If finishing a release, create the appropriate version tag.

5. **Branch Integration Check**
   - Rebase or merge from the base branch (e.g., `main`) to resolve any drift.
   - Verify that the integrated code still passes all checks.

6. **Handover Presentation**
   - Summarize the work done, changes made, and verification results.
   - List any follow-up tasks or known technical debt introduced.

## Rules
- **No Unstable Code**: Never finalize a branch with failing tests or type errors.
- **Clean Tree**: The working directory must be clean (no untracked junk) before finishing.
- **Document Changes**: Every feature/fix should be reflected in documentation.
- **Match Conventions**: Follow repository-specific merge and commit strategies strictly.
- **Evidence-Backed**: Provide final verification logs as part of the closing report.
- Under V3, branch closure should reference the active SDD archive and verification artifacts before handoff or release.

## Context Efficiency
- Focus on the branch diff and final verification outputs.
- Do not review the entire history of the project, only the current cycle.

## Validation
- Full test suite passed.
- No lint/type errors exist.
- Documentation is up to date.
- Repository is clean of temporary artifacts.

## Output

Return a Finalization Report:

### Branch Summary
Changes implemented and verified.

### Verification Status
Final check results (Tests, Types, Lint).

### Documentation Updates
Files and sections updated.

### Cleanup Actions
Temporary files removed.

### Merge Readiness
Confirmation of rebase/merge with the base branch.
