---
name: "frontend-responsive-design-standards"
description: "Ensure UI layouts are mobile-first with fluid containers, flexible units, and consistent media queries."
tier: 2
triggers: ["responsive", "mobile first", "media query", "breakpoint", "fluid layout", "touch target"]
context_cost: 400
---
# Frontend Responsive Design Standards

## Purpose
Ensure UI layouts are strictly mobile-first, utilizing fluid containers, flexible units (rem/em), consistent media queries, and touch-friendly targets across responsive device sizes.

## Use when
- Creating or modifying layouts that must work on mobile, tablet, and desktop screens.
- Implementing responsive directives in CSS frameworks (e.g., Tailwind, Bootstrap).
- Adjusting typography, hit zones, and flex constraints for usability.

## Do not use when
- Designing purely backend architectures or middleware.
- The project explicitly overrides responsive design behavior for legacy desktop compliance.

## Core Fundamentals
1. **Mobile-First Paradigm**: Set baseline styles for small screens without media queries, then use `min-width` queries to progressively expand the layout for larger devices.
2. **Fluid Layouts**: Use percentages, flexible grids (`1fr`, `minmax()`), or Flexbox (`flex-grow`) instead of hardcoded pixel widths (`width: 1200px`).
3. **Relative Units**: Use `rem` for general typography/spacing and `em` for localized component scaling. Avoid `px` except for atomic lines (1px borders).
4. **Touch Areas**: Ensure the minimum interactive touch area equals 44x44px (iOS standard) or 48x48dp (MD standard).
5. **Image Optimization**: Render `srcset` with modern formats (`webp`, `avif`), allowing the browser to load efficiently based on current dimensions.

## Rules
- **Never Desktop-First**: Forbid writing `max-width` based layout degradation unless strictly isolating an edge case.
- **Base 16px Font**: Default the root paragraph font-size to 16px (`1rem`); never drop below this on mobile to prevent automatic OS browser zooming.
- **No Arbitrary Breakpoints**: Use the exact system breakpoints defined by the project config (e.g., `sm`, `md`, `lg`, `xl`).

## Context Efficiency
- Evaluate localized component modules for responsiveness without rebuilding the entire global stylesheet.

## Validation
- Touch objects contain adequate padding meeting the 44px interactive threshold.
- Adjusting browser dimensions yields zero horizontal scrolling limits or broken reflows.

## Output

Return a Layout Compliance Log:
### Implemented Breakpoints
List the breakpoint/query logic used to satisfy layout width shifts.
### Touch & Typographic Adjustments
What relative units or padding layers were patched.
### Visual Changes
Explanation of the fluid layout enhancements applied.
