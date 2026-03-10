# Architecture Overview

The workspace kit is structured with strict modularity and separation of concerns to maximize AI context optimization. It prevents the agent from loading unnecessary rules, keeping token consumption extremely low.

## Core Modules

- **`ai_rules/`**: Base behavioral rules for the AI agents (e.g., how to code, write context, and enforce architecture). These are always active.
- **`skills/`**: Specialized skills organized in folders. Each folder contains a `SKILL.md` file with atomic instructions for specific domains (e.g., `frontend`, `systematic-debugging`).
- **`skills_registry/`**: The orchestration layer. It defines *when* and *how* skills are used, determining active tiers and indexing valid skills via the manifest.
- **`workflows/`**: Standard Operating Procedures (SOPs) for repeatable procedural tasks like deployments, releases, or bug fixes.
- **`templates/`**: Boilerplate blueprints for new skills (`_blueprint/`) and architectural archetypes (e.g., `saas`, `portfolio`).
- **`config/`**: Configuration files like `developer_preferences.md` specifying agent authority, developer preferences, and proactivity.
- **`scripts/`**: Automation tools and executable scripts to manage the lifecycle of the workspace.
