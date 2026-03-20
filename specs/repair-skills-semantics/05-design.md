# Design

## Components
- `skills/code-review-pro/SKILL.md` — complete rewrite
- `skills/commit-sentinel/SKILL.md` — structural reinforcement
- `registry/skill_manifest.json` — metadata correction
- `.agent/registry/skills.json` — runtime metadata correction
- `.agent/skills/code-review-pro/SKILL.md` — sync from source
- `.agent/skills/commit-sentinel/SKILL.md` — sync from source

## Boundaries
- Only the 2 affected skills and their registries are touched
- Workflows are not modified (this is resolved in a separate spec: `workflow-refactor-executability`)
- Skill names are not changed

## Data Flow
```
skills/ (source) → provision.sh → .agent/skills/ (runtime)
registry/skill_manifest.json (source) → provision.sh → .agent/registry/skills.json (runtime)
```

## Key Decisions
1. **Total rewrite vs patch**: chose total rewrite for `code-review-pro` because the content was entirely wrong — it was not a partial bug
2. **Preserve original protocol of commit-sentinel**: the original 4 steps were correct, only lacking formal structure
3. **Disjoint triggers**: explicit decision that no trigger should appear in both skills
