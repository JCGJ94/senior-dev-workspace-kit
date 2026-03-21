---
name: "frontend"
description: "Design and implement frontend components, UI behavior, and client-side interactions while respecting repository conventions."
tier: 1
triggers: ["frontend", "ui", "component", "client-side", "react"]
context_cost: 420
---
# Frontend Skill

## Purpose
Design and implement frontend components, UI behavior, and client-side interactions while respecting the repository’s existing framework, architecture, and conventions.

## Use when
- Implementing or modifying UI components.
- Building client-side interactions or view logic.
- Updating layouts, forms, or presentation layers.
- Integrating frontend code with APIs or backend services.

## Do not use when
- The task is backend-only.
- The change affects infrastructure, database, or server logic only.
- The repository does not contain frontend code.
- The framework or UI stack cannot be determined.

## Frontend Workflow

1. **Detect the Frontend Stack**
   Identify the existing environment from the repository:

   - framework (React, Vue, Svelte, etc.)
   - language (JS, TS)
   - styling approach (CSS, Tailwind, modules, etc.)
   - build tooling

   Never introduce a new framework unless explicitly required.

2. **Respect Existing Architecture**
   Follow the repository’s structure:

   Examples:
   - component organization
   - routing patterns
   - state management
   - API integration methods

   Avoid introducing new architectural patterns unnecessarily.

3. **Keep Components Focused**
   Components should:

   - have a single responsibility
   - remain small and composable
   - avoid mixing UI and business logic.

4. **Separate UI and Logic**
   Prefer separation between:

   - presentation
   - state management
   - data fetching
   - reusable utilities

   Avoid embedding complex logic directly in UI components.

5. **Handle State Carefully**
   Follow the repository’s state approach:

   Examples:
   - local component state
   - centralized state
   - server-driven state

   Do not introduce new state systems without justification.

6. **Ensure UI Reliability**
   Validate:

   - form input handling
   - error states
   - loading states
   - empty states

   The UI must remain stable under different conditions.

7. **Optimize Performance**
   Avoid:

   - unnecessary re-renders
   - excessive DOM updates
   - heavy client-side computation.

   Prefer efficient rendering patterns.

8. **Verify the Implementation**
   Confirm:

   - UI renders correctly
   - interactions behave as expected
   - integration with APIs works
   - existing tests pass if present.

## Rules
- Follow the repository’s detected frontend framework.
- Avoid introducing new UI libraries unless required.
- Keep components small and focused.
- Separate presentation from logic.
- Maintain consistent styling and component patterns.
- Ensure UI handles loading, errors, and empty states.
- Avoid unnecessary complexity in client-side logic.
- Respect existing routing and state patterns.

## Context Efficiency
When working with frontend code:

Prefer examining:
- component files
- related styles
- API integration points
- routing configuration

Avoid loading:
- unrelated modules
- large build outputs
- generated assets.

## Validation
Before confirming completion:

- The frontend stack was detected from the repository.
- New components follow repository conventions.
- UI states (loading, error, empty) are handled.
- No unnecessary frameworks or libraries were introduced.
- Existing functionality remains intact.

## Output

Return implementation summary:

### UI Area
Components or pages affected.

### Framework Detected
Frontend environment used by the repository.

### Changes
Description of UI updates.

### Integration
API or state interactions involved.

### Verification
Checks performed to confirm correct behavior.