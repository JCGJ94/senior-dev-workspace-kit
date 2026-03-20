---
id: "001"
title: "Registry Drift Causes Silent Capability Failures"
date: "2026-03-20"
status: "active"
promoted_from: "specs/repair-skills-semantics + specs/runtime-env-refresh"
---
# Lesson: Registry Drift Causes Silent Capability Failures

## Lesson
When a skill registry announces capabilities that do not exist in the runtime,
the agent does not fail loudly — it silently skips or misroutes the task.
This creates a gap between "declared capabilities" and "actual capabilities"
that is invisible during normal operation and only surfaces when a specific skill is needed.

In V3, `registry/skill_manifest.json` declared 31 skills while `.agent/registry/skills.json`
only had 23, and `.agent/skills/` only had 23 directories. The 8 missing skills
were never triggered but would have caused silent failures on relevant tasks.

## Prevention Rule
Before announcing or relying on a capability:
1. Verify the skill exists in `.agent/skills/<name>/SKILL.md`
2. Verify the registry entry exists in `.agent/registry/skills.json`
3. Verify source and runtime counts match: `ls skills/ | wc -l` vs `ls .agent/skills/ | wc -l`

**A skill declared but not installed is a liability, not a feature.**

## Source
- `specs/repair-skills-semantics/` — semantic repair revealed the drift pattern
- `specs/runtime-env-refresh/` — runtime refresh directly addressed the count mismatch

## Evidence
- `docs/engram/decisions/002-skill-runtime-alignment.md` — ADR documenting the detection of 8 missing skills and the fix
- `specs/runtime-env-refresh/08-verification.md` — verification confirming source/runtime alignment post-fix

## Retrieval Tags
#registry #drift #runtime #silent-failure #skills #sync #capability-gap #v3
