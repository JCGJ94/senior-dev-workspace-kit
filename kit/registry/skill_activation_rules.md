# skill_activation_rules.md

## Purpose
Define the exact rules the agent should follow to decide when to activate repository skills, in what order, and how to resolve conflicts between automatic selection and explicit user requests.

---

## Activation Priority Order

The agent should resolve skill activation in this order:

1. **Global guardrails**
2. **Explicit user-invoked skills**
3. **Task-type skills**
4. **Domain / stack skills**
5. **Workflow / Git skills**
6. **Optional optimization skills**

This prevents random activation order and keeps behavior deterministic.

---

## Rule 1 — Global Guardrails First
These behaviors must always be applied when relevant, even if the user does not mention them:

- `verification-before-completion`
- `context-optimization`
- `context-distiller` — activar cuando el contexto estimado supera ~800 tokens, la tarea involucra >3 archivos, o se prepara contexto para un agente especializado
- `humanized-communication` for developer-facing summaries and explanations
- repository stack detection
- repository convention adherence
- scope minimization

These are baseline operating rules, not optional enhancements.

---

## Rule 2 — Explicit User Mentions Override Defaults
If the user explicitly names a skill or requests a workflow that clearly maps to one, activate it.

Examples:
- "usa test-driven-development"
- "quiero writing-plans primero"
- "haz code-review-pro"

If explicitly requested skills conflict:
- prefer the one most directly aligned with the immediate task
- keep guardrails active regardless

---

## Rule 3 — Do Not Activate Skills Speculatively
Only activate a skill when there is a clear reason.

Do not activate a skill because:
- it might help
- it exists in the repo
- it was useful in a previous unrelated task

Activation must be tied to:
- task shape
- repository area
- workflow stage
- explicit user direction

---

## Rule 4 — One Primary Task Skill at a Time
For most tasks, there should be **one primary task skill** plus supporting guardrails.

Examples:
- debugging task → `debugging`
- review task → `code-review-pro`
- planning task → `writing-plans`
- docs task → `docs-pro`

Do not activate multiple primary task skills unless the task genuinely transitions between stages.

---

## Rule 5 — Domain Skills Require Evidence
Activate domain skills only if the repository area clearly matches.

### Activate `backend` when
- server logic
- APIs
- persistence
- auth
- queues
- backend services

### Activate `frontend` when
- UI
- view logic
- components
- client interaction
- layout or state handling

### Activate `fullstack` when
- backend + frontend + contract move together

### Activate `python-ecosystem` when
- Python repo or Python subproject is involved

### Activate `typescript-ecosystem` when
- TS/JS repo or TS/JS subproject is involved

### Activate `docs-pro` when
- docs need to change due to real behavior/config/workflow impact

Do not activate domain skills based on assumptions alone.

---

## Rule 6 — Planning Comes Before Execution
If the task is non-trivial and no clear implementation sequence exists:

1. activate `writing-plans`
2. produce the plan
3. activate `executing-plans` only once a real plan exists

Do not execute large tasks without a plan unless the task is obviously small.

---

## Rule 7 — Debugging Skill Selection
Choose debugging skills based on certainty level:

### Use `debugging` when
- the bug is concrete
- failure is localized
- reproduction is clear

### Use `systematic-debugging` when
- cause is unclear
- issue spans multiple layers
- prior debugging attempts failed
- production/integration behavior is ambiguous

Do not activate both unless the task moves from simple diagnosis into deeper investigation.

---

## Rule 8 — Review vs Build Separation
Use `code-review-pro` for evaluation and critique.

Do not use `code-review-pro` as a substitute for:
- implementation
- debugging
- planning
- verification execution

It reviews; it does not replace the rest of the workflow.

---

## Rule 9 — TDD Activation
Activate `test-driven-development` when:
- behavior can be expressed as a test first
- new logic is being introduced
- a reproducible bug should first become a failing test

Do not force TDD when:
- there is no meaningful automated test surface
- the task is purely config/docs
- the work is exploratory and expected behavior is not yet clear

---

## Rule 10 — Multi-Agent Activation
Activate `ai-agent` when:
- the task benefits from decomposition
- work can be partitioned safely
- context can be reduced through delegation

Activate `dispatching-parallel-agents` only when:
- subtasks are truly independent
- no shared file edits are required
- integration can happen safely afterward

Never parallelize:
- same-file edits
- sequential dependencies
- tightly coupled refactors

---

## Rule 11 — Git Skills Trigger by Workflow Stage
Activate Git workflow skills only at the correct stage.

### `commit-sentinel`
Use before creating or proposing a commit.

### `using-git-worktrees`
Use when separate isolated branch workspaces improve safety or parallel work.

### `finishing-a-development-branch`
Use when the branch is being finalized for review, merge, or integration.

Do not activate Git skills during normal coding unless the task specifically enters that workflow phase.

---

## Rule 12 — Verification Is Mandatory Before Completion
Whenever the agent is about to claim:
- "done"
- "completed"
- "fixed"
- "ready"
- "finished"

the agent must activate `verification-before-completion`.

No completion claim without verification evidence.

---

## Rule 13 — Context Skills Must Stay Lightweight
`context-distiller` and `context-optimization` should reduce load, not create it.

Use them to:
- reduce prompt size
- focus only on relevant files/signals
- stage context expansion incrementally

Do not turn context-management skills into verbose analysis rituals.

---

## Rule 14 — Prefer Repo Reality Over Skill Preference
Skills must adapt to:
- real repo tooling
- real runtime
- real package manager
- real test stack
- real conventions

A skill never overrides repository truth.

---

## Rule 14A — Human Tone Must Not Dilute Technical Truth
Use `humanized-communication` when the output is aimed at a developer and clarity improves through a calmer, more human tone.

Do not use it to:
- weaken safety language
- soften approval gates
- blur uncertainty
- replace exact technical statements with generic prose

This is especially important for:
- `backend`
- `frontend`
- `fullstack`
- `python-ecosystem`
- `typescript-ecosystem`

---

## Rule 15 — Minimize Skill Overlap
Avoid redundant combinations such as:
- `debugging` + `systematic-debugging` + `code-review-pro` all at once for a small bug
- `backend` + `fullstack` for a backend-only task
- `writing-plans` for a trivial one-step edit
- `dispatching-parallel-agents` for a tiny scoped change

Use the smallest valid combination.

---

## Rule 16 — V3 Master Orchestrator Owns Cross-Cutting Work
Activate `architect-orchestrator-v3` when:
- the task spans memory, planning, verification, security, and deploy concerns
- the repository is operating under the V3 architecture model
- multiple specialized sub-agents need one architecture owner

Do not activate it for tiny direct tasks where a single skill is enough.

---

## Rule 17 — Specialized V3 Sub-Agents Stay Narrow
Use the V3 specialized sub-agents only for their bounded responsibility:

- `engram-manager` for durable memory promotion and retrieval structure
- `sdd-manager` for 9-phase lifecycle control
- `skill-governor` for skill adaptation, trust, and activation
- `security-reviewer` for security and CI/CD risk review
- `test-verifier` for evidence-driven verification
- `deploy-orchestrator` for release and deploy readiness
- `context-keeper` for stable context selection and rotation

Do not treat them as generic replacements for implementation or domain work.

---

## Rule 18 — Trusted Upstream Skills Still Require V3 Adaptation
Maintainer-selected skills from the mother repository are high-trust inputs and should be preferred over arbitrary external sources.

However:
- they still must be adapted to V3 metadata and orchestration contracts when needed
- they must not bypass core guardrails
- they must not weaken context stability or verification discipline

When the required skill is not local, external lookup should happen in this order:
1. `https://skills.sh/`
2. `https://agents.md/`
3. `https://github.com/obra/superpowers`

External discovery does not imply automatic adoption. Approval and V3 adaptation still apply.

---

## Recommended Activation Sequences

### Non-trivial implementation
1. `context-optimization`
2. `writing-plans`
3. domain skill
4. `executing-plans`
5. `verification-before-completion`

### Bug fix
1. `context-distiller`
2. `debugging`
3. optional `test-driven-development`
4. `verification-before-completion`

### Complex uncertain failure
1. `context-distiller`
2. `systematic-debugging`
3. domain skill if needed
4. `verification-before-completion`

### Code review
1. `context-optimization`
2. `code-review-pro`

### Large decomposable task
1. `writing-plans`
2. optional `architect-orchestrator-v3`
3. `ai-agent`
4. optional `dispatching-parallel-agents`
5. `verification-before-completion`

### V3 architecture-governed task
1. `context-keeper`
2. `architect-orchestrator-v3`
3. `sdd-manager`
4. optional domain skill
5. optional `skill-governor`
6. `test-verifier`
7. optional `security-reviewer`
8. optional `deploy-orchestrator`
9. `engram-manager`

### Commit / branch handoff
1. `commit-sentinel`
2. `finishing-a-development-branch`
3. `verification-before-completion`

---

## Final Policy
The agent should behave like this:

- detect the task correctly
- activate the minimum useful skill set
- honor explicit user skill naming
- keep guardrails active
- adapt to the actual repository
- verify before declaring success
