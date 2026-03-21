# tiers_skill_map.md

## Purpose
Map repository skills to the Tiers architecture so the agent can understand which skills are always foundational, which improve code quality, which govern orchestration, and which manage Git workflow state.

---

## Tier 1 — Core Mandatory Behavior

### Role
These are baseline behaviors that should be treated as always active operating principles across the ecosystem.

### Includes
- stack and tooling detection from repository reality
- context minimization
- scope control
- repository convention adherence
- evidence-based completion behavior

### Practical Skills / Behaviors
- `verification-before-completion` *(global guardrail)*
- `context-optimization`
- `context-distiller`
- `humanized-communication` *(developer-facing communication guardrail)*

### Tier 1 Objective
Ensure the agent:
- works from real repo context
- consumes fewer tokens
- avoids scope drift
- never declares success without verification
- communicates clearly without sounding robotic

---

## Tier 2 — Code Quality and Engineering Discipline

### Role
These skills improve correctness, reliability, maintainability, and disciplined implementation quality.

### Skills
- `code-review-pro`
- `debugging`
- `systematic-debugging`
- `test-driven-development`

### Tier 2 Objective
Ensure the agent:
- reviews changes critically
- debugs with evidence
- investigates uncertainty systematically
- uses tests to protect behavior when appropriate

### Typical Use Cases
- reviewing diffs
- fixing bugs
- diagnosing regressions
- implementing logic with test-first discipline

---

## Tier 3 — Multi-Agent Orchestration and Structured Execution

### Role
These skills govern planning, decomposition, controlled execution, context flow, and parallel task handling.

### Skills
- `writing-plans`
- `executing-plans`
- `ai-agent`
- `dispatching-parallel-agents`
- `context-distiller`
- `context-optimization`

### Tier 3 Objective
Ensure the agent:
- plans before large execution
- executes in controlled stages
- decomposes work safely
- parallelizes only when safe
- manages context efficiently across agents

### Typical Use Cases
- multi-step feature work
- large refactors
- cross-module changes
- multi-agent task routing
- token-sensitive complex analysis

---

## Tier 4 — Git, Branches, and Repository Workflow

### Role
These skills manage commit hygiene, branch finalization, isolated workspaces, and safe repository handoff.

### Skills
- `commit-sentinel`
- `using-git-worktrees`
- `finishing-a-development-branch`

### Tier 4 Objective
Ensure the agent:
- creates atomic meaningful commits
- uses worktrees safely when useful
- finalizes branches only when they are really ready

### Typical Use Cases
- preparing commits
- parallel branch work
- review/merge readiness
- branch cleanup and release preparation

---

## Domain Skills — Stack / Layer Specific Skills

### Role
These skills activate only when the task surface clearly matches a technical domain or repository layer.

### Skills
- `backend`
- `frontend`
- `fullstack`
- `python-ecosystem`
- `typescript-ecosystem`
- `docs-pro`
- `mcp-builder`

### Objective
Ensure the agent:
- adapts to the actual technology stack
- respects layer boundaries
- avoids forcing foreign tooling
- documents real behavior when needed
- construye servidores MCP correctamente tipados y seguros cuando el dominio lo requiere

---

## Meta Layer — Ecosystem Design

### Role
This layer exists to maintain and grow the skills system itself.

### Skills
- `skill-creator`

### Objective
Ensure the repository can evolve new skills without losing structure, consistency, or architectural discipline.

---

## Cross-Tier Relationship Model

### Tier 1 + Tier 2
Use when correctness and quality matter during implementation or debugging.

Example:
- `context-optimization`
- `debugging`
- `verification-before-completion`

---

### Tier 1 + Tier 3
Use for large structured work.

Example:
- `context-distiller`
- `writing-plans`
- `executing-plans`
- `verification-before-completion`

---

### Tier 1 + Tier 3 + Domain Skill
Use for non-trivial real implementation in a specific stack.

Example:
- `context-optimization`
- `writing-plans`
- `python-ecosystem`
- `executing-plans`
- `verification-before-completion`

---

### Tier 1 + Tier 2 + Tier 4
Use for final handoff and repository closure.

Example:
- `code-review-pro`
- `commit-sentinel`
- `finishing-a-development-branch`
- `verification-before-completion`

---

## Activation Guidance by Tier

### Tier 1
Always implicit when relevant.

### Tier 2
Activate when reviewing, debugging, or strengthening reliability.

### Tier 3
Activate for non-trivial planning, orchestration, and multi-step execution.

### Tier 4
Activate only when the task enters Git/branch workflow territory.

### Domain Skills
Activate only when the technical surface clearly matches the domain.

### Meta Layer
Activate only when creating or restructuring skills.

---

## Recommended Default Stack for Agent Behavior

### Minimum default operating baseline
- `context-optimization`
- `context-distiller`
- `verification-before-completion`

### Standard non-trivial implementation flow
- Tier 1 baseline
- `writing-plans`
- one domain skill
- `executing-plans`
- `verification-before-completion`

### Standard debugging flow
- Tier 1 baseline
- `debugging` or `systematic-debugging`
- optional domain skill
- `verification-before-completion`

### Standard repo workflow closure
- Tier 1 baseline
- `commit-sentinel`
- `finishing-a-development-branch`

---

## Final Principle
The Tiers are not just categories.

They define how the agent should behave:

- **Tier 1** keeps the agent disciplined
- **Tier 2** keeps the code correct
- **Tier 3** keeps execution structured
- **Tier 4** keeps repository workflow safe
- **Domain Skills** keep implementation adapted to the real stack
- **Meta Layer** keeps the ecosystem maintainable
