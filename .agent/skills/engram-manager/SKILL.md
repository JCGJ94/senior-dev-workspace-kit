---
name: "engram-manager"
description: "Manage durable cross-session memory, promote verified knowledge into Engram, and keep ephemeral state out of long-term memory."
tier: 2
triggers: ["engram", "memory", "decision", "pattern", "lesson"]
context_cost: 400
---

# Engram Manager

## Purpose
Own the durable memory layer for V3. Decide what knowledge deserves promotion into Engram, where it belongs, and how it should be indexed for future retrieval without bloating active context.

## Use when
- A reusable pattern was discovered.
- An architectural decision was made.
- An incident, failure mode, or lesson should be preserved.
- A completed spec should promote durable knowledge.

## Do not use when
- The information is session noise.
- The content is unverified.
- The note is too local to a single transient task.

## Responsibilities
- classify memory into `decisions`, `patterns`, `incidents`, `lessons`, or `domains`
- summarize only reusable knowledge
- maintain retrieval tags and evidence links
- keep durable memory compact, explicit, and auditable

## Rules
- Promote only verified, reusable, and scoped knowledge.
- Prefer one clear memory item over many overlapping notes.
- Link every promoted item back to a spec, workflow, or evidence source.
- Durable memory must never become a dump of raw session logs.

## Output
Return:
- promotion decision
- target Engram section
- proposed title
- retrieval tags
- supporting evidence
