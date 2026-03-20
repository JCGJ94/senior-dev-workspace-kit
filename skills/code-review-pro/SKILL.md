---
name: "code-review-pro"
description: "Perform deep code quality audits, detect architectural smells, and evaluate patterns to reduce technical debt and improve maintainability."
tier: 1
triggers: ["review", "audit", "quality", "refactor", "tech-debt"]
context_cost: 450
---
# Code Review Pro

## Purpose
Perform structured code quality audits focused on correctness, maintainability, patterns, and risk detection. Identify technical debt, architectural smells, and improvement opportunities before they compound.

## Use when
- Reviewing a diff, PR, or recently changed module.
- Auditing a module for quality before release.
- Evaluating architectural patterns in a codebase area.
- Looking for hidden side effects, coupling, or duplication.
- Assessing security surface at the code level.

## Do not use when
- Preparing or validating a commit message (use `commit-sentinel`).
- Staging files for Git (use `commit-sentinel`).
- Performing runtime debugging (use `debugging` or `systematic-debugging`).
- Writing new implementation from scratch.

## Review Protocol

1. **Scope the Review**
   Determine what is being reviewed:

   - a diff (staged or PR)
   - a module or component
   - a specific concern (performance, security, patterns)

   Load only the relevant files and interfaces.

2. **Check Correctness**
   - Does the code do what it claims?
   - Are edge cases handled?
   - Are error paths explicit and safe?
   - Are types accurate and narrow?

3. **Evaluate Patterns and Structure**
   - Does the code follow existing project conventions?
   - Is responsibility clearly separated?
   - Is coupling minimized between modules?
   - Are abstractions at the right level (not too deep, not too shallow)?
   - Is there unnecessary duplication?

4. **Detect Smells and Debt**
   Flag:

   - large functions or files (approaching 500 lines)
   - magic numbers or hardcoded values
   - mixed concerns in a single module
   - dead code or unreachable branches
   - unclear naming
   - implicit dependencies

5. **Assess Risk**
   Identify:

   - breaking changes to public APIs or contracts
   - missing or insufficient validation
   - security concerns (injection, exposed secrets, unescaped output)
   - performance regressions (N+1 queries, unnecessary re-renders, unbounded loops)
   - missing tests for critical paths

## Rules
- Focus on substance, not style preferences.
- Respect existing project conventions before suggesting changes.
- Provide actionable feedback: what, where, and why.
- Propose concrete alternatives when flagging issues.
- Do not block on minor style nits.
- Never suggest changes outside the review scope.
- Keep feedback concise and prioritized (critical → important → nice-to-have).

## Context Efficiency
Load only:
- files under review
- interfaces and types they depend on
- related test files if evaluating test coverage

Avoid loading:
- entire repository
- unrelated modules
- build artifacts or generated files

## Validation
Before completing the review:

- All critical issues are documented.
- Each finding includes location, description, and severity.
- Suggestions are actionable and scoped.
- No feedback contradicts project conventions.

## Output

Return:

### Summary
Brief overall assessment (1-3 lines).

### Findings
Ordered list of issues with severity (🔴 critical, 🟡 important, 🟢 nice-to-have).

### Recommendations
Concrete improvement suggestions.

### Risks
Potential impacts if findings are not addressed.