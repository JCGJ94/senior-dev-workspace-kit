# AI Engineering Workspace Kit

🇬🇧 [English](README.md) | 🇪🇸 [Español](README.es.md)

A **professional AI-assisted development environment kit** designed to standardize how AI agents interact with your codebase.

This project provisions a lightweight, modular runtime into any repository, enforcing high-performance engineering standards, context optimization, and cross-stack compatibility.

---

## 🚀 Quick Start (v2)

Turn any repository into an AI-ready workspace in seconds.

### 1-Step Installation
From the root of your target project:

```bash
# 1. Provision (Creates .agent/ and detects your stack)
bash path/to/kit/scripts/provision.sh

# 2. Registration (Indexes available skills)
bash path/to/kit/scripts/generate-registry.sh
```

### 🔄 Safe Update
If the base kit is updated, synchronize your project without losing customizations:
```bash
bash path/to/kit/scripts/sync-workspace-v2.sh
```

---

## 🛠️ System Principles

### 1. Environment Adaptation
The kit **never imposes tools**. It detects your stack (Node, Python, Bun, Hybrid) and resolves operation tokens like `[OP_TEST]` or `[OP_INSTALL]` dynamically via `.agent/state/env_state.json`.

### 2. Modular Context
Information is segmented into specialized layers to minimize token consumption and maximize agent reasoning depth:
- `core/`: Fundamental behavioral rules.
- `registry/`: Skill manifests and activation policies.
- `skills/`: Reusable technical capabilities.
- `workflows/`: Standard Operating Procedures (SOPs).

### 3. Skill-Based Architecture
Skills are atomic units of knowledge. They define **WHAT** the agent can do. The **Registry** defines **WHEN** and **HOW** they are activated based on task intent.

---

## 📂 Repository Structure (Source)

- **`core/`**: Source for fundamental AI behavior rules.
- **`registry/`**: Source for skill manifests, tiers, and activation logic.
- **`skills/`**: The library of modular technical capabilities.
- **`workflows/`**: Agnostic Procedures (feature, bugfix, refactor, release).
- **`scripts/`**: Automation tools (provisioning, sync, validation).
- **`docs/`**: Detailed technical documentation.

---

## 🏗️ The .agent Runtime (Output)

When you run `provision.sh`, the kit injects a `.agent/` directory into your project. This is the **operational brain** of the AI:
- `.agent/core/`: Injected rules.
- `.agent/registry/`: Local skill index.
- `.agent/skills/`: Active skill set.
- `.agent/workflows/`: Executable procedures.
- `.agent/state/`: Dynamic environment state (detected tools).

---

## 🎯 Tiers System

Skills are organized by impact and cost:
- **Tier 1 — Core**: Always active. Guards atomicity, safety, and correctness.
- **Tier 2 — Code Quality**: Implementation skills (debugging, TDD, refactor).
- **Tier 3 — Orchestration**: Planning and multi-agent delegation.
- **Tier 4 — Delivery**: Git history, branch finalization, and release.

---

## 🧪 Validation
Maintain kit integrity by validating skill structure and registry consistency:
```bash
bash scripts/validate-skills.sh
```

---

## Versioning & Contribution
This project follows [Semantic Versioning](https://semver.org/). Contributions must focus on **low token consumption**, **imperative style**, and **deterministic behavior**.