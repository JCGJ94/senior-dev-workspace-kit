# Frontend Design

## Purpose
Create distinctive, production-grade frontend interfaces with high design quality that strictly avoid generic "AI slop" aesthetics. Emphasize bold styling, custom typography, elegant animations, and memorable UX.

## Use when
- Building web components, landing pages, dashboards, or full applications.
- Styling and beautifying existing web UI interfaces.
- The prompt demands a premium, high-impact aesthetic (e.g., maximalist, minimal, retro, editorial).

## Do not use when
- Working strictly on backend APIs or database schemas.
- The project enforces a strict, purely utilitarian legacy design system with zero room for visual flair.

## Design Thinking & Aesthetics
- **Bold Conceptual Direction**: Choose a distinct aesthetic extreme (e.g., brutally minimal, geometric art-deco, soft pastel) and stick to it cohesively.
- **Typography Excellence**: Abandon system defaults and overused fonts (Inter, Arial, Roboto). Use premium characterful typography (e.g., pairing a unique display serif with a clean sans for body).
- **Color Mastery**: Use dominant, striking colors with sharp accents. Utilize CSS variables for systematic consistency. Avoid predictable "purple gradients on white".
- **Dynamic Motion**: Deploy CSS animations for high-impact moments. Prefer orchestrated staggered reveals on load over scattered micro-interactions.
- **Spatial Autonomy**: Break the grid intentionally. Use asymmetry, overlap, diagonal flows, and controlled negative space.

## Rules
- **No Generic AI Aesthetics**: Forbid the use of typical "generated" styles. Every design must feel genuinely intentional and human-crafted.
- **Implementation Matches Vision**: A maximalist design must be backed by advanced CSS and effects; a minimalist design must be backed by pixel-perfect precision and restraint.
- **Production-Ready**: The HTML/CSS/JS (or React/Vue) code must function perfectly, be accessible, and responsive.

## Context Efficiency
- Absorb any brand guidelines provided by the user, but elevate them.
- Focus exclusively on the presentation layer files (`.css`, `.tsx`, `.html`, UI components).

## Validation
- UI visually breaks away from generic component library defaults.
- Animations and transitions run smoothly without layout thrashing.
- The aesthetic tone matches the specific psychological or business purpose of the project.

## Output

Return a Structured Design Implementation:
### Vision & Tone
The chosen aesthetic direction and typography rationale.
### Component Architecture
How the visual layers are broken down.
### Code Artifacts
The actual styling and presentation code implementing the design.
