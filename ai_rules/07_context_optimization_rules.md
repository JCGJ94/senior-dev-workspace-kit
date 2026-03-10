# Context Optimization Rules
## Purpose
Minimize token usage and control how context is provided to the agent to speed up AI execution.

## Scope
Prompting, code generation, responses, workspace files, and external docs.

## Priority
Medium

## Rules
- Send only actively relevant code context.
- Summarize previous decisions instead of full logs.
- Utilize .devkit/ manifest for context pinning.
- Avoid large monolithic files in the context window.
- Keep rules compact and token-efficient.
- Avoid narrative text, redundancy, and long explanations.
- Reference existing facts rather than rewriting them.
- Strip comments in minified output if requested.
