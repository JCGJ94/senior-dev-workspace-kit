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

## Status as of 2026-03-21

### ✅ Completed (adapted to V3) — ALL 32 skills

**Priority 1:**
- `writing-plans` — frontmatter + registry ✓
- `verification-before-completion` — frontmatter + registry ✓
- `context-optimization` — frontmatter + registry ✓
- `context-distiller` — frontmatter + registry ✓
- `dispatching-parallel-agents` — frontmatter + registry ✓
- `ai-agent` — frontmatter + registry ✓

**Priority 2:**
- `systematic-debugging` — frontmatter + registry ✓ (fixed 2026-03-21)
- `using-git-worktrees` — frontmatter + registry ✓
- `finishing-a-development-branch` — frontmatter + registry ✓
- `skill-manager` — frontmatter + registry ✓
- `skill-creator` — frontmatter + registry ✓

**Priority 3:**
- `code-review-pro` — frontmatter + registry ✓
- `frontend` — frontmatter + registry ✓
- `backend` — frontmatter + registry ✓
- `fullstack` — frontmatter + registry ✓
- `python-ecosystem` — frontmatter + registry ✓
- `typescript-ecosystem` — frontmatter + registry ✓
- `docs-pro` — frontmatter + registry ✓
- `humanized-communication` — frontmatter + registry ✓
- `mcp-builder` — frontmatter + registry ✓

**V3 Core Layer (always complete):**
- `architect-orchestrator-v3`
- `engram-manager`
- `sdd-manager`
- `skill-governor`
- `security-reviewer`
- `test-verifier`
- `deploy-orchestrator`
- `context-keeper`
- `test-driven-development`
- `debugging`
- `commit-sentinel`
- `context-distiller`

### ⏳ Pending

None. All 32 registered skills are V3-adapted.

## Current Milestone

**V3 Fully Operational — 2026-03-21**

All registered skills have:
- Normalized YAML frontmatter (name, description, tier, triggers, context_cost)
- Registry alignment (source manifest = runtime skills.json = installed .agent/skills/)
- V3 orchestration compatibility

## Next milestone

Maintain alignment as new skills are added. Run `python scripts/validate-skills.py` to detect frontmatter drift.
