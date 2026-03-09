# AI Engineering Workspace Kit

A robust, reusable bootstrap repository designed to initialize new projects with AI engineering rules, preferred skills, necessary workflows, and essential configurations. This setup acts as a Developer Workspace Kit for AI-assisted environments like Antigravity.

## Purpose
The primary goal is to provide a single, consistent starting point for any new project, bridging the gap between typical project files and AI instructions (`ai_rules`, `skills`, `workflows`).

## Initialization
Simply clone this repository and run the bootstrap script within the target project's root folder to get started.

```bash
git clone <repo> ai-engineering-workspace-kit
cd project
bash ../ai-engineering-workspace-kit/scripts/bootstrap-workspace.sh
```

A new `.devkit` folder will be generated containing all the necessary AI configurations and operational rules for the repository.

## Modules

- **ai_rules**: Base rules for the AI agents operating in the workspace.
- **skills**: Specialized contexts and frameworks (e.g. Frontend, Backend, AI Agent).
- **workflows**: Standard operating procedures for completing features, refactoring, fixing bugs, and cutting releases.
- **templates**: Scaffolding for `portfolio`, `saas`, `api`, and `fullstack-app` archetypes.
- **scripts**: Utilities to bootstrap, install individual components, or synchronize existing projects with the base repo.
- **config**: Manifest files governing what rules can be overwritten or excluded across updates.

## Development and Extension
All internal rules are structured in a concise, token-efficient Markdown format and written in **English**. Add new rules or skills using the standard template found across existing `.md` files.

---

> **Note**: This repository is prepared for local development initialization first and is structured with modularity, clear separation of concerns, and minimal redundancy.
