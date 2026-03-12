# Architecture Rules

## Purpose
Enforce sustainable, modular, and decoupled code structures.

## Scope
Code design, system boundaries, and logic layers. (Tier 2 Priority).

## Hard Architectural Constraints
1. **Size Limits:** Modules/files must remain under 500 lines. Components must have a single responsibility.
2. **Explicit Typings:** Zero-tolerance for implicit or explicit `any` (unless interacting with unknown 3rd party legacy payloads). Interfaces and Types must be defined near their consuming boundaries or in dedicated `types/` directories.
3. **Boundary Integrity:** UI Components must not contain direct database queries or complex business logic. Backend routes must not contain HTML/UI definitions. Establish clear separation (e.g., Services vs Controllers/Resolvers logic).
4. **Dependency Management:** Use Dependency Injection patterns for complex services to ensure testability. Avoid deeply nested relative imports (e.g., `../../../../utils`), prefer path aliases (`@/utils`).
5. **DRY with Context:** Do Not Repeat Yourself, but do not prematurely abstract. Extract code into a shared utility only when it is used identically in 3 or more places. Avoid accidental complexity caused by premature optimization.
