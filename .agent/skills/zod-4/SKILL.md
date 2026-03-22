---
name: "zod-4"
description: "Apply Zod v4 API: z.email/url/uuid string methods, z.pipe(), ZodMini, and performance-oriented patterns."
tier: 2
triggers: ["zod 4", "zod v4", "z.pipe", "z.email()", "ZodMini", "zod validation"]
context_cost: 350
---

# Zod v4

## Purpose
Apply Zod v4 schemas correctly. Several v3 string refinements moved to dedicated methods; `z.pipe()` replaces transform chains; `ZodMini` is available for tree-shaking.

## Use when
- Defining validation schemas with Zod in a TypeScript project.
- Migrating from Zod v3.
- Validating API inputs, form data, or environment variables.

## Do not use when
- The project uses a different validation library (Valibot, Yup, etc.).
- Zod version is explicitly pinned to v3.

## Breaking Changes from v3

| v3 | v4 |
|---|---|
| `z.string().email()` | `z.email()` or `z.string().email()` (both work) |
| `z.string().url()` | `z.url()` |
| `z.string().uuid()` | `z.uuid()` |
| `z.string().transform(...).refine(...)` | `z.pipe(z.string(), ...)` |
| `ZodError.format()` | `z.prettifyError(err)` |
| Custom error messages | `error` param in every method |

## Standalone String Validators

```ts
import { z } from 'zod/v4'; // or 'zod' if package.json points to v4

// New top-level validators (no z.string() wrapper needed)
const emailSchema = z.email();
const urlSchema = z.url();
const uuidSchema = z.uuid();
const cuidSchema = z.cuid2();
const nanoidSchema = z.nanoid();

// Still works on z.string() — backwards compatible
const email = z.string().email();
```

## z.pipe() — Composable Transformations

```ts
// v3: chained transforms were hard to type
const schema = z.string()
  .transform(s => s.trim())
  .refine(s => s.length > 0);

// v4: z.pipe() — explicit and composable
const schema = z.pipe(
  z.string(),
  z.transform(s => s.trim()),
  z.string().min(1)
);

// Coercion + validation
const numberFromString = z.pipe(
  z.string(),
  z.transform(Number),
  z.number().positive()
);
```

## Error Handling

```ts
// z.prettifyError — replaces ZodError.format() for human-readable output
import { z } from 'zod/v4';

const result = schema.safeParse(data);
if (!result.success) {
  console.error(z.prettifyError(result.error));
  // Also available:
  result.error.issues;    // Array<ZodIssue>
  result.error.flatten(); // { formErrors, fieldErrors }
}
```

## ZodMini — Tree-Shakeable Subset

```ts
// For bundle-size-sensitive environments
import { z } from 'zod/v4-mini';

const schema = z.object({
  name: z.string(),
  age: z.number(),
});
// Subset of full Zod — no .email(), .url() on z.string()
// Use z.email() top-level instead
```

## Common Patterns

### Environment Variables
```ts
const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.pipe(z.string(), z.transform(Number), z.number().int().positive()),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  API_KEY: z.string().min(32),
});

export const env = envSchema.parse(process.env);
```

### API Input Validation
```ts
const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  age: z.number().int().min(13).optional(),
  role: z.enum(['admin', 'user', 'guest']).default('user'),
});

type CreateUserInput = z.infer<typeof createUserSchema>;
```

### Discriminated Union
```ts
const responseSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('success'), data: z.unknown() }),
  z.object({ status: z.literal('error'), message: z.string() }),
]);
```

### Recursive Schemas
```ts
type Category = { name: string; subcategories: Category[] };

const categorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    name: z.string(),
    subcategories: z.array(categorySchema),
  })
);
```

## Rules
- Use `z.email()`, `z.url()`, `z.uuid()` top-level for new code — cleaner than `z.string().email()`.
- Use `z.pipe()` for multi-step transformations — avoids type inference issues.
- Always use `safeParse` in production code; `parse` throws on invalid input.
- Prefer `z.prettifyError` for logging; use `error.flatten()` for form error maps.
- Use `zod/v4-mini` only when bundle size is a hard constraint and full Zod is measurably impactful.

## Output
Flag:
- `z.string().transform(...).refine(...)` chains that should use `z.pipe()`
- `ZodError.format()` calls (use `z.prettifyError` or `error.flatten()`)
- `parse()` calls in request handlers without try/catch (use `safeParse`)
