# Skill Profiles Guide

## Purpose
Define the developer intent and map it to technical capability tiers. "Tiers measure capability. Profiles measure intent."

## The Baseline Rule
**Tier 1 is immutable.** It will be loaded regardless of the chosen profile. This guarantees a safe, professional execution baseline for all engineering tasks.

## Profiles

### 1. `default`
- **Purpose**: Quick tasks, isolated scripts, basic exploration.
- **Active Tiers**: Tier 1
- **Relationship**: The foundation. Safe, token-efficient, and fast.

### 2. `quality`
- **Purpose**: Feature development demanding structural reliability.
- **Active Tiers**: Tier 1 + Tier 2
- **Relationship**: Adds TDD and code review loops. Recommended for 80% of daily coding work.

### 3. `multi-agent`
- **Purpose**: Massive refactors, system architecture, parallelizable heavy tasks.
- **Active Tiers**: Tier 1 + Tier 2 + Tier 3
- **Relationship**: Assumes high complexity work requires maximum quality (Tier 2) and subagent delegation (Tier 3).

### 4. `release`
- **Purpose**: Closing branches, integration, merge conflicts, final testing.
- **Active Tiers**: Tier 1 + Tier 2 + Tier 4
- **Relationship**: Prioritizes quality and Git hygiene. Omits Tier 3 because branch integration is highly sequential and precision-oriented.
### 5. `architect`
- **Purpose**: Workspace evolution, skill creation, rule auditing, and technical context design.
- **Active Tiers**: Tier 1 + Tier 2 + Tier Meta
- **Meta Skills**: `skill-creator`
- **Relationship**: Focuses on the "Meta" layer of the repo. Use this when you need to expand the AI's capabilities or refine the system rules.

### 6. `mcp-integration`
- **Purpose**: Construir, extender, o evaluar servidores MCP (Model Context Protocol).
- **Active Tiers**: Tier 1 + Tier 2
- **Extra Skill**: `mcp-builder`
- **Relationship**: Combina la base segura (Tier 1), disciplina de calidad (Tier 2), y la capability específica de MCP. Usar cuando el objetivo principal es un servidor MCP real, no solo consumir tools MCP como cliente.
- **Alias**: `mcp`

## Activation Strategy
Developers can activate a context using either the profile name or the semantic tier level. Both resolve to the same underlying context to avoid ambiguity.

**Decision Matrix Example:**
- *Are you writing isolated utility functions?* → Use `default`
- *Are you building a core feature?* → Use `quality`
- *Are you refactoring 50 files across the repo?* → Use `multi-agent`
- *Are you closing a branch to merge into main?* → Use `release`
- *Are you building or extending an MCP server?* → Use `mcp-integration` (alias: `mcp`)

## Usage (CLI)
You can set a profile using the explicit script:
```bash
# Sets safe baseline
./scripts/set-skill-profile.sh

# Sets quality profile
./scripts/set-skill-profile.sh quality

# Sets MCP integration profile (two equivalent forms)
./scripts/set-skill-profile.sh mcp-integration
./scripts/set-skill-profile.sh mcp

# Uses syntactic alias
./scripts/set-skill-profile.sh tier2
```
