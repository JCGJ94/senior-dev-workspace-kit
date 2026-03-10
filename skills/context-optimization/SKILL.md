# Context Optimization

## Purpose
Control how context is selected, expanded, and reused during problem solving to minimize token usage while preserving the information required to complete the task.

## Use when
- An agent must analyze code, logs, or repository structure.
- The available context window is limited.
- The task requires progressive exploration of a codebase.
- Multiple files or modules may be involved.

## Do not use when
- The task already includes all required context.
- The repository scope is very small.
- The task is trivial and does not require exploration.
- Context expansion would introduce unnecessary noise.

## Context Optimization Workflow

1. **Start With Minimal Context**
   - Begin with the smallest possible information set.
   - Prefer:
     - file names
     - interfaces
     - error messages
     - summaries

   Do not start by loading full modules or directories.

2. **Expand Context Gradually**
   Only expand when the current context is insufficient.

   Expand in this order:

   1. relevant functions
   2. surrounding module
   3. dependent modules
   4. repository-wide patterns

   Avoid loading entire files unless required.

3. **Prefer Signals Over Volume**

   Prioritize:

   - function signatures
   - type definitions
   - API contracts
   - error traces
   - configuration entries

   Avoid:

   - full dependency trees
   - large generated files
   - build outputs
   - repeated documentation.

4. **Reuse Existing Context**
   If context is already available:

   - reference it instead of repeating it
   - avoid duplicating large blocks
   - summarize previously analyzed sections.

5. **Stop Context Expansion Early**
   Do not explore the repository indefinitely.

   Stop expanding when:

   - the task becomes solvable
   - enough dependencies are visible
   - further context adds no new signal.

6. **Prepare Context for Execution**
   Before solving the task:

   - ensure the context is structured
   - confirm that key dependencies are visible
   - remove redundant information.

## Rules
- Always start with minimal context.
- Expand context incrementally.
- Prefer targeted exploration over repository-wide scans.
- Avoid repeating previously analyzed information.
- Prioritize signals over large volumes of text.
- Stop expanding context once the task becomes solvable.
- Never load the entire repository unless explicitly required.

## Context Efficiency Guidelines

Prefer:

- file paths
- function signatures
- configuration entries
- minimal code snippets

Avoid:

- entire directories
- generated code
- lockfiles
- large documentation blocks

## Validation
Before executing the final task confirm:

- The task can be solved with the current context.
- No critical dependencies are missing.
- The context window is not overloaded.
- Redundant information has been removed.

## Output

Return optimized context information:

### Task
Goal of the analysis.

### Context Scope
Files or modules included.

### Context Expansion
Steps taken to gather additional information.

### Final Context
Structured context used to solve the task.