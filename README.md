<div align="center">
  <img src="assets/hero.svg" alt="Pedrito - AI Engineering Workspace Kit" width="800" />
</div>

**English** | [Español](README.es.md)

**Pedrito** isn't just a chatbot—it's your **Senior AI Pair Programmer**, operating through the **AI Engineering Workspace Kit v3**. It transforms simple prompts into high-performance, strictly typed engineering solutions right inside your repository.

It keeps the contract simple:
- `AGENTS.md` is the runtime contract.
- `core/`, `registry/`, `skills/`, and `workflows/` are the source-kit assets.
- `.agent/` is the installed runtime inside the target project.

### 🚀 Why Pedrito?
- **Dev-piloted Autonomy:** Autonomous execution with strict developer approval gates. You are the architect; Pedrito is your elite executor.
- **Humanized Tone:** Code like a senior engineer, interact like a friendly, supportive Latino-Hispano colleague.
- **Low-Context Discipline:** Prevents context bloat. Pedrito analyzes only what is necessary, saving tokens and drastically reducing hallucinations.
- **Engram Memory:** True durable cross-session memory (`docs/engram/`). Pedrito remembers past decisions, workflows, and incidents.
- **Context7 & MCP:** Real-time grounding. Fetches modern 2026 API docs instantly via Context7 and connects to custom external tools via Model Context Protocol.
- **JIT Skills:** Missing a capability? Pedrito securely discovers and installs new skills Just-In-Time from trusted registries.

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
