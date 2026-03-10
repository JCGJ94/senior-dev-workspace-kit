# TypeScript Ecosystem

## Purpose
Work effectively within TypeScript and JavaScript repositories by detecting the real project tooling and respecting the repository’s existing runtime, package manager, and development workflow.

## Use when
- Working on TypeScript or JavaScript projects.
- Implementing backend or frontend logic written in TS/JS.
- Managing dependencies, builds, or tooling for a TS-based project.
- Debugging or refactoring TypeScript modules.

## Do not use when
- The repository is not using JavaScript or TypeScript.
- The task is strictly Python or another runtime environment.
- The runtime or toolchain cannot be determined from the repository.
- The change does not involve TS/JS code.

## TypeScript Workflow

1. **Detect the Toolchain**
   Identify the environment used by the repository.

   Check for:

   - `package.json`
   - `tsconfig.json`
   - lockfiles (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`)
   - build or runtime configuration.

   Detect:

   - runtime (Node, Bun, Deno)
   - package manager
   - build tools
   - test framework
   - lint and format tools.

   Never assume Bun, Node, or Deno without repository evidence.

2. **Respect the Existing Runtime**
   Follow the runtime already used by the project.

   Examples may include:

   - Node.js
   - Bun
   - Deno

   Do not switch runtimes unless explicitly required.

3. **Follow the Package Manager**
   Use the repository’s dependency workflow.

   Possible managers include:

   - npm
   - pnpm
   - yarn
   - bun

   Do not mix package managers.

4. **Respect TypeScript Configuration**
   Follow the repository’s `tsconfig` settings.

   Maintain consistency with:

   - module resolution
   - strictness settings
   - path aliases
   - compilation targets.

5. **Preserve Project Structure**
   Follow the repository’s organization:

   - module boundaries
   - folder structure
   - import patterns
   - naming conventions.

6. **Maintain Type Safety**
   Prefer explicit and reliable typing.

   Avoid:

   - unnecessary `any`
   - unsafe type casting
   - bypassing type checks without justification.

7. **Handle Dependencies Carefully**
   - Add dependencies only when necessary.
   - Prefer existing utilities and libraries.
   - Avoid dependency duplication.

8. **Verify with Project Tooling**
   Use the repository’s real verification commands.

   Examples may include:

   - type checking
   - linting
   - tests
   - build validation.

## Rules
- Detect runtime and tooling from the repository before acting.
- Do not force Bun or any runtime by default.
- Use the repository’s package manager.
- Respect `tsconfig` and project conventions.
- Preserve module boundaries and project structure.
- Maintain strong typing whenever possible.
- Avoid unnecessary dependencies.
- Verify changes using repository tooling.

## Context Efficiency
When working with TypeScript code:

Prefer examining:
- module interfaces
- type definitions
- affected files
- configuration files.

Avoid loading:
- entire dependency trees
- generated build artifacts
- unrelated modules.

## Validation
Before confirming completion:

- The runtime and package manager were correctly detected.
- TypeScript configuration was respected.
- No new tooling conflicts were introduced.
- Type checks, tests, and verification commands succeed.

## Output

Return environment summary:

### Runtime Detected
Node / Bun / Deno.

### Package Manager
Dependency tool used by the repository.

### Changes
Modules or files modified.

### Dependency Impact
New or updated packages.

### Verification
Results of type checks and tests.