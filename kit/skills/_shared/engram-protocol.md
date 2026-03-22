# Engram Protocol

## Purpose

Define how orchestrators and sub-agents exchange durable knowledge through Engram without duplicating responsibility.

## Read Responsibility

- The orchestrator reads Engram before dispatch.
- The orchestrator passes only the relevant Engram summary in the sub-agent prompt.
- Sub-agents treat that summary as the working memory baseline for the assigned scope.

## Write Responsibility

- The sub-agent writes discoveries, decisions, patterns, and incidents before returning to the orchestrator.
- The write MUST happen before the final return envelope is emitted.
- The sub-agent SHOULD persist only durable knowledge, not temporary scratch notes.

## SDD Artifact Topic Keys

Use deterministic topic keys for SDD artifacts:

```text
sdd/{change-name}/{artifact-type}
```

Examples:

```text
sdd/runtime-env-refresh/intake
sdd/runtime-env-refresh/spec
sdd/runtime-env-refresh/verification
```

## Durable Knowledge Types

Persist only knowledge that is reusable across sessions, such as:

- decisions
- patterns
- incidents
- lessons
- conventions

## Graceful Degradation

If the Engram server is unavailable:

- fall back to the file-based store under `docs/engram/`
- keep the same categories and deterministic topic naming when possible
- note the degraded mode in the return envelope `risks` field when persistence could not be fully completed

## Dispatch Contract

- The orchestrator owns Engram lookup before dispatch.
- The sub-agent owns persistence before return.
- The orchestrator does not require the sub-agent to search Engram again unless the task explicitly demands a second lookup.

## Verification Expectations

- If persistence occurred, the return envelope `artifacts` SHOULD mention what was written and where.
- If persistence was skipped, blocked, or degraded, the return envelope `risks` MUST say so explicitly.
