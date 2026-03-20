# Explore

## Current State
- `skills/code-review-pro/SKILL.md` had title "Commit Sentinel" and commit hygiene content
- `.agent/skills/code-review-pro/SKILL.md` was an exact copy of the source (i.e. also wrong)
- `skills/commit-sentinel/SKILL.md` worked but without YAML frontmatter or Output/Validation sections
- `.agent/registry/skills.json` described `code-review-pro` as "Guard repository integrity by ensuring commits..." (incorrect)

## Relevant Files
- `skills/code-review-pro/SKILL.md`
- `skills/commit-sentinel/SKILL.md`
- `.agent/skills/code-review-pro/SKILL.md`
- `.agent/skills/commit-sentinel/SKILL.md`
- `registry/skill_manifest.json`
- `.agent/registry/skills.json`

## Architecture Notes
- The model is: `skills/` (source) provisions to `.agent/skills/` (runtime)
- `registry/skill_manifest.json` is the source of truth for skill metadata
- `.agent/registry/skills.json` is the runtime equivalent
- Workflows reference skills by name — the name does not change, but the content must match

## Unknowns
- Were there other similar clones in other skills? (identified as a follow-up)
- Do workflows that use `code-review-pro` as a closing gate need adjustment? (yes — resolved in separate spec)
