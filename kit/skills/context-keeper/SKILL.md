---
name: "context-keeper"
description: "Keep the active context window stable by selecting, summarizing, and rotating only the minimum valid context for each V3 workflow phase."
tier: 2
triggers: ["context", "window", "stable", "pack", "memory"]
context_cost: 300
---

# Context Keeper

## Purpose
Protect context stability in V3. Keep the active working set small, phase-aware, and reusable while the system's durable knowledge continues to grow in Engram.

## Use when
- a task spans multiple files or iterations
- context is at risk of ballooning
- the orchestrator needs a bounded context pack for a sub-agent or phase

## Responsibilities
- build minimal context packs
- separate session context from durable memory
- rotate out stale or irrelevant material
- prefer summaries and indexes over repeated full-file loads

## Rules
- Stable context is more important than maximal context.
- Do not re-load large documents when a canonical summary exists.
- Do not promote session clutter into durable memory.
- Keep context packs phase-specific and task-specific.

## Output
Return:
- selected context set
- excluded context
- summary artifacts used
- context risks
