---
name: "react-19"
description: "Apply React 19 patterns: use() hook, Server Actions, useOptimistic, ref-as-prop, and form actions."
tier: 2
triggers: ["react 19", "react19", "use()", "useOptimistic", "useTransition", "server action", "form action"]
context_cost: 420
---

# React 19

## Purpose
Apply React 19-specific patterns and APIs correctly. Avoid using deprecated patterns (forwardRef, class components) when React 19 equivalents are available.

## Use when
- Building or reviewing React components in a React 19+ project.
- Working with forms, async state, or server/client boundary.
- Migrating from React 18 patterns to React 19.

## Do not use when
- The project explicitly pins React 18 or earlier.
- Working in a pure SSR framework without React (use `nextjs-15` when App Router is the primary concern).

## Core Patterns

### use() hook
```tsx
// Unwrap promises or context — replaces useContext + useMemo for async
const data = use(fetchDataPromise);
const theme = use(ThemeContext);
```

### ref as prop (no more forwardRef)
```tsx
// React 19: ref is a regular prop
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
// React 18 compat: forwardRef still works but is deprecated
```

### Form Actions
```tsx
// Native form integration — no onSubmit handler needed
async function createUser(formData: FormData) {
  'use server';
  await db.users.create({ name: formData.get('name') });
}

<form action={createUser}>
  <input name="name" />
  <button type="submit">Create</button>
</form>
```

### useActionState (replaces useFormState)
```tsx
import { useActionState } from 'react';

const [state, action, isPending] = useActionState(serverAction, initialState);
```

### useOptimistic
```tsx
import { useOptimistic } from 'react';

const [optimisticItems, addOptimistic] = useOptimistic(
  items,
  (state, newItem) => [...state, newItem]
);

async function handleAdd(item) {
  addOptimistic(item); // immediate UI update
  await saveToServer(item); // actual mutation
}
```

### useTransition with async
```tsx
const [isPending, startTransition] = useTransition();

startTransition(async () => {
  await someAsyncOperation();
  setState(newValue);
});
```

### use client / use server directives
```tsx
'use client'; // top of file — marks as Client Component
'use server'; // top of file OR inside async fn — marks as Server Action
```

## Rules
- Prefer `use()` over `useEffect` + `useState` for async data in Suspense trees.
- Never use `forwardRef` for new components — use `ref` as a prop directly.
- Server Actions must be `async` functions marked with `'use server'`.
- `useOptimistic` updates are local until the server responds — always handle revert on error.
- `useActionState` is the correct replacement for `useFormState` (from react-dom/form-hooks).

## Migration Checklist
- [ ] Replace `forwardRef` → ref as prop
- [ ] Replace `useFormState` → `useActionState`
- [ ] Replace `useFormStatus` import path (now from `react-dom`, not `react-dom/form-hooks`)
- [ ] Remove `ReactDOM.render` → `createRoot`
- [ ] Context consumers can use `use(Context)` instead of `<Context.Consumer>`

## Output
When reviewing or writing React 19 code, flag:
- Deprecated `forwardRef` usage
- `useEffect` patterns that can be replaced with `use()`
- Missing `'use client'` or `'use server'` directives
- Incorrect `useActionState` / `useOptimistic` usage
