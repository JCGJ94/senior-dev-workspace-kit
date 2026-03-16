# AI Agent Skill

## Purpose
Coordinate sub-agents and tool-driven execution with minimal context, strict boundaries, and mandatory verification before integration.

## Use when
- A task can be split into independent sub-problems.
- A task exceeds a safe single-context window.
- Multiple tools or specialized agents are required.
- You need to compress, route, or validate context across execution layers.

## Do not use when
- The task is trivial and can be solved directly in one pass.
- Sub-tasks share mutable state or sequential dependencies.
- The problem is still ambiguous and no bounded execution target exists.
- Delegation would add more overhead than direct execution.

## Agent Orchestration Workflow
1. **Classify the Task**
   - Decide whether the task is direct, decomposable, or parallelizable.
   - Refuse delegation if the task is small enough to solve safely in one context.

2. **Define Boundaries**
   - Assign one clear goal per sub-agent.
   - Define hard scope limits: files, modules, errors, or outputs.
   - State what the sub-agent must not touch.

3. **Pack Minimal Context**
   - Pass only the files, symbols, errors, and constraints required.
   - Prefer summaries, interfaces, plans, and diffs over raw full-file dumps.
   - Exclude generated files, lockfiles, build outputs, and unrelated history.

4. **Enforce Output Shape**
   - Require structured output only.
   - Prefer:
     - Markdown with fixed sections
     - JSON when machine-readable merging is needed
   - Do not accept vague freeform summaries.

5. **Run Independent Execution**
   - Parallelize only when tasks do not share state, files, or ordering constraints.
   - Keep each sub-agent focused on one bounded unit of work.

6. **Verify Before Merge**
   - Review each sub-agent result critically.
   - Check correctness, scope adherence, and completeness.
   - Run fresh validation commands before claiming success.

7. **Integrate Conservatively**
   - Merge only validated outputs.
   - Reject outputs with hallucinated APIs, scope drift, or unverifiable claims.
   - If integration creates conflicts, stop and re-plan.

## Rules
- Delegate only when delegation reduces risk, time, or context load.
- Pass the minimum viable context.
- Prefer repo-native tools and commands over invented workflows.
- Do not assume Bun, TypeScript, Python, or any runtime unless the repo, plan, or task explicitly requires it.
- Require exact output contracts from every sub-agent.
- Keep prompts compact, imperative, and low-noise.
- Verify sub-agent claims independently before accepting them.
- Do not merge parallel outputs without a final global verification pass.
- Stop when outputs conflict, overlap, or fail validation.
- Favor deterministic, reproducible steps over clever agent behavior.
- Under V3, defer cross-cutting orchestration to `architect-orchestrator-v3` when memory, SDD, security, deploy, and verification concerns are all in play.

## Context Packing Standard
When dispatching a sub-agent, include only:
- Task goal
- Exact file paths or module boundaries
- Relevant errors, tests, or acceptance criteria
- Required output format
- Explicit non-goals

Preferred order:
1. Goal
2. Scope
3. Context
4. Constraints
5. Output format
6. Validation target

## Validation
Before reporting completion, confirm:
- The task was actually appropriate for delegation.
- Each sub-agent stayed inside its assigned scope.
- No unsupported assumptions about runtime or tooling were introduced.
- Outputs are structurally valid and integration-safe.
- Fresh verification was run on the final integrated result.

## Output
Return:
- Delegation decision
- Sub-agent breakdown
- Context sent
- Expected outputs
- Validation status
- Integration risks
