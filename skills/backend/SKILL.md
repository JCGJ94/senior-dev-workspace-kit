---
name: "backend"
description: "Design, implement, and evolve backend systems and APIs with strong contracts, security, validation, and environment-aware execution."
tier: 1
triggers: ["backend", "api", "server", "endpoint", "persistence"]
context_cost: 450
---
# Backend Skill

## Purpose
Design, implement, and evolve backend systems and APIs with strong contracts, security, validation, and environment-aware execution.

## Use when
- Building or modifying APIs, backend services, workers, or server-side business logic.
- Changing database schemas, persistence layers, queues, auth flows, or caching.
- Implementing server integrations with external services.
- Reviewing backend architecture, contracts, or runtime behavior.

## Do not use when
- The task is purely frontend or visual.
- The task is documentation-only with no backend impact.
- The task is trivial configuration with no server logic, contract, or data implications.
- The runtime, framework, or persistence layer is still unknown and cannot be inferred from the repo.

## Backend Workflow
1. **Read the Existing Backend Shape**
   - Identify the actual runtime, framework, package manager, validation layer, ORM/query tool, and test stack from the repository.
   - Do not assume Bun, Node.js, Python, TypeScript, Express, FastAPI, Prisma, or any tool by default.
   - Match existing project conventions before proposing new abstractions.

2. **Define the Contract First**
   - Clarify input, output, auth rules, failure modes, and side effects.
   - Prefer explicit schemas, typed boundaries, and predictable error shapes.
   - Keep API contracts stable unless change is required by the task.

3. **Validate at the Boundary**
   - Validate all external input at the entry point.
   - Sanitize payloads, constrain shape and size, and reject unexpected fields when appropriate.
   - Never trust client input, webhook payloads, headers, query params, or environment variables blindly.

4. **Keep Business Logic Separate**
   - Separate transport concerns from domain logic.
   - Avoid mixing controllers, persistence, and validation in one layer.
   - Prefer small composable services over oversized handlers.

5. **Protect Data and Access**
   - Enforce authentication and authorization explicitly.
   - Default to least privilege for data access and integrations.
   - Avoid leaking internal errors, secrets, tokens, or sensitive identifiers.

6. **Evolve Persistence Safely**
   - Make schema changes through the repository’s actual migration strategy.
   - Prefer reversible and incremental changes.
   - Protect existing data, defaults, and nullability transitions carefully.
   - Never invent migration tooling not already used by the repo unless the task explicitly requires it.

7. **Handle Failure Paths Explicitly**
   - Model expected failures: validation errors, timeouts, rate limits, missing records, conflicts, and downstream outages.
   - Use deterministic error handling and clear server responses.
   - Add retries only where safe and idempotent.

8. **Verify Before Claiming Success**
   - Run the repo-native verification commands for backend changes.
   - Verify contracts, tests, and static checks using the actual project tooling.
   - Do not claim completion without fresh evidence.

## Rules
- Follow the repository’s detected backend stack instead of forcing a preferred one.
- Prefer existing abstractions over introducing new frameworks or patterns.
- Validate inputs at system boundaries.
- Keep handlers thin and business logic explicit.
- Secure every endpoint, action, and integration by default.
- Use the repo’s existing migration and database patterns.
- Model failure cases before optimizing happy paths.
- Keep responses structured and predictable.
- Avoid hidden side effects and magic defaults.
- Never claim backend work is complete without fresh verification evidence.

## Architecture Constraints
- Do not force Bun or any runtime as a default.
- Do not introduce a new ORM, validator, queue, auth library, or cache layer unless the task requires a justified change.
- Do not couple transport models directly to persistence models unless the repo already follows that pattern intentionally.
- Do not widen backend scope with speculative abstractions.

## Validation
Before reporting completion, confirm:
- The runtime and tooling were inferred from the repo, not assumed.
- Input validation exists at every external boundary touched.
- Auth and authorization requirements were preserved or improved.
- Persistence changes follow the repo’s actual migration strategy.
- Failure paths were considered, not only happy paths.
- Fresh backend verification was executed successfully.

## Output
Return:
- Backend area affected
- Runtime and tooling detected
- Contracts changed
- Security considerations
- Persistence impact
- Verification run
- Risks or follow-up notes