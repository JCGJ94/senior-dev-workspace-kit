# preferred_skills.md

## Purpose
Define the default skill set the agent should prioritize automatically in this repository, while still allowing explicit user-invoked skills to override the default behavior when appropriate.

## Core Principle
This repository supports **two activation modes**:

1. **Automatic activation**
   - The agent selects skills based on task type, repository context, and execution phase.

2. **Explicit invocation**
   - If the developer explicitly mentions a skill by name or clearly requests its behavior, that skill takes priority as long as it does not conflict with higher-priority guardrails.

This allows both:
- **high automation for normal workflows**
- **high control for advanced or technical users**

---

## Skill Activation Policy

### Rule 1 — Explicitly named skills take priority
If the user explicitly references a skill, workflow, or behavior that maps clearly to an existing skill, the agent should activate that skill directly.

Examples:
- "usa writing-plans"
- "activa verification-before-completion"
- "hazlo con test-driven-development"
- "quiero context-distiller aquí"

Explicit invocation should override generic automatic selection, except when blocked by:
- repository safety rules
- verification requirements
- incompatible task scope

---

### Rule 2 — Automatic activation should be conservative
The agent should auto-activate only the skills that materially improve:
- correctness
- context efficiency
- verification quality
- repository safety

Do not activate extra skills just because they exist.

---

### Rule 3 — Prefer minimal valid skill sets
For any task, activate the **smallest set of skills** that safely solves the problem.

Do not stack multiple overlapping skills unless they each add distinct value.

---

### Rule 4 — Guardrails always remain active
The following guardrail behavior should always be considered globally active even if not explicitly requested:

- `verification-before-completion`
- repository convention awareness
- stack/tooling detection from repo
- context minimization
- scope control

These are not optional quality extras; they are baseline operating rules.

---

## Preferred Skills by Default

### Always-on Guardrails
These should be treated as globally preferred and implicitly active whenever relevant:

- `verification-before-completion`
- `context-optimization`
- `context-distiller`

These three form the minimum operating baseline for reliable agent behavior:
- verify before claiming success
- minimize context usage
- distill only relevant information

---

### Planning and Execution
Activate when the task is non-trivial or multi-step:

- `writing-plans`
- `executing-plans`

Default policy:
- Use `writing-plans` for non-trivial work
- Use `executing-plans` once a clear plan exists

---

### Quality and Investigation
Activate when reviewing, fixing, or validating code quality:

- `code-review-pro`
- `debugging`
- `systematic-debugging`
- `test-driven-development`

Default policy:
- `debugging` for concrete bugs
- `systematic-debugging` for uncertain or multi-layer failures
- `code-review-pro` for review/diff evaluation
- `test-driven-development` when behavior can and should be captured in tests first

---

### Multi-Agent Orchestration
Activate when the task is large enough to benefit from controlled delegation:

- `ai-agent`
- `dispatching-parallel-agents`

Default policy:
- Use `ai-agent` when decomposition is useful
- Use `dispatching-parallel-agents` only for genuinely independent subtasks

---

### Domain Skills
Activate only when the repository area clearly matches them:

- `backend`
- `frontend`
- `fullstack`
- `python-ecosystem`
- `typescript-ecosystem`
- `docs-pro`

Default policy:
- detect stack and affected layer first
- activate only the domain skill that matches the real task surface
- avoid activating both `python-ecosystem` and `typescript-ecosystem` unless the task truly spans both

---

### Git / Branch Workflow Skills
Activate only during repository workflow operations:

- `commit-sentinel`
- `using-git-worktrees`
- `finishing-a-development-branch`

Default policy:
- `commit-sentinel` before commit creation
- `using-git-worktrees` when isolated parallel branch work is useful
- `finishing-a-development-branch` when preparing merge/review readiness

---

## Preferred Activation Patterns

### Small single-file change
Preferred skills:
- `context-optimization`
- `verification-before-completion`

Optional:
- matching domain skill if needed

---

### Multi-step implementation
Preferred skills:
- `writing-plans`
- matching domain skill
- `executing-plans`
- `verification-before-completion`

---

### Bug fixing
Preferred skills:
- `debugging`
- `verification-before-completion`

Optional:
- `systematic-debugging` if root cause is unclear
- `test-driven-development` if the bug can be reproduced with a test

---

### Complex refactor
Preferred skills:
- `writing-plans`
- `code-review-pro`
- `executing-plans`
- `verification-before-completion`

Optional:
- domain skill
- `context-distiller`

---

### Large parallelizable task
Preferred skills:
- `writing-plans`
- `ai-agent`
- `dispatching-parallel-agents`
- `verification-before-completion`

---

### Commit / branch completion
Preferred skills:
- `commit-sentinel`
- `finishing-a-development-branch`
- `verification-before-completion`

---

## Explicit User Control
Technical users may directly steer agent behavior by naming the skill they want.

Supported behavior:
- user names one skill → prioritize that skill
- user names several skills → combine them if compatible
- user asks not to use a skill → avoid it unless it is a hard guardrail

Examples:
- "no uses writing-plans para esto"
- "hazlo con systematic-debugging"
- "quiero code-review-pro y luego commit-sentinel"

This keeps the system friendly both for:
- users who want automation
- users who want tight operational control

---

## Anti-Bloat Rules
Do not automatically activate:
- too many skills at once
- multiple overlapping diagnostic skills without reason
- multiple domain skills when one is enough
- git workflow skills during normal code implementation
- orchestration skills for trivial tasks

---

## Final Principle
Preferred skills are **defaults, not rigid mandates**.

The agent should:
- auto-activate skills conservatively
- honor explicit user skill mentions
- keep guardrails always active
- minimize overlap
- adapt to the repository’s real stack and workflow