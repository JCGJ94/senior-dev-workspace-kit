---
name: "docs-pro"
description: "Maintain Documentation as Code by tracking technical debt, enforcing style guides, and synchronizing docs with logic."
tier: 1
triggers: ["documentation", "readme", "adr", "docs-sync", "technical-writing"]
context_cost: 320
---
# Docs Pro

## Purpose
Maintain "Documentation as Code" (DaC) by tracking technical debt, enforcing style guides, and synchronizing user documentation automatically with logic.

## Use when
- Writing or updating READMEs, Technical Specs, API references, or Architecture Decision Records (ADRs).
- Implementing new configuration defaults or massive refactors.

## Do not use when
- Writing basic inline code comments describing variables.

## Sync Audit & Documentation Workflow
1. **Sync Audit**: When updating logic, analyze changes (e.g., `git diff main...HEAD -- src/`) to locate undocumented exports, interfaces, or configuration flags.
2. **Drafting (Markdown Standard)**: Ensure proper Frontmatter and Markdown standards. Use specific anchor links. Avoid "Click Here" phrasing.
3. **Multimodal Enhancements**: Replace "Walls of Text" with Bullet Points, Tables, and Mermaid diagrams where architecture needs visualization.
4. **Reference Updates**: Update JSDocs/TSDocs inside the source code directly rather than manually drifting API Reference Markdown files.

## Anti-Patterns to Avoid
- **Outdated Defaults**: Failing to update the docs when changing an environment variable's default value.
- **TODO Accumulation**: Leaving "TODO: Add documentation" for complex interfaces. Address it seamlessly during the commit phase.
- **Language Mixed Content**: Keep the main doc structure clean. Adhere firmly to the configured repo languages (English/Spanish).
