# Fullstack Skill

## Purpose
Implement and coordinate changes that span both backend and frontend layers while maintaining consistent contracts, stable architecture, and repository conventions.

## Use when
- A feature requires both backend and frontend changes.
- API contracts and UI components must evolve together.
- End-to-end behavior must be implemented or modified.
- A workflow crosses server and client boundaries.

## Do not use when
- The task is purely frontend or backend.
- The repository contains only one application layer.
- The change does not affect client-server interaction.
- The stack or architecture cannot be determined.

## Fullstack Workflow

1. **Identify System Boundaries**
   Determine the affected layers:

   - frontend UI
   - backend services
   - API contracts
   - data models
   - integration points

   Understand how these layers interact before making changes.

2. **Detect Repository Stack**
   Identify the technologies used by the project:

   - frontend framework
   - backend runtime
   - API style (REST, RPC, etc.)
   - validation or typing systems.

   Never introduce new frameworks unless explicitly required.

3. **Define the Contract**
   Before implementing changes:

   - clarify request/response structure
   - define validation rules
   - specify expected errors
   - ensure the contract is stable and predictable.

4. **Implement Backend Changes**
   Update:

   - endpoints or services
   - validation logic
   - data models
   - persistence behavior if required.

   Ensure the backend behavior is correct before updating the frontend.

5. **Update Frontend Integration**
   Adapt:

   - UI components
   - API calls
   - data handling
   - state updates.

   Ensure the UI matches the backend contract.

6. **Preserve Separation of Concerns**
   Maintain clear boundaries:

   - backend handles business logic
   - frontend handles presentation and interaction.

   Avoid mixing responsibilities.

7. **Handle Error and Loading States**
   Ensure the frontend correctly handles:

   - API failures
   - validation errors
   - loading states
   - empty results.

8. **Verify End-to-End Behavior**
   Confirm:

   - API responses match frontend expectations
   - UI interactions produce correct backend behavior
   - data flows correctly through the system.

## Rules
- Detect the stack from the repository before implementing changes.
- Keep backend and frontend responsibilities separate.
- Maintain stable API contracts.
- Avoid introducing new frameworks or libraries unnecessarily.
- Ensure the UI correctly reflects backend behavior.
- Avoid unnecessary cross-layer refactoring.
- Preserve repository conventions.

## Context Efficiency
When working across layers:

Prefer loading:
- API interfaces
- relevant endpoints
- UI components using the API
- validation or schema definitions

Avoid loading:
- entire frontend applications
- unrelated backend modules
- build artifacts.

## Validation
Before confirming completion:

- Backend behavior matches the defined contract.
- Frontend integration correctly uses the API.
- Error and loading states are handled.
- No unnecessary architectural changes were introduced.
- Existing tests or verification commands succeed.

## Output

Return implementation summary:

### Layers Affected
Frontend / Backend / Both

### Contract Changes
API or data model updates.

### Backend Changes
Endpoints, services, or logic modified.

### Frontend Changes
Components or integrations updated.

### Verification
Checks confirming end-to-end behavior.