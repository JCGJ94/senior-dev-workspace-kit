# Summary — V4 Phase 9: Polish de Pedrito Core

**Status:** In Progress
**Started:** 2026-03-22
**Completed:** —

## What This Is

Polish y extensión del núcleo de Pedrito. Tres áreas:
1. **Skills adicionales** — 7 nuevos skills de stack moderno (React 19, Next.js 15, Tailwind 4, Zod 4, AI SDK 5, Playwright, PR Review)
2. **SDD discreto** — Separar `sdd-manager` monolítico en 9 skills de fase específica para mejor composabilidad
3. **Sistema de personas** — Personas como first-class feature con presets y soporte para personas custom

## Key Decisions

- **SDD discreto es aditivo** — `sdd-manager` se mantiene como skill de alto nivel; los discretos son para activación específica por fase
- **Skills de stack como Tier 2** — Son específicos de tecnología y complementan los skills base existentes (frontend, typescript-ecosystem)
- **Personas en `kit/config/personas/`** — Estructura paralela a `config/developer_preferences.md`; el instalador los copia a `.agent/personas/` en cada proyecto
- **AGENTS.md update es aditivo** — Se agregan secciones Engram Protocol, GGA Integration formales; no se elimina nada existente

## New Skills Created

### Tech Stack (9.1)
- `react-19` — Hooks nuevos, Server Components, Form Actions
- `nextjs-16` — App Router, Server Actions, RSC, caché defaults
- `tailwind-4` — CSS-first config, @theme directive
- `zod-4` — Zod v4 API, z.pipe(), performance
- `ai-sdk-5` — Vercel AI SDK v5 patterns
- `playwright` — E2E testing, page objects, fixtures
- `pr-review` — Systematic PR review methodology

### SDD Discreto (9.3)
- `sdd-init` — Bootstrap SDD en proyecto nuevo
- `sdd-explore` — Fase 2: exploración técnica profunda
- `sdd-propose` — Fase 3: propuesta de solución
- `sdd-spec` — Fase 4: especificación formal
- `sdd-design` — Fase 5: diseño técnico
- `sdd-tasks` — Fase 6: desglose de tareas
- `sdd-apply` — Fase 7: implementación guiada
- `sdd-verify` — Fase 8: verificación y evidencia
- `sdd-archive` — Fase 9: cierre y archivo de lecciones

## Files Created / Modified

- `kit/skills/react-19/SKILL.md` (new)
- `kit/skills/nextjs-16/SKILL.md` (new)
- `kit/skills/tailwind-4/SKILL.md` (new)
- `kit/skills/zod-4/SKILL.md` (new)
- `kit/skills/ai-sdk-5/SKILL.md` (new)
- `kit/skills/playwright/SKILL.md` (new)
- `kit/skills/pr-review/SKILL.md` (new)
- `kit/skills/sdd-init/SKILL.md` (new)
- `kit/skills/sdd-explore/SKILL.md` (new)
- `kit/skills/sdd-propose/SKILL.md` (new)
- `kit/skills/sdd-spec/SKILL.md` (new)
- `kit/skills/sdd-design/SKILL.md` (new)
- `kit/skills/sdd-tasks/SKILL.md` (new)
- `kit/skills/sdd-apply/SKILL.md` (new)
- `kit/skills/sdd-verify/SKILL.md` (new)
- `kit/skills/sdd-archive/SKILL.md` (new)
- `kit/config/personas/pedrito-mode.md` (new)
- `kit/config/personas/neutral-mode.md` (new)
- `kit/AGENTS.md` (updated — Engram Protocol, GGA Integration sections)
- `kit/registry/skill_manifest.json` (updated — 16 new skills registered)
