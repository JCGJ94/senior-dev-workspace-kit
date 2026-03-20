---
name: "context-distiller"
description: "Extract and compress the minimum useful context required to solve a task while preserving critical details."
tier: 1
triggers: ["distill", "sub-agent", "large-context", "compression"]
context_cost: 350
---

# Context Distiller

## Purpose
Extract and compress the minimum useful context required to solve a task while removing irrelevant information, reducing token usage, and preserving critical details.

## Use when
- Preparing context for a sub-agent or tool.
- Handling large files, logs, or multi-file repositories.
- Reducing prompt size before agent execution.
- Extracting only the relevant parts of a problem.

## Do not use when
- The full context is already small and clear.
- The task depends on complete file analysis.
- Compression would remove important technical details.
- The context is already optimized.

## Distillation Workflow

1. **Identify the Objective**
   - Determine what the agent actually needs to solve.
   - Ignore unrelated repository areas.
   - Focus only on information relevant to the task.

2. **Locate Relevant Signals**
   Extract only:

   - affected files
   - relevant functions
   - error messages
   - interfaces
   - configuration involved in the task
   - related tests or validation logic

3. **Remove Context Noise**
   Exclude:

   - build artifacts
   - generated files
   - dependency lockfiles
   - long logs with no actionable errors
   - unrelated modules
   - repeated information

4. **Compress Without Losing Meaning**

   Prefer:

   - summaries of large sections
   - extracted function signatures
   - reduced code snippets
   - structured lists

   Avoid copying entire files when only a section is needed.

5. **Structure the Distilled Context**

   The final context should be organized clearly:

   - Task goal
   - Relevant files
   - Key code snippets or interfaces
   - Errors or constraints
   - Expected output

6. **Validate the Distillation**
   Confirm that:

   - no critical dependency was removed
   - the task remains solvable with the reduced context
   - the information is accurate and not hallucinated

## Rules
- Always prioritize **signal over volume**.
- Keep only context required for the task.
- Prefer summaries and extracted interfaces over full code blocks.
- Avoid repeating information already present in the prompt.
- Do not remove critical technical constraints.
- Never invent context during compression.
- Under V3, align distilled output with `context-keeper` so compression improves stability instead of hiding critical state.

## Context Compression Guidelines

Prefer extracting:

- function signatures
- configuration keys
- API contracts
- error traces
- minimal code fragments

Avoid including:

- full dependency trees
- unrelated utilities
- entire large modules
- repeated documentation

## Validation
Before using distilled context:

- The task is still solvable.
- All relevant dependencies remain visible.
- No critical constraints were removed.
- Token usage is significantly reduced.

## Output

Return distilled context in structured format:

### Task
Short description of the goal.

### Relevant Files
List of files involved.

### Key Context
Extracted code snippets, interfaces, or configs.

### Constraints
Errors, limitations, or environment conditions.

### Distilled Prompt
Optimized context ready for agent execution.
