---
name: "writing-plans"
description: "Create structured implementation plans before starting complex tasks."
tier: 1
triggers: ["complex-task", "new-feature", "refactor"]
context_cost: 600
---
# Writing Plans

## Purpose
Create clear, structured implementation plans before starting complex tasks, ensuring work is organized, deterministic, and aligned with repository constraints.

## Use when
- A task involves multiple steps.
- Implementation requires coordination across modules or layers.
- The solution requires careful sequencing.
- The scope of the task is non-trivial.

## Do not use when
- The task is trivial and can be solved in a single step.
- The solution is already clearly defined.
- The request is purely informational.
- The task requires immediate debugging rather than planning.

## Planning Workflow

1. **Understand the Objective**
   Identify the goal of the task.

   Clarify:
   - expected outcome
   - constraints
   - success criteria.

2. **Analyze the Repository Context**
   Examine relevant areas of the repository:

   - affected modules
   - dependencies
   - existing patterns
   - tooling constraints.

   Avoid exploring unrelated parts of the repository.

3. **Define the Solution Strategy**
   Determine the overall approach before writing steps.

   Consider:
   - architecture constraints
   - integration points
   - potential risks.

4. **Break the Work into Steps**
   Divide the solution into sequential tasks.

   Each step should:
   - have a clear objective
   - affect a limited scope
   - produce a measurable result.

5. **Order the Steps Logically**
   Ensure steps follow a clear execution order.

   For example:

   - update schema
   - implement backend logic
   - update frontend integration
   - add tests
   - verify behavior.

6. **Identify Verification Points**
   Define where verification should occur.

   Examples:

   - after implementing core logic
   - after updating integration points
   - before declaring completion.

7. **Limit Scope Creep**
   Keep the plan focused on the task.

   Avoid:
   - speculative improvements
   - unrelated refactors
   - architecture changes outside scope.

## Rules
- Always analyze the task before writing the plan.
- Break work into clear, sequential steps.
- Keep steps focused and measurable.
- Avoid overly large or vague steps.
- Respect repository architecture and tooling.
- Do not include implementation details that belong in execution.
- Plans must be concise and structured.

## Context Efficiency
When planning:

Prefer examining:
- relevant modules
- interfaces
- configuration files

Avoid loading:
- entire repositories
- unrelated directories
- large generated files.

## Validation
Before confirming the plan:

- The objective is clearly defined.
- Steps cover the entire solution.
- Steps follow a logical order.
- No unnecessary steps are included.
- Verification points are defined.

## Output

Return structured plan:

### Objective
Goal of the task.

### Strategy
Overall approach.

### Steps
Ordered list of implementation steps.

### Verification Points
Where validation should occur.