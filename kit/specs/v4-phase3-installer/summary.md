# Summary — V4 Phase 3: Installer con TUI

**Status:** Planning
**Started:** 2026-03-21
**Completed:** —

## What This Is

CLI `pedrito` con TUI interactiva (Ink/React) que reemplaza `setup.sh`.
Instala y configura todos los componentes Pedrito (Engram, GGA, SDD, MCP, Skills, Persona)
en los agentes seleccionados (Claude Code, OpenCode, Gemini, Cursor, VSCode, etc.).

## Key Decisions

- **Ink + React para TUI** — componentes testeables y composables; el equipo ya conoce React
- **Binario compilado con `bun build --compile`** — distribuible sin requerir Bun instalado
- **BackupManager en esta fase** — modificar configs sin backup es inaceptable desde el primer release funcional; Fase 5 agrega features avanzadas
- **MVP mínimo = non-interactive + Claude Code** — reemplaza `setup.sh` antes de tener TUI completa
- **`verify()` por agente, no al final** — falla rápido con contexto de error claro

## Files to Create

48 tareas en `06-tasks.md`:
- 2 config updates (package.json, tsconfig.json)
- 3 system modules (detect, deps, exec)
- 1 backup module
- 4 preset definitions
- 6 component installers (engram, gga, mcp, skills, sdd, persona)
- 10 agent implementations (claude-code, opencode, gemini, codex, cursor, vscode, windsurf, jetbrains, zed, antigravity)
- 3 TUI base components (StatusLine, ProgressBar, Checkbox)
- 8 TUI screens + 1 App root
- 2 CLI modules (main.ts, orchestrator.ts)
- 1 test suite
- 7 build + verification steps
