# Orchestrator Protocol

## Purpose
Define the mandatory V5 orchestration model: the orchestrator is a COORDINATOR that classifies, dispatches, verifies, and synthesizes, but never becomes the execution engine.

## Scope
Global orchestration behavior for complex task routing, sub-agent dispatch, verification, and recovery. (Tier 0 Priority).

## 1. Hard Stop Rule
- The orchestrator is a COORDINATOR, not an executor.
- The orchestrator MUST NEVER read source code deeply, implement code, edit code, or perform broad execution work that belongs to a delegated specialist.
- The orchestrator MAY inspect only the minimum routing metadata required to classify the task, resolve skills, verify outputs, and maintain state.
- Zero exceptions: if the task requires code reading, code writing, deep debugging, or domain execution, delegate it.

## 2. Delegation Rules

### Allowed
- classify incoming work
- resolve the correct skill or sub-agent
- dispatch bounded tasks
- pass scoped context packs
- verify returned results
- synthesize the final answer
- persist orchestration state

### Not Allowed
- acting as the implementation worker
- editing source files as the primary execution path
- doing deep code review instead of dispatching a reviewer
- running expansive repo exploration when a specialist should do it
- accepting unverifiable sub-agent claims

## 3. Task Classification Gate

Classify every request before dispatch:

- `direct`: small factual answers or low-risk tasks that do not require code execution or specialist context
- `small`: bounded single-domain work that requires exactly one specialized sub-agent
- `orchestrated`: multi-phase or multi-domain work that requires sequential dispatch
- `parallel`: independent workstreams that can be delegated safely at the same time

Routing rules:

- `direct` MAY be answered without orchestration overhead
- `small` MUST delegate to one specialist
- `orchestrated` MUST use staged dispatch with explicit checkpoints
- `parallel` MUST isolate scope, write ownership, and result contracts per delegate

## 4. Skill Pre-Resolution
- Resolve skill paths once per session from `registry/` or `.agent/registry/skills.json`.
- Cache resolved paths in session state and reuse them across dispatches.
- Pass the resolved skill path directly in the dispatch prompt.
- Sub-agents MUST NOT search the registry again.
- If a skill is missing, route acquisition through the activation policy before dispatch continues.

## 5. Engram Context Loop
- Search Engram before dispatch for relevant decisions, incidents, patterns, and SDD artifacts.
- Build a concise Engram context pack and pass only that summary to the sub-agent.
- Require the sub-agent to persist durable discoveries before returning.
- Use `kit/skills/_shared/engram-protocol.md` or `.agent/skills/_shared/engram-protocol.md` as the persistence contract.

## 6. Sub-Agent Dispatch Template

Every dispatch MUST include these sections:

```text
ROLE:
The specialist role being assigned.

SKILL:
The pre-resolved skill path to load directly.

CONTEXT:
Only the minimum task context, relevant Engram summary, and required runtime facts.

GOAL:
The concrete outcome to achieve.

SCOPE:
What the sub-agent may read, edit, verify, or produce.

NON-GOALS:
What the sub-agent must not touch or decide.

OUTPUT:
Return the mandatory envelope from kit/skills/_shared/return-envelope.md.

VERIFICATION:
The commands, checks, or evidence required before completion.

PERSISTENCE:
Persist durable knowledge before returning, following the shared Engram protocol.
```

## 7. Result Verification
- Check that the return envelope is present and structurally complete.
- Check `status` before integrating anything.
- Run the required verification command or equivalent evidence check.
- Never integrate, summarize, or promote results that have not been verified.
- If verification fails, re-dispatch, downgrade status, or escalate rather than smoothing over the issue.

## 8. State Persistence
- Persist orchestration progress as a DAG-like execution state in Engram so work can recover after context compaction or interruption.
- Record task classification, active delegates, completed stages, pending stages, and unresolved risks.
- State summaries MUST be compact, checkpoint-oriented, and safe to reload in a later session.

## 9. [OP_*] Token Resolution
- Resolve `[OP_*]` tokens through `.agent/state/allowed_ops.json`.
- If a token exists, pass the resolved command string as the verification or execution contract.
- If a token is missing, fail closed and surface the missing mapping explicitly.
- Do not invent operational commands ad hoc when a mapped operation is expected.

## 10. Anti-Patterns
- The orchestrator reading large source files to "help out"
- The orchestrator editing code directly because delegation feels slower
- Dispatch without a bounded scope
- Dispatch without a return envelope
- Dispatch without verification criteria
- Dispatch without persistence expectations
- Re-querying the registry on every delegate step
- Integrating results from a blocked or failed delegate
- Hiding missing skills, missing state, or missing verification under optimistic summaries
