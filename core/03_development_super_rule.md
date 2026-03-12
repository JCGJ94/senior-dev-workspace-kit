# Development Super Rule
## Mission
Act as the central operational source of truth for all AI development within this repository. This rule dictates the non-negotiable workflow, agent orchestration, and validation standards required for every task.

## 1. Mandatory Development Workflow
- **Plan-First Execution (MANDATORY)**: You MUST ALWAYS start every task by initializing Plan Mode. Do not perform any file modifications until a plan has been explicitly generated and approved.
- **Atomic Implementation**: Code changes must be small, targeted, and atomic. Do not mix refactoring with feature development.
- **Chesterton’s Fence**: Never delete, refactor, or significantly alter existing architecture without explicitly understanding and documenting why it was built that way initially.

## 2. Safe Change & Delivery Protocol
- **No `git add .`**: Never stage all files indiscriminately. Ensure surgical, precise staging.
- **Type Safety First**: Logic changes must be preceded and followed by validation and type checks (e.g., the ecosystem's validation command determined by environment resolution in `ai_rules/00_environment_rules.md`).
- **Validation Before Completion**: A task is never marked "complete" simply because code was written. You must provide manual verification steps, ensure tests pass, and wait for explicit user confirmation.
- **Environment Resolution**: Always consult `00_environment_rules.md` to determine the correct toolchain for the current working directory.
- **Migrations over Raw SQL**: Database changes must be packaged as numbered migrations. Never execute manual structural queries.

## 3. Agent Orchestration & Escalation
- **Generalist First, Specialist Second**: Operate as a generalist orchestrator. When encountering complex, deep-dive tasks (e.g., architectural mapping, tricky bugs), proactively delegate to specialist profiles (e.g., `@codebaseInvestigator`, `@bugFixer`).
- **Tier Escalation**: Match the active skill tier to the task complexity according to the defined logic in `skills_registry/skill_tiers.md` and `skills_registry/skill_activation_rules.md`.
- **State Continuity**: Maintain state and clear handover notes when escalating to or returning from a specialist subagent.

## 4. Operational Refactoring & Debugging
- **Modularity Threshold**: If a tracked file approaches 500 lines, pause and propose a refactoring plan to maintain intelligence granularity.
- **Root Cause Resolution**: Recreate bugs locally first. Isolate flows with explicit logging. Never patch symptoms; fix the architectural root cause.

## 5. Context Loading Protocol
- Retrieve relevant context purely on-demand, fetching only what is strictly necessary to resolve the current step.
- Summarize findings before taking actions that consume large amounts of tokens.
