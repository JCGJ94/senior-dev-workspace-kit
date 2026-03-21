<div align="center">
  <img src="assets/hero.svg" alt="Pedrito - AI Agent System for Developer Workflow Automation" width="800" />
</div>

**English** | [Español](README.es.md)

**Pedrito** is an **AI Agent System for Developer Workflow Automation**. Analyze code, debug systematically, generate docs, optimize prompts, and orchestrate complex workflows — all inside your project, with full developer control and zero hallucinations.

One command installs everything. Then Pedrito runs inside your project with a full V3 architecture: SDD, Engram memory, Context7, MCP, and governed autonomy.

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

## Agent Modes

Pedrito ships with specialized agent modes for the most common developer workflows. Activate what you need — nothing more.

| Mode | What it does |
|------|-------------|
| **Code Analyzer** | Audits architecture, detects tech debt, reviews code quality and security posture |
| **Debugging Assistant** | Systematic root cause analysis — traces failures, isolates regressions, proposes verified fixes |
| **Docs Generator** | Produces documentation as code: API refs, ADRs, changelogs, and onboarding guides |
| **Prompt Optimizer** | Refines your AI prompts and context windows for accuracy, token efficiency, and reduced hallucinations |
| **Orchestrator** | Coordinates multiple sub-agents to tackle complex, multi-step workflows end-to-end |
| **Code Reviewer** | Deep architectural audits with security gates, commit health checks, and quality enforcement |
| **Test Verifier** | TDD enforcement, verification gates, and regression coverage before any change ships |

Each mode activates the minimum set of skills needed — no bloat, no noise.

## Why Pedrito?

- **You pick the agent.** Analyzer, debugger, docs writer, orchestrator — activate the right agent for the job.
- **Memory that survives sessions.** Engram remembers decisions, patterns, and incidents across weeks. Your project context is never lost.
- **Governed autonomy.** Not a black box. You approve architecture changes, external skills, and destructive operations.
- **Spec-driven work.** Every non-trivial change produces auditable artifacts you can review, reject, or archive.
- **No hallucinations by design.** Context7 feeds real-time library docs. Low-context discipline cuts noise at the source.
- **JIT capabilities.** Missing a skill? Pedrito discovers and installs it from trusted registries — with your approval.
- **LLM/IDE agnostic.** Works with any model and any editor. The agent system lives in your project, not in a vendor's cloud.

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

- [docs/en/00_agent_modes.md](docs/en/00_agent_modes.md)
- [docs/en/01_why_pedrito.md](docs/en/01_why_pedrito.md)
- [docs/en/02_architecture.md](docs/en/02_architecture.md)
- [docs/en/03_skills_management.md](docs/en/03_skills_management.md)
- [docs/en/04_subagent_architecture_v3.md](docs/en/04_subagent_architecture_v3.md)
- [docs/en/release-process.md](docs/en/release-process.md)
- [docs/engram/index.md](docs/engram/index.md)

Built for precise, low-noise, developer-governed AI engineering.
