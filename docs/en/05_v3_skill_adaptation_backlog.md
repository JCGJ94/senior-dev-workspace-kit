# V3 Skill Adaptation Backlog

## Purpose
Track which trusted mother-repo skills still need V3 adaptation so they can participate fully in the master-orchestrator model.

## Policy
These skills are treated as trusted because they were deliberately selected by the maintainer for quality and reliability. The task is not to replace them, but to adapt them to V3.

V3 adaptation means:
- add normalized metadata frontmatter
- align activation rules with V3 orchestration
- align context discipline with `context-keeper`
- align memory promotion with `engram-manager`
- align completion criteria with `test-verifier` and `security-reviewer` when relevant

## Priority 1
- `ai-agent`
- `writing-plans`
- `verification-before-completion`
- `context-optimization`
- `context-distiller`
- `dispatching-parallel-agents`

## Priority 2
- `test-driven-development`
- `systematic-debugging`
- `using-git-worktrees`
- `finishing-a-development-branch`
- `skill-manager`
- `skill-creator`

## Priority 3
- domain skills such as `frontend`, `backend`, `fullstack`, `python-ecosystem`, and `typescript-ecosystem`
- review and documentation skills such as `code-review-pro` and `docs-pro`
- deploy and infrastructure skills added later under the V3 deploy domain

## Current Milestone
This repository now contains the first V3 orchestration layer:
- `architect-orchestrator-v3`
- `engram-manager`
- `sdd-manager`
- `skill-governor`
- `security-reviewer`
- `test-verifier`
- `deploy-orchestrator`
- `context-keeper`

The next milestone is to normalize the trusted upstream skills listed above so the generated registry can represent the real capability surface of the system.
