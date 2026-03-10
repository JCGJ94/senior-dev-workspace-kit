# AI Engineering Workspace Kit Usage Guide

🇬🇧 [English](00_usage_guide.md) | 🇪🇸 [Español](../es/00_guia_de_uso.md)

This document explains how to use the kit within real projects.

The workspace acts as an **operational layer for AI-assisted development**.

---

## Workspace Lifecycle

The system operates in three phases.

### 1. Bootstrap

Install the workspace in a project.

```bash
bash scripts/bootstrap-workspace.sh
```

This creates the `.devkit/` folder.

---

### 2. Development

During development:
- Rules guide the agent.
- Skills are activated when needed.
- Workflows standardize processes.

---

### 3. Maintenance

When the kit evolves:

```bash
bash scripts/sync-workspace.sh
```

This updates existing projects.

---

## Daily Workflow

The standard workflow is:
1. The user asks the agent to implement a feature.
2. The agent activates relevant skills.
3. Rules ensure architectural quality.
4. Workflows guide complex processes.

---

## Creating New Skills

Steps to create a new skill:

1. **Create folder:**
   ```bash
   mkdir -p skills/new-skill
   ```
2. **Add file:**
   Create the main `skills/new-skill/SKILL.md` file.
3. **Register:**
   Register the new skill in the system within `skills_registry/`.
4. **Validate:**
   Run the validation script:
   ```bash
   bash scripts/validate-skills.sh
   ```

---

## Environment Resolution

The kit never forces tools. It relies on signals from the current repository:

- Lockfiles.
- Package managers.
- Language configurations.
- Typing tools.

This allows native support for:
- Python
- Node.js
- Bun
- Hybrid projects
