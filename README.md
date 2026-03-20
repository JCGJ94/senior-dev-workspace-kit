```text
       ___  ____
      / _ \/  _/
     / __ _/ /
    /_/ |_/___/

   A G E N T   K I T   (P E D R I T O)
```

**English** | [Español](README.es.md)

The **AI Engineering Workspace Kit** is a V3 source kit for installing a governed AI engineering runtime (operated by **Pedrito**) into any repository.

It keeps the contract simple:

- `AGENTS.md` is the runtime contract.
- `core/`, `registry/`, `skills/`, and `workflows/` are the source-kit assets.
- `.agent/` is the installed runtime inside the target project.

## What it gives you

- a consistent V3 runtime in `.agent/`
- guarded autonomy with developer approval for sensitive actions
- low-token context discipline
- durable memory through `docs/engram/`
- workflow-based execution for non-trivial work
- governed JIT skill adoption from trusted sources
- a calm, human developer-facing tone

## Quick start

Clone the kit somewhere stable:

```bash
git clone https://github.com/YOUR_USER/ai-engineering-workspace-kit.git
```

Initialize a target repository:

```bash
cd /path/to/your/project
bash /path/to/ai-engineering-workspace-kit/scripts/agent init
```

`init` runs in non-interactive mode by default so a fresh runtime installs in one command.

Sync an existing runtime after kit updates:

```bash
bash /path/to/ai-engineering-workspace-kit/scripts/agent sync
```

Validate the source kit:

```bash
bash /path/to/ai-engineering-workspace-kit/scripts/validate-kit.sh
```

If you want the optional skill picker during initialization, pass flags through to the provisioner:

```bash
bash /path/to/ai-engineering-workspace-kit/scripts/agent init --interactive
```

## Runtime layout

After initialization, the target repository contains:

- `.agent/core/` - installed operating rules
- `.agent/registry/` - installed runtime registry and generated `skills.json`
- `.agent/skills/` - installed runtime skills
- `.agent/workflows/` - installed workflows
- `.agent/state/` - generated runtime state and allowed operations
- `docs/engram/` - durable memory packs
- `specs/` - auditable work artifacts for non-trivial changes

## Skill model

The agent starts generalist, keeps context small, and activates the minimum useful skill set.

If a required skill is missing, the trusted discovery order is:

1. local kit/runtime skills
2. `https://skills.sh/`
3. `https://agents.md/`
4. `https://github.com/obra/superpowers`

External skill adoption still requires developer approval and V3 adaptation before activation.

## Documentation

- `docs/en/00_usage_guide.md`
- `docs/en/01_getting_started.md`
- `docs/en/02_architecture.md`
- `docs/en/03_skills_management.md`
- `docs/engram/index.md`
- `specs/README.md`

Built for precise, low-noise, developer-governed AI engineering.
