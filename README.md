<div align="center">
  <img src="kit/assets/hero.svg" alt="Pedrito - AI Agent System for Developer Workflow Automation" width="800" />
</div>

**English** | [Español](kit/README.es.md)

**Pedrito** is an **AI Agent System for Developer Workflow Automation**. Analyze code, debug systematically, generate docs, optimize prompts, and orchestrate complex workflows — all inside your project, with full developer control and zero hallucinations.

Pedrito V4 runs as compiled Bun binaries and provisions a governed runtime inside your project: SDD workflows, Engram memory, GGA pre-commit review, MCP wiring, and reproducible team profiles.

## Install

Install the binaries (or build locally), then provision your project:

```bash
curl -fsSL https://raw.githubusercontent.com/josec/pedrito/main/scripts/install.sh | sh
# or: brew install pedrito (after tap setup)
```

Then, from your target project directory:

```bash
pedrito install --agents claude-code --preset full-pedrito
pedrito doctor
pedrito version
```

Useful follow-up commands:

```bash
pedrito backup list
pedrito mcp status
pedrito profile export --output ./team-profile.json
pedrito sync --to ./pedrito-sync.json
pedrito update --all --dry-run
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

After `pedrito install`, your project contains:

```
.agent/
  core/        installed rules (Pedrito's brain)
  registry/    skills.json — JIT activation index
  skills/      installed runtime skills
  workflows/   SDD workflow definitions
  personas/    persona presets (pedrito-mode, neutral-mode)
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

- [kit/docs/en/00_agent_modes.md](kit/docs/en/00_agent_modes.md)
- [kit/docs/en/01_why_pedrito.md](kit/docs/en/01_why_pedrito.md)
- [kit/docs/en/02_architecture.md](kit/docs/en/02_architecture.md)
- [kit/docs/en/03_skills_management.md](kit/docs/en/03_skills_management.md)
- [kit/docs/en/04_subagent_architecture_v3.md](kit/docs/en/04_subagent_architecture_v3.md)
- [kit/docs/en/release-process.md](kit/docs/en/release-process.md)
- [kit/docs/engram/index.md](kit/docs/engram/index.md)

Built for precise, low-noise, developer-governed AI engineering.
