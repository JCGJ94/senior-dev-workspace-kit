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
- `context-distiller`
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
2. `ai-agent`
3. `dispatching-parallel-agents`
4. `verification-before-completion`

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