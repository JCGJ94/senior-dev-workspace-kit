<div align="center">
  <img src="assets/hero.svg" alt="Pedrito - AI Engineering Workspace Kit" width="800" />
</div>

**English** | [Español](README.es.md)

**Pedrito** is your **Senior AI Pair Programmer**, operating through the **AI Engineering Workspace Kit v3**. One command installs everything — then Pedrito runs inside your project with a full V3 architecture: SDD, Engram memory, Context7, MCP, and governed autonomy.

## Install

Clone the kit once and run setup in your project:

```bash
git clone https://github.com/YOUR_USER/ai-engineering-workspace-kit.git
cd /path/to/your-project
bash /path/to/ai-engineering-workspace-kit/setup.sh
```

That's it. Setup installs the kit globally, registers the `pedrito` command in your shell, and provisions your project.

After reloading your shell (`source ~/.bashrc` or restart terminal), use `pedrito` from any directory:

```bash
pedrito init      # provision any project
pedrito sync      # sync runtime after kit updates
pedrito status    # runtime state at a glance
pedrito doctor    # health check: SDD · Engram · Context7 · MCP
pedrito validate  # audit skills and kit
pedrito update    # update the kit itself
```

## Why Pedrito?

- **Dev-piloted Autonomy:** Autonomous execution with strict developer approval gates. You are the architect; Pedrito is your elite executor.
- **Humanized Tone:** Code like a senior engineer, interact like a friendly Latino-Hispano colleague.
- **Low-Context Discipline:** Analyzes only what is necessary — fewer tokens, fewer hallucinations.
- **Engram Memory:** True durable cross-session memory (`docs/engram/`). Remembers decisions, patterns, and incidents.
- **Context7 & MCP:** Real-time library docs via Context7. External tools via Model Context Protocol. LLM/IDE agnostic.
- **SDD:** All non-trivial work follows a 9-phase Spec-Driven Development lifecycle (`specs/<change-id>/`).
- **JIT Skills:** Missing a capability? Pedrito discovers and installs skills Just-In-Time from trusted registries.

## Runtime layout

After `pedrito init`, your project contains:

```
.agent/
  core/        installed rules (Pedrito's brain)
  registry/    skills.json — JIT activation index
  skills/      installed runtime skills
  workflows/   SDD workflow definitions
  state/       env_state.json, allowed_ops.json (OP_* tokens)
docs/engram/   durable memory (decisions, patterns, lessons)
specs/         auditable SDD artifacts for non-trivial work
AGENTS.md      runtime contract — Pedrito reads this first
```

## Skill model

Pedrito starts generalist, keeps context minimal, and activates the minimum useful skill set. When a skill is missing, the trusted discovery order is:

1. Local kit / runtime skills
2. `https://skills.sh/`
3. `https://agents.md/`
4. `https://github.com/obra/superpowers`

External skills require explicit developer approval and V3 adaptation before activation.

## Documentation

- [docs/en/00_usage_guide.md](docs/en/00_usage_guide.md)
- [docs/en/02_architecture.md](docs/en/02_architecture.md)
- [docs/en/03_skills_management.md](docs/en/03_skills_management.md)
- [docs/en/04_subagent_architecture_v3.md](docs/en/04_subagent_architecture_v3.md)
- [docs/engram/index.md](docs/engram/index.md)

Built for precise, low-noise, developer-governed AI engineering.
