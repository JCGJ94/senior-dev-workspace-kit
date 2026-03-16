# Engram Index

## Purpose
Act as the durable cross-session memory index for the V3 system.

## Sections
- `decisions/` for architecture and governance decisions
- `patterns/` for reusable implementation and workflow patterns
- `incidents/` for failures, postmortems, and mitigations
- `lessons/` for validated operational learnings
- `domains/` for durable domain knowledge packs

## Retrieval Rules
- Load only the smallest relevant memory slice.
- Prefer summaries and tagged entries over broad scans.
- Durable memory must support future work without inflating the active context window.

## Promotion Rules
- Promote only verified and reusable knowledge.
- Link each memory item back to a spec, workflow, or evidence source.
- Do not store raw session chatter.
