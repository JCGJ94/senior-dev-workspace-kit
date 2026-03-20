---
id: "001"
title: "Skill Identity = Content, Not Name"
date: "2026-03-20"
status: "active"
promoted_from: "specs/repair-skills-semantics"
---
# Pattern: Skill Identity = Content, Not Name

## Problem
A skill's name does not guarantee its SKILL.md content is semantically correct.
During provisioning of V3, `code-review-pro` was discovered to contain commit-formatting
logic rather than quality auditing logic — despite the name implying a review capability.
Trigger overlap between `code-review-pro` and `commit-sentinel` caused ambiguous activation.

## Pattern
Before activating or promoting a skill, validate semantic alignment between:
1. **Name** — what the skill claims to be
2. **Purpose field** in SKILL.md — what it declares it does
3. **Triggers** — what signals activate it
4. **Content** — what instructions it actually executes

If name ≠ content, the skill has an **identity defect** and must be corrected before use.
Two skills must never share overlapping triggers.

## Applicability
- Provisioning new skills from external sources
- Auditing existing skills after bulk installs or migrations
- Reviewing the skill registry after any source/runtime sync
- Any time a skill behaves unexpectedly despite being "installed"

## Limitations
- Requires human or LLM judgment to assess semantic intent (cannot be fully automated)
- Does not catch defects introduced after initial validation

## Evidence
- `specs/repair-skills-semantics/09-archive.md` — explicitly lists this as a promotion candidate
- `specs/repair-skills-semantics/07-implementation-log.md` — documents the `code-review-pro` content repair
- `docs/engram/decisions/002-skill-runtime-alignment.md` — context for the broader registry/runtime alignment

## Retrieval Tags
#skill #identity #validation #provisioning #semantic-integrity #triggers #overlap
