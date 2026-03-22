# Spec

## Functional Requirements
- `code-review-pro` must contain: quality analysis, smell detection, pattern evaluation, tech debt reduction
- `commit-sentinel` must contain: atomicity validation, conventional format, commit type-safety, git history audit
- The triggers of both skills must be completely disjoint

## Non-Functional Requirements
- Each SKILL.md must have valid YAML frontmatter (name, description, tier, triggers, context_cost)
- Each SKILL.md must include sections: Purpose, Use When, Rules, Context Efficiency, Validation, Output

## Acceptance Criteria
- [x] `code-review-pro/SKILL.md` DOES NOT contain the words "commit", "staged", "git add"
- [x] `commit-sentinel/SKILL.md` DOES NOT contain "architectural"
- [x] Triggers are disjoint: CRP = review/audit/quality/refactor/tech-debt, CS = commit/history/atomic/conventional/git-quality
- [x] `registry/skill_manifest.json` descriptions are correct
- [x] `.agent/registry/skills.json` descriptions and triggers are correct
- [x] `.agent/skills/` reflects `skills/` (diff = exact match)

## Edge Cases
- Skills depending on the name `code-review-pro` in workflows must continue working (the name doesn't change)
- Possible confusion if a developer searches for "commit review" and finds `code-review-pro` — mitigated by updated description
