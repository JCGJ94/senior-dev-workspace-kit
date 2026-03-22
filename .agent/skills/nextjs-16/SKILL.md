---
name: "nextjs-16"
description: "Apply Next.js 16.x App Router patterns: Server Components, Server Actions, caching opt-in, PPR, AI agent tooling, and browser log forwarding."
tier: 2
triggers: ["nextjs 16", "next.js 16", "next16", "app router", "server action", "rsc", "partial prerender", "next-browser", "agents.md nextjs"]
context_cost: 520
---

# Next.js 16

> **Source of truth:** `node_modules/next/dist/docs/` — Next.js ships full docs in the npm package. Always read from there before writing code. Do NOT rely on training data for Next.js APIs.

## Purpose
Apply Next.js 16.x App Router patterns correctly. Covers Server Components, Server Actions, caching, PPR, and the new AI-agent tooling introduced in 16.2.

## Use when
- Building or reviewing a Next.js 16+ App Router project.
- Working with Server Components, Server Actions, or route handlers.
- Setting up a project for AI-assisted development.
- Debugging with `next-browser` in an agentic workflow.

## Do not use when
- The project uses the Pages Router exclusively.
- The project is on Next.js 14 or earlier — check `package.json`.

---

## New in 16.2 — AI Agent Tooling

### AGENTS.md — Agent-Ready Project Setup

`create-next-app` now scaffolds `AGENTS.md` and `CLAUDE.md` by default. Add to existing projects:

```md
<!-- AGENTS.md — root of project -->
<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->
```

```md
<!-- CLAUDE.md — root of project (for Claude Code) -->
@AGENTS.md
```

For projects on Next.js < 16.2, generate these via codemod:
```bash
npx @next/codemod@latest agents-md
```

**Why it matters:** Vercel found AGENTS.md with bundled docs achieves 100% pass rate on Next.js evals vs 79% max for skill-based retrieval. The docs in `node_modules/next/dist/docs/` are version-matched — always accurate, no network required.

### Browser Log Forwarding

Browser errors now forward to the terminal by default. Configure in `next.config.ts`:

```ts
// next.config.ts
const nextConfig = {
  logging: {
    browserToTerminal: true,
    // 'error'  — errors only (default when true)
    // 'warn'   — warnings + errors
    // true     — all console output
    // false    — disabled
  },
};
export default nextConfig;
```

This enables AI agents to see client-side errors without browser access.

### Dev Server Lock File

Next.js writes `.next/dev/lock` with PID, port, and URL when `next dev` starts. If a second instance tries to start in the same project:

```
Error: Another next dev server is already running.
- Local:  http://localhost:3000
- PID:    12345
- Dir:    /path/to/project
- Log:    .next/dev/logs/next-development.log

Run kill 12345 to stop it.
```

Agents can read `.next/dev/lock` to discover the running server URL and PID instead of trying to start a new one.

### Experimental Agent DevTools — @vercel/next-browser

Install as a skill:
```bash
npx skills add vercel-labs/next-browser
```

Then trigger via `/next-browser` in Claude Code or Cursor.

Available commands:
```bash
next-browser tree              # React component tree with props/hooks/state
next-browser ppr lock          # Enter PPR mode — show only static shell
next-browser ppr unlock        # Exit PPR mode + show what blocked the shell
next-browser goto /path        # Navigate and inspect
next-browser screenshot        # Capture visual state
```

**PPR shell analysis workflow:**
```bash
next-browser ppr lock
next-browser goto /blog/hello
# → shows skeleton if page is fully dynamic

next-browser ppr unlock
# → prints report:
# blocked by:
#   - getVisitorCount (server-fetch)
#     owner: BlogPost at app/blog/[slug]/page.tsx:5
#     next step: Push the fetch into a smaller Suspense leaf
```

---

## Architecture Overview

```
app/
├── layout.tsx          ← Root layout (Server Component by default)
├── page.tsx            ← Server Component
├── loading.tsx         ← Suspense fallback
├── error.tsx           ← Error boundary ('use client' required)
├── not-found.tsx       ← 404 handler
└── api/
    └── route.ts        ← Route Handler (replaces pages/api/)
```

---

## Caching — Opt-In Since Next.js 15

```ts
// NOT cached by default (since Next.js 15+)
fetch(url);

// Static (cached indefinitely)
fetch(url, { cache: 'force-cache' });

// Revalidate every N seconds
fetch(url, { next: { revalidate: 60 } });

// Explicit dynamic
fetch(url, { cache: 'no-store' });
```

---

## Server Components (RSC)

```tsx
// Default — no hooks, direct DB access OK
export default async function Page() {
  const data = await db.query();
  return <div>{data.map(...)}</div>;
}
```

## Client Components

```tsx
'use client';
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## Server Actions

```tsx
// actions.ts
'use server';

export async function createItem(formData: FormData) {
  const name = formData.get('name') as string;
  await db.items.create({ name });
  revalidatePath('/items');
}

// Inline in component
async function deleteItem(id: string) {
  'use server';
  await db.items.delete(id);
  revalidatePath('/items');
}
```

## Route Handlers

```ts
// app/api/users/route.ts
export async function GET(req: Request) {
  const users = await db.users.findAll();
  return Response.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();
  return Response.json(await db.users.create(body), { status: 201 });
}
```

## Partial Prerendering (PPR)

```ts
// next.config.ts
experimental: { ppr: true }
```

```tsx
// Static shell + dynamic holes via Suspense
import { Suspense } from 'react';

export default function Page() {
  return (
    <>
      <StaticHeader />                         {/* prerendered */}
      <Suspense fallback={<Skeleton />}>
        <DynamicFeed />                        {/* dynamic — PPR hole */}
      </Suspense>
    </>
  );
}
```

**Common PPR mistake — accidental full-page dynamic:**
```tsx
// ❌ Per-request fetch at component top level makes entire page dynamic
export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  const views = await getVisitorCount(params.slug); // ← blocks PPR shell
  return <article>...</article>;
}

// ✓ Push per-request fetch into a Suspense leaf
export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  return (
    <article>
      <h1>{post.title}</h1>
      <Suspense fallback={<span>— views</span>}>
        <VisitorCount slug={params.slug} />    {/* ← isolated dynamic leaf */}
      </Suspense>
      <div>{post.content}</div>
    </article>
  );
}
```

Use `next-browser ppr lock/unlock` to diagnose PPR shell blockers automatically.

## Metadata API

```tsx
// Static
export const metadata = { title: 'Page Title', description: '...' };

// Dynamic
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  return { title: product.name };
}
```

## next.config.ts

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    reactCompiler: true,
  },
  logging: {
    browserToTerminal: true,  // new in 16.2
  },
};
export default nextConfig;
```

---

## Rules

- **Read `node_modules/next/dist/docs/` first** — always more accurate than training data.
- Caching is opt-in — never assume `fetch()` is cached.
- Server Components cannot use hooks — add `'use client'` when hooks are needed.
- Server Actions must be `async` and marked `'use server'`.
- Prefer `Response.json()` over `NextResponse.json()` in Route Handlers.
- `revalidatePath` / `revalidateTag` only from Server Actions or Route Handlers.
- Do not put secrets in Client Components — they ship to the browser.
- When debugging PPR issues in agentic context: use `next-browser ppr lock/unlock`.
- When a second `next dev` fails, check `.next/dev/lock` for the running server URL and PID.

## Output

Flag:
- Missing `'use client'` on components using hooks or event handlers
- Fetch calls that assume legacy caching behavior
- `pages/api/` patterns that should migrate to App Router route handlers
- Server Actions missing `async` or `'use server'`
- Per-request fetches at component top level that block the PPR shell
- Missing `AGENTS.md` / `CLAUDE.md` in AI-assisted projects
