# Why Pedrito?

There are dozens of AI coding tools. This page explains what Pedrito actually is, what it is not, and why the difference matters for teams that need reliable, auditable, developer-controlled AI assistance.

---

## The problem with most AI coding tools

Most AI coding assistants are designed for the individual developer in the moment. They are optimized for fast autocomplete, quick chat answers, and single-session productivity. That is useful. It is also insufficient for serious engineering work.

The gaps that accumulate:

- **No memory.** Every session starts from zero. The AI doesn't know your architecture decisions, your team's conventions, or what went wrong last sprint.
- **No governance.** The AI acts and you react. There are no approval gates, no spec artifacts, no audit trail.
- **No specialization.** One generalist model tries to debug, document, review, and architect simultaneously. Context collapses.
- **Hallucinations on current APIs.** The model was trained months ago. It confidently uses deprecated methods.
- **Vendor lock-in.** Your workflow lives inside a product (Copilot, Cursor, Devin) that you don't control.

Pedrito is built around a different model.

---

## Pedrito vs. GitHub Copilot

| | GitHub Copilot | Pedrito |
|---|---|---|
| **Primary function** | Inline autocomplete + chat | Multi-agent workflow automation |
| **Memory** | None — resets every session | Engram: durable cross-session memory |
| **Specialization** | One generalist assistant | 7 specialized agent modes |
| **Governance** | None | Approval gates, SDD lifecycle, OP_* tokens |
| **Audit trail** | None | Auditable spec artifacts in `specs/` |
| **API accuracy** | Training cutoff | Real-time via Context7 |
| **LLM/IDE dependency** | GitHub + VSCode ecosystem | LLM/IDE agnostic |
| **Architecture awareness** | None | Reads Engram decisions, detects drift |
| **Runs in your repo** | No — cloud product | Yes — `.agent/` lives in your project |

**When Copilot wins:** Fast tab-complete and inline suggestions while typing. It's a keyboard shortcut, not a workflow system.

**When Pedrito wins:** You need the AI to understand your project's history, follow a spec, produce auditable work, and not break things without your approval.

---

## Pedrito vs. Cursor

| | Cursor | Pedrito |
|---|---|---|
| **Primary function** | AI-native IDE with chat and edit | AI orchestrator provisioned into any project |
| **Memory** | Limited — project rules file | Engram: typed memory (decisions, patterns, incidents, domains) |
| **Specialization** | Generalist | 7 specialized modes + JIT skill discovery |
| **Governance** | Manual — you review diffs | SDD lifecycle with explicit approval gates |
| **IDE dependency** | Cursor IDE only | Any IDE — Claude Code, Gemini CLI, etc. |
| **Workflow automation** | Single-turn edits | Multi-phase orchestrated workflows |
| **Spec artifacts** | None | Auditable SDD artifacts per change |
| **Security gates** | None | `security-reviewer` + OP_* authorization tokens |

**When Cursor wins:** Fast, fluid single-turn edits and refactors in a polished IDE experience. Excellent UX for individual developers.

**When Pedrito wins:** Multi-step workflows, team environments where decisions need to be documented, or any context where "the AI did it" is not an acceptable answer.

---

## Pedrito vs. Devin

| | Devin | Pedrito |
|---|---|---|
| **Primary function** | Fully autonomous software agent | Governed orchestrator — developer stays in control |
| **Autonomy model** | High autonomy, low developer control | Dev-piloted autonomy with mandatory approval gates |
| **Transparency** | Black box — you see results | Full visibility — spec artifacts, decision log, Engram |
| **Architecture decisions** | Made autonomously | Require explicit developer approval |
| **Memory** | Session-scoped | Cross-session, typed, evidence-linked |
| **Cost model** | Per-task, expensive | Self-hosted, runs on your LLM subscription |
| **Deployment gates** | None | `deploy-orchestrator` + approval required |
| **Audit trail** | None | SDD spec artifacts, Engram decisions |
| **Recovery** | Opaque | Incident memory in Engram, traceable regressions |

**When Devin wins:** You want to hand off a task entirely and don't need to understand how it was done.

**When Pedrito wins:** You need the work to be correct and explainable. You are the architect. Pedrito is your elite executor — it doesn't make architectural calls without your sign-off.

---

## The core difference: governance

The fundamental distinction is not capability — it's control.

Every AI coding tool can write code. The question is: **who is accountable for it?**

Pedrito's answer is always: the developer.

This is enforced structurally:

- **OP_* tokens** — operations require authorization tokens. Destructive or irreversible actions are gated.
- **SDD lifecycle** — non-trivial changes follow a 9-phase spec process. The developer reviews and approves the spec before implementation begins.
- **Engram memory** — decisions are recorded and cross-referenced. The AI cannot drift from agreed architecture without detection.
- **Verification gates** — no change ships without a verification pass. The agent cannot self-certify.
- **JIT skill approval** — new capabilities from external registries require explicit developer sign-off before activation.

This is not bureaucracy. It is the difference between a tool that assists you and a system that replaces you.

---

## What Pedrito is not

- **Not an IDE.** Pedrito is an orchestrator that runs inside your project. Use whatever editor you prefer.
- **Not a model.** Pedrito is LLM-agnostic. It runs on Claude, Gemini, or any compatible model via the respective CLI.
- **Not a SaaS.** Pedrito lives in your repo. There is no cloud service, no data leaving your environment without your knowledge.
- **Not a replacement for a senior engineer.** Pedrito amplifies senior engineering judgment. It does not substitute for it.

---

## Summary

| Need | Best choice |
|------|-------------|
| Fast autocomplete while typing | GitHub Copilot |
| Smooth single-turn edits in a polished IDE | Cursor |
| Fully autonomous task delegation | Devin |
| Governed, auditable, orchestrated multi-agent workflow automation | **Pedrito** |
| Memory across sessions and projects | **Pedrito** |
| LLM/IDE agnostic orchestrator in your repo | **Pedrito** |
| Spec-driven work with approval gates | **Pedrito** |
