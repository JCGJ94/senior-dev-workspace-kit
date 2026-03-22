# Return Envelope

## Purpose

Define the mandatory return contract for every sub-agent dispatched by the orchestrator.
This keeps integration, verification, and recovery deterministic.

## Mandatory Format

Every sub-agent MUST return a structured envelope with these fields:

```json
{
  "status": "completed | needs_input | blocked | failed",
  "executive_summary": "Short outcome summary for the orchestrator",
  "artifacts": [
    "files changed, specs updated, commands run, or evidence produced"
  ],
  "next_recommended": [
    "recommended next actions for the orchestrator"
  ],
  "risks": [
    "open risks, assumptions, or verification gaps"
  ]
}
```

## Field Rules

### `status`

- MUST be one of: `completed`, `needs_input`, `blocked`, `failed`
- `completed` means the assigned scope is done and verification evidence is included
- `needs_input` means progress is possible but a human or orchestrator decision is required
- `blocked` means the task cannot continue because of a concrete external dependency
- `failed` means the sub-agent attempted the work and could not complete it safely

### `executive_summary`

- MUST be brief and decision-oriented
- MUST describe outcome, not process logs
- SHOULD fit in 1-3 sentences

### `artifacts`

- MUST list concrete outputs
- SHOULD include file paths, verification commands, spec artifacts, or recorded decisions
- MUST be an empty list if no durable artifact was produced

### `next_recommended`

- MUST contain the smallest sensible next steps
- SHOULD be empty when no follow-up is needed

### `risks`

- MUST surface anything the orchestrator should verify, escalate, or avoid integrating blindly
- SHOULD be empty when no material risk remains

## Skill Loading Rule

- The orchestrator resolves the skill path and passes it explicitly in the dispatch prompt.
- The sub-agent loads the provided skill file directly.
- Sub-agents MUST NOT search the registry, re-resolve the skill, or browse for alternative skill paths.

## Integration Rule

- The orchestrator MUST reject outputs that do not follow this envelope.
- Free-form prose is allowed only inside the envelope fields.
- Verification claims without artifacts or risks disclosure are incomplete.
