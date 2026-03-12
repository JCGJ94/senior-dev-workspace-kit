# UI/UX Pro Max - Design Intelligence

## Purpose
Apply comprehensive UX guidelines, 50+ styles, 161 color palettes, 57 font pairings, 161 product types, and 25 chart types to structure visual design decisions and interaction patterns for web and mobile.

## Use when
- Designing new pages (Landing Page, Dashboard, Mobile App).
- Creating or refactoring UI components.
- Reviewing UI code for UX, accessibility, or brand consistency.

## Do not use when
- Writing pure backend logic or API schemas.
- The task does not involve how a feature looks, moves, or is interacted with.

## Design Systems Database
This skill leverages a python query script to search for domain heuristics.
You MUST search using the CLI tool:
`python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "Project Name"`

Available Domains for `--domain`:
- `product`: Product type recommendations
- `style`: UI styles, colors, effects
- `typography`: Font pairings
- `color`: Color palettes
- `landing`: Page structure
- `ux`: Best practices
- `react`/`react-native`: Implementation best practices

## Rules
- **Accessibility First**: Always respect 4.5:1 contrast, tap targets (>= 44pt), and focus rings.
- **Micro-Interactions**: Use appropriate durations (150-300ms) with native-feeling easings.
- **Data Querying**: Start any UI task by querying `--design-system`.
- **Hierarchical Storage**: Persist the design system using `--persist` and retrieve correctly via `design-system/MASTER.md`.
- **No Emojis as Icons**: Use proper vector/SVG assets exclusively for structural icons.

## Context Efficiency
- Only load the retrieved design system guidelines relevant for the page being built.
- Do not review unrelated CSS or app components when updating localized UX issues.

## Validation
- Screen interactions comply with requested accessibility scores.
- The UI properly responds across device screen sizes and respects Dark/Light modes.
- Design choices trace back to the output from the `search.py` script.

## Output

Return a UX/UI Setup Plan:
### Design Query Executed
The exact query used and key findings.
### Implementation Specs
Structural breakdown of changes required (spacing, colors, typography).
### Deployed Visual Fixes
Code provided or adjusted based on rules.