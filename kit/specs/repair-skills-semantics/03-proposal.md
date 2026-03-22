# Proposal

## Recommended Approach
Completely rewrite `code-review-pro` with code quality audit content (patterns, smells, tech debt, risk). Reinforce `commit-sentinel` with frontmatter and missing sections. Update registries. Sync runtime.

## Alternatives Considered
- **Rename the skills**: discarded because workflows already reference them by name and the rename would propagate to too many files
- **Only fix descriptions in registry**: discarded because the SKILL.md content would still be incorrect — the core issue is content, not metadata

## Tradeoffs
- Complete rewrite of `code-review-pro` means losing the history of the previous content, but that content was incorrect since creation
- Minimal fix in `commit-sentinel` (only adding structure) preserves the original 4-step protocol which actually worked
