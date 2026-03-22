---
name: "tailwind-4"
description: "Apply Tailwind CSS v4 CSS-first configuration: @theme directive, CSS custom properties, and new utility API."
tier: 2
triggers: ["tailwind 4", "tailwind v4", "tailwindcss 4", "@theme", "css-first config"]
context_cost: 380
---

# Tailwind CSS v4

## Purpose
Apply Tailwind v4 patterns. The configuration model changed completely: CSS-first, no `tailwind.config.js`, design tokens as CSS custom properties.

## Use when
- Starting a new project with Tailwind v4.
- Migrating from Tailwind v3.
- Customizing design tokens or extending the theme.

## Do not use when
- The project explicitly uses Tailwind v3 (`tailwind.config.js` present and not being migrated).

## Breaking Changes from v3

| v3 | v4 |
|---|---|
| `tailwind.config.js` | `@theme` block in CSS |
| `theme.extend` | CSS custom properties |
| `@apply` with custom classes | Still works, but prefer native CSS |
| JIT mode | Always on (no config needed) |
| `darkMode: 'class'` | `@variant dark` in CSS |
| Explicit content paths | Auto-detection |

## Installation

```bash
# v4 with Vite
bun add tailwindcss @tailwindcss/vite

# vite.config.ts
import tailwindcss from '@tailwindcss/vite';
export default { plugins: [tailwindcss()] };
```

```css
/* main.css — single import, no directives needed */
@import "tailwindcss";
```

## CSS-First Configuration with @theme

```css
@import "tailwindcss";

@theme {
  /* Override design tokens — replaces tailwind.config.js theme section */
  --font-sans: 'Inter', sans-serif;
  --color-brand: #6366f1;
  --color-brand-dark: #4f46e5;
  --spacing-18: 4.5rem;
  --radius-card: 0.75rem;

  /* Custom screens */
  --breakpoint-xs: 475px;
}
```

These tokens become utilities automatically:
- `--color-brand` → `bg-brand`, `text-brand`, `border-brand`
- `--spacing-18` → `p-18`, `m-18`, `gap-18`
- `--radius-card` → `rounded-card`

## Dynamic Values (no arbitrary value syntax required for tokens)

```html
<!-- v3: arbitrary values needed for custom tokens -->
<div class="bg-[#6366f1] p-[4.5rem]">

<!-- v4: use the token name directly -->
<div class="bg-brand p-18">
```

## Dark Mode

```css
/* v4: use @variant instead of 'dark:' class strategy config */
@variant dark (&:where(.dark, .dark *));
/* or media query: */
@variant dark (@media (prefers-color-scheme: dark));
```

```html
<div class="bg-white dark:bg-gray-900">
```

## Custom Utilities

```css
@utility container-query {
  container-type: inline-size;
}

@utility flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## Custom Variants

```css
@variant hocus (&:hover, &:focus);
@variant supports-grid (@supports (display: grid));
```

## Gradient Improvements

```html
<!-- v4: interpolation mode for gradients -->
<div class="bg-gradient-to-r from-blue-500 to-purple-500 [interpolation-mode:oklab]">
```

## Migration from v3

```bash
# Official migration tool
npx @tailwindcss/upgrade@next
```

Key manual changes:
- Delete `tailwind.config.js` → move theme to `@theme {}` in CSS
- Replace `@tailwind base/components/utilities` → `@import "tailwindcss"`
- Replace `theme()` function in CSS → `var(--color-*)` custom properties
- Remove `purge`/`content` arrays — v4 auto-detects

## Rules
- Use Context7 for v4-specific API details — the upgrade guide is authoritative.
- Never create a `tailwind.config.js` in v4 projects — use `@theme`.
- Design tokens defined in `@theme` are automatically available as utilities.
- `@apply` still works but prefer CSS custom properties for theming.

## Output
Flag:
- `tailwind.config.js` in a v4 project
- `@tailwind base/components/utilities` directives (replace with `@import "tailwindcss"`)
- Arbitrary values where a `@theme` token would be cleaner
