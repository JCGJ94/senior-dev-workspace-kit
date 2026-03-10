# Skill Creator

## Purpose
Design and generate new skills that integrate correctly with the repository’s AI engineering framework, ensuring consistent structure, clear activation conditions, and compatibility with the existing skill ecosystem.

## Use when
- Creating a new reusable skill for the repository.
- Extending the AI engineering toolkit with new capabilities.
- Standardizing an ad-hoc workflow into a reusable skill.
- Refactoring or replacing an outdated skill.

## Do not use when
- The task can be handled by an existing skill.
- The workflow is too small to justify a reusable skill.
- The skill would duplicate functionality already present in the ecosystem.
- The repository does not use a skill-based architecture.

## Skill Creation Workflow

1. **Identify the Capability**
   Determine the purpose of the new skill.

   Confirm that:
   - the capability is reusable
   - the workflow appears in multiple tasks
   - it improves agent reliability or efficiency.

2. **Check Existing Skills**
   Review the current skill set to avoid duplication.

   Confirm the capability does not already exist under:

   - a different skill
   - a broader workflow
   - a specialized variant.

3. **Define Skill Scope**
   Clearly establish:

   - what the skill does
   - when it should activate
   - when it should not activate
   - boundaries of responsibility.

   Keep the scope focused and narrow.

4. **Design the Workflow**
   Create a deterministic execution flow.

   The workflow should include:

   - ordered steps
   - clear decision points
   - verification requirements.

5. **Apply the Repository Skill Structure**

   Every skill must follow this structure:

   - Purpose
   - Use when
   - Do not use when
   - Workflow
   - Rules
   - Context Efficiency
   - Validation
   - Output

6. **Ensure Ecosystem Compatibility**

   The skill must:

   - respect repository tooling
   - avoid forcing frameworks
   - integrate with existing skills
   - minimize context usage.

7. **Keep the Skill Focused**
   Avoid large or overly generic skills.

   Prefer:
   - narrow responsibilities
   - composable behavior
   - clear boundaries.

8. **Validate the Skill**
   Confirm that the skill:

   - solves a real recurring workflow
   - does not overlap with existing skills
   - fits the repository architecture
   - follows the standard format.

## Rules
- Create skills only for reusable workflows.
- Avoid overlapping responsibilities between skills.
- Follow the repository’s standard skill structure.
- Keep skill scope narrow and focused.
- Do not introduce tooling or frameworks unnecessarily.
- Ensure skills remain stack-agnostic unless explicitly required.
- Optimize for clarity and deterministic execution.
- Keep instructions concise to minimize token usage.

## Context Efficiency
When generating a new skill:

Prefer including:
- core workflow steps
- activation conditions
- verification rules

Avoid:
- unnecessary explanations
- long narrative descriptions
- duplicated repository rules.

## Validation
Before confirming a new skill:

- The capability is reusable.
- No existing skill already covers the workflow.
- The skill structure matches repository standards.
- The scope is clear and bounded.
- The skill integrates cleanly with the ecosystem.

## Output

Return the generated skill definition:

### Skill Name
Name of the new skill.

### Purpose
Capability the skill provides.

### Activation Conditions
When the skill should be used.

### Workflow
Step-by-step process.

### Integration Notes
How the skill fits within the existing ecosystem.