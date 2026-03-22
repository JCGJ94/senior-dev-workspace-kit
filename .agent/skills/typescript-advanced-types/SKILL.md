---
name: "typescript-advanced-types"
description: "Master TypeScript advanced type system including generics, conditional types, mapped types and template literals."
tier: 2
triggers: ["typescript types", "generics", "conditional types", "mapped types", "type safety", "infer", "utility types"]
context_cost: 450
---
# TypeScript Advanced Types

## Purpose
Master TypeScript's advanced type system (Generics, Conditional Types, Mapped Types, Template Literals, Utility Types) to enforce extreme compile-time type safety and intelligent inference.

## Use when
- Building deeply type-safe architectures, dynamic forms, or generic API SDKs.
- Executing vast refactors utilizing TypeScript's inference logic (e.g. `infer` keyword).
- The user demands strict typing with essentially zero logic escape hatches.

## Do not use when
- Working in rapid MVP scenarios where `any` compromises might be accepted to ship rapidly (though generally discouraged).
- The language is raw JavaScript, Python, or Go.

## Core Implementations
1. **Generics & Constraints**: Always bind generic parameters to known bounds (`<T extends HasLength>(arg: T)`) rather than unbounded `<T>` allowing chaotic injections in complex architectures.
2. **Conditional & Mapped Types**: Execute logic branches during compilation using `T extends string ? true : false` and index signatures `[P in keyof T]` to dynamically compute derivative types.
3. **Template Literals**: Compute strings rigorously, e.g., ``type Getter<T> = `get${Capitalize<string & keyof T>}` ``.
4. **Type-Safe Utilities**: Use Discriminated Unions for redux-like state machines to guarantee exhaustive switch statements safely.

## Rules
- **Zero Tolerance for 'any'**: Strictly forbid the use of `any`; if dynamic unconstrained narrowing is required, use `unknown` combined with a Type Guard or Assertion Function.
- **Use Discriminated Unions**: For async states (Idle, Loading, Error, Success), avoid arbitrary optional keys inside a single object. Form strict unions marked by a definitive `type` or `status` literal.
- **Deep Immutability**: Use `Readonly<T>` recursively for constant configuration models to prevent accidental runtime mutations.

## Context Efficiency
- Restrict scope entirely to specific interface or `.d.ts` blocks when diagnosing type errors rather than indexing the whole project framework.

## Validation
- Running `tsc --noEmit` returns completely cleanly with zero errors on the associated files.
- Return types correctly narrow to Literal boundaries rather than degrading into wide `string` or `Record<string, unknown>`.

## Output

Return a Structural Typing Report:
### The Target
The function or interface updated to handle advanced constraints.
### Applied Types
The generic/conditional logic composed.
### Result Inference
What the compiled Type definition correctly resolved to conceptually.
