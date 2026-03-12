# AI Engineering Workspace Kit Usage Guide

🇬🇧 [English](00_usage_guide.md) | 🇪🇸 [Español](../es/00_guia_de_uso.md)

This document explains how to use the kit within real projects to standardize AI-assisted development.

---

## Workspace Lifecycle

The system works by provisioning an operational runtime.

### 1. Provisioning

Install the workspace in a new or existing project:

```bash
# Detects your stack and creates .agent/
bash path/to/kit/scripts/provision.sh
```

This creates the `.agent/` directory containing optimized rules, skills, and workflows for your environment.

---

### 2. Registration (Indexing)

Prepare the skill catalog for the agent:

```bash
# Generates the local skill index
bash path/to/kit/scripts/generate-registry.sh
```

---

### 3. Development

During development:
- The agent consults `.agent/core/` for engineering rules.
- Skills are activated based on detected intent.
- Workflows guide complex processes (feature, bugfix, etc.).

---

### 4. Synchronization

When the base kit evolves (new skills or core rules):

```bash
# Updates .agent/ while protecting your local configurations
bash path/to/kit/scripts/sync-workspace-v2.sh
```

---

## Daily Workflow

1. You ask the agent to implement a feature or fix a bug.
2. The agent detects the stack (via `.agent/state/env_state.json`).
3. The agent activates suitable skills (e.g., `typescript-ecosystem`, `debugging`).
4. Agnostic commands (e.g., `[OP_TEST]`) are executed and translated to your real tool (`npm test`, `pytest`, etc.).

---

## Creating New Skills in the Kit

To add a capability to the source kit:

1. **Create folder:** `mkdir -p skills/my-new-skill`
2. **Add SKILL.md:** Define behavior and tools.
3. **Register:** Update `registry/skill_manifest.json`.
4. **Validate:** Run `bash scripts/validate-skills.sh`.

---

## Dynamic Environment Resolution

The kit relies on repository signals to avoid forcing tools:
- Detected lockfiles.
- Present package managers.
- Type configurations (`tsconfig`, `pyproject.toml`).

This allows native, frictionless support for Node.js, Python, Bun, and hybrid projects.
