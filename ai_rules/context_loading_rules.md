# Context Loading Rules
## Purpose
Control how context is provided to the agent.

## Scope
Workspace files, external docs, and user queries.

## Priority
Medium

## Rules
- Send only actively relevant code context.
- Summarize previous decisions instead of full logs.
- Utilize .devkit/ manifest for context pinning.
- Avoid large monolithic files in the context window.
