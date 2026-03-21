---
name: "audit-website"
description: "Audit websites for SEO, technical, content, performance and security issues using the squirrelscan CLI."
tier: 3
triggers: ["audit", "website audit", "squirrelscan", "site health", "broken links", "accessibility audit"]
context_cost: 500
---
# Website Audit

## Purpose
Audit websites for SEO, technical, content, performance, and security issues utilizing the `squirrelscan` CLI, and efficiently roll out the discovered fixes.

## Use when
- Evaluating a website's overall technical health against 230+ specific rules.
- Hunting for broken internal/external links or missing accessibility alt-texts across an entire compiled site.
- Comparing health regressions across commits or deployment environments.

## Do not use when
- You lack access to the `squirrel` executable.
- The user is only asking for design aesthetics or code style linting.

## Tool Usage
Run audits through the `squirrel` executable.
1. Run audit: `squirrel audit https://example.com --format llm` (use `-C quick`, `surface`, or `full` for depth).
2. For specific report formats or regressions: `squirrel report <audit-id> --diff <baseline-id> --format llm`.

## Rules
- **Prefer Live Envs**: Recommend auditing live URLs to catch true rendering and infrastructure issues, unless working exclusively on local compilation errors.
- **Subagent Parallelization**: For widespread content fixes (e.g., adding alt text to 30 files), spawn subagents to fix batches concurrently.
- **Target 95+ Score**: Fix errors, re-audit, and repeat until the score goes above 95 (Grade A).
- **Human Review on Destruction**: Always query the user before removing broken links structurally or doing massive refactors based on the scan.

## Context Efficiency
- Rely on the `llm` output format for parsing `squirrelscan` results efficiently without giant console token spillage. Focus only on actionable files.

## Validation
- The `squirrel` CLI health score improves significantly after code fixes are applied.
- All high-severity (errors) and medium-severity (warnings) rule violations are patched or documented as false-positives.

## Output

Return a Remediation Summary:
### Audit Metrics
Score, broken links count, and issues discovered.
### Fix Manifest
List of files altered and the specific `squirrelscan` rule they fixed.
### Post-Audit Result
New health score upon completion.
