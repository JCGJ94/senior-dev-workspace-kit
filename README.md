# AI Engineering Workspace Kit

🇬🇧 [English](README.md) | 🇪🇸 [Español](README.es.md)

A **reusable development environment kit** designed to standardize projects that use AI-assisted development.

This repository provides an operational layer that defines how the following interact:
- AI agents.
- The developer.
- Project architecture.

The goal is to create a consistent environment for projects using tools like:
- Antigravity
- Windsurf
- Cursor
- Custom multi-agent systems

---

## Why this repository exists

Most repositories define **code structure**, but they do not define **how AI should behave within the project**.

This kit solves that problem by providing:
- Engineering rules for AI.
- Reusable modular skills.
- Standardized workflows.
- Automation scripts.
- Skill architecture validation.
- Documentation optimized for low token consumption.

The result is a **portable AI-assisted development environment** reusable across multiple projects.

---

## System Principles

### 1. Environment Adaptation
The kit **does not impose technologies**.
It must adapt to the real ecosystem of the project.
For example:
- Python projects → Python tools
- Node projects → Node tools
- Hybrid projects → separate toolchains

### 2. Modular Context
Rules are separated into modules to avoid loading unnecessary context:
- `ai_rules/`
- `skills/`
- `skills_registry/`
- `workflows/`
- `templates/`
- `config/`
- `scripts/`

This maintains **minimal token consumption** for the agent.

### 3. Skill-Based Architecture
The system uses **Skills** as reusable knowledge units.
A Skill represents a specific technical capability, for example:
- Systematic debugging
- Frontend architecture
- Testing
- Database migrations

Each Skill contains:
- `SKILL.md`
- `scripts/`
- `resources/`

### 4. Explicit Activation
Writing a skill defines **WHAT it does**.
The registry system defines **WHEN it is used**.
Activation logic is managed in:
- `skills_registry/`

---

## Quick Start

### 1. Clone the repository
```bash
git clone <repo> ai-engineering-workspace-kit
```

### 2. Initialize a project
Inside your project:
```bash
cd my-project
bash ../ai-engineering-workspace-kit/scripts/bootstrap-workspace.sh
```
This will generate a `.devkit/` folder containing the necessary configurations for the AI environment.

### 3. Validate architecture
After modifying skills:
```bash
bash scripts/validate-skills.sh
```
This ensures:
- The manifest is synchronized.
- There are no orphaned skills.
- The structure is correct.

### 4. Synchronize updates
If the base kit evolves:
```bash
bash scripts/sync-workspace.sh
```
This will update rules, skills, and workflows.

---

## Repository Structure

- **`ai_rules/`**: Base behavioral rules for AI agents. Always active.
- **`skills/`**: Modular technical capabilities. Each skill is in its own directory.
- **`skills_registry/`**: System orchestration layer. Defines skill activation, tiers, skill manifest, and preferred skills.
- **`workflows/`**: Standard procedures for repeatable tasks (e.g., debugging, deployments, releases).
- **`templates/`**: Reusable templates for creating new skills or architectures.
- **`config/`**: General kit configurations.
- **`scripts/`**: Environment automation tools (bootstrap, validation, synchronization).
- **`docs/`**: Detailed kit documentation.

---

## Skills System

Skills are reusable modules used by the AI agent.

**Structure:**
```text
skills/
└── skill-name/
    ├── SKILL.md
    ├── scripts/
    └── resources/
```

**Writing rules:**
- Use imperative verbs.
- Avoid unnecessary narrative.
- Maintain low token consumption.

---

## Tiers System

Skills are classified by levels:

- **Tier 1 — Core**: Always active. Define engineering discipline.
- **Tier 2 — Code Quality**: Used during implementation (e.g., debugging, testing, refactoring).
- **Tier 3 — Multi-Agent Scaling**: Used for orchestration, planning, task division.
- **Tier 4 — Git and Delivery**: Used for commits, branching, releases.

---

## Documentation

Documentation is located in `docs/` and includes:
- Quick start guide
- Architecture
- Skill management
- Release process

---

## Versioning

The repository uses [Semantic Versioning](https://semver.org/).
- **MAJOR**: incompatible changes.
- **MINOR**: new capabilities.
- **PATCH**: bug fixes.

---

## Contribution

Contributions must maintain:
- Modularity.
- Low token consumption.
- Cross-environment compatibility.
- Deterministic agent behavior.