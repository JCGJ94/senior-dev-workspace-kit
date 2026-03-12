# Dispatching Parallel Agents

## Purpose
Coordinate multiple sub-agents to solve independent sub-problems simultaneously, maximizing throughput while ensuring consistent outputs and rigorous state management.

## Use when
- A task is large and can be decomposed into non-overlapping sub-tasks.
- You need to perform multiple independent research, implementation, or testing steps.
- The task exceeds a single context window and needs parallel processing capacity.
- Work must be completed faster by using concurrent execution lanes.

## Do not use when
- Sub-tasks share a mutable state or depend on each other's outputs sequentially.
- The task is small enough for a single agent pass.
- Bounded execution targets are not yet defined.
- Resource constraints (API limits, memory) prevent parallel execution.

## Parallel Dispatch Workflow

1. **Decomposition & Boundary Definition**
   - Split the main goal into independent chunks (e.g., separate modules, distinct test suites).
   - Ensure each sub-task has 100% isolation.
   - Define exact input/output contracts for each agent.

2. **Context Packaging**
   - Provide each sub-agent ONLY the context required for its chunk.
   - Include global interfaces or shared schemas but exclude unrelated implementation details.
   - Pass instructions on how to report success/failure.

3. **Concurrency Execution**
   - Launch sub-agents using parallel tool calls.
   - Monitor for timeouts or resource exhaustion.
   - Track the status of each execution lane independently.

4. **Result Aggregation**
   - Collect structured outputs (JSON, Markdown) from all sub-agents.
   - Audit each result for correctness and scope adherence.
   - Filter out redundant information or hallucinated APIs.

5. **Conflict Resolution & Merging**
   - Detect if parallel changes affect shared files (e.g., `package.json`, shared utils).
   - Resolve merge conflicts or logical overlaps.
   - If severe conflicts arise, halt and re-plan.

6. **Global Verification**
   - Run a full system-wide verification (`[OP_TEST]`, `[OP_TYPECHECK]`) on the integrated result.
   - Ensure the combination of all parts satisfies the original complex goal.

## Rules
- **Isolation First**: Never dispatch parallel agents on overlapping file sets.
- **Contract-Driven**: Sub-agents must return data in the requested structure.
- **Independent Verification**: Validate each agent's output before merging.
- **Fail-Fast**: If one critical sub-task fails, assess if the entire parallel block should be aborted.
- **No Shared State**: Do not allow sub-agents to assume state changes from their peers.

## Context Efficiency
- Do not pass the entire repository to all agents.
- Distill only the relevant slice for each task.
- Use summaries for cross-agent dependencies.

## Validation
- Sub-tasks were truly independent.
- Each agent stayed within its assigned scope.
- Result integration yielded no regressions.
- Global verification commands passed successfully.

## Output

Return a Dispatch Report:

### Task Decomposition
How the problem was split.

### Agent Assignments
Map of agents to sub-tasks and scopes.

### Aggregated Results
Summary of what each agent achieved.

### Integration Status
Notes on merge correctness and conflict resolution.

### Global Verification
Evidence that the combined solution works.