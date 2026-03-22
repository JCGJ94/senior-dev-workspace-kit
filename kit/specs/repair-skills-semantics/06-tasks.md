# Tasks

## Ordered Tasks

1. **Rewrite `skills/code-review-pro/SKILL.md`** — new quality audit content. Zero overlap with commit-sentinel.
2. **Reinforce `skills/commit-sentinel/SKILL.md`** — add YAML frontmatter, Rules, Context Efficiency, Validation, Output sections. Preserve 4-step protocol.
3. **Update `registry/skill_manifest.json`** — `code-review-pro` description aligned with new content.
4. **Update `.agent/registry/skills.json`** — `code-review-pro` description and triggers corrected.
5. **Sync runtime** — copy source skills to `.agent/skills/`, confirm exact diff match.

## Verification Points

- Post Step 2: grep confirms `code-review-pro` doesn't contain "commit"/"staged"/"git add" and `commit-sentinel` doesn't contain "architectural"
- Post Step 4: descriptions in registries are correct
- Post Step 5: `diff skills/ .agent/skills/` = exact match
