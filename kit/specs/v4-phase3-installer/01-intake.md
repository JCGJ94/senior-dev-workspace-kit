# Phase 3 Intake — Installer con TUI

**Fecha:** 2026-03-21
**Fase:** V4 Phase 3
**Package:** `@pedrito/installer`
**Directorio:** `packages/installer/`

---

## Contexto

El monorepo V4 tiene tres packages:
- `@pedrito/engram` — servidor de memoria ✓ (Fase 1)
- `@pedrito/gga` — Guardian Angel pre-commit ✓ (Fase 2)
- `@pedrito/installer` — CLI instalador (← esta fase)

El package `@pedrito/installer` existe con un stub mínimo:
- `src/cli.ts` — imprime la versión
- `src/agents/agent.interface.ts` — el `Agent` interface definido en Fase 0
- `package.json` — ya tiene `ink`, `react`, `zod` como deps; `bin: { pedrito: "dist/pedrito" }`

El archivo `kit/setup.sh` existe como instalador legacy en bash. Debe quedar como fallback pero su reemplazo es este CLI.

## Problema que resuelve

Configurar Pedrito en un nuevo sistema requiere ejecutar `setup.sh` manualmente, editar archivos de configuración de múltiples agentes, conocer la estructura de directorios de cada herramienta, y no tiene rollback si algo sale mal. No escala para equipos y no es discoverable para usuarios nuevos.

## Objetivo de la fase

Construir el CLI `pedrito` con:
1. **TUI interactiva** (Ink/React) con pantallas de welcome, system scan, selección de agentes, preset y review
2. **Modo no-interactivo** (`--non-interactive --yes`) para CI/CD y onboarding de equipos
3. **Agent implementations** para los agentes del tier Full/Good: Claude Code, OpenCode, Gemini CLI, Codex, Cursor, VSCode, Windsurf, JetBrains, Zed
4. **Presets**: Full Pedrito, Ecosystem Only, Minimal, Custom
5. **Backup automático** antes de modificar cualquier configuración existente
6. **Componentes de instalación**: Engram, GGA, SDD, MCP (Context7), Skills, Persona

## Usuarios

- Desarrolladores nuevos instalando Pedrito por primera vez
- Equipos haciendo onboarding uniforme vía `--non-interactive`
- Usuarios actualizando componentes individuales (`pedrito install --component engram`)

## Restricciones

- Debe funcionar en macOS (Apple Silicon + Intel) y Linux/Ubuntu/WSL2
- Windows es nice-to-have (Phase 3.x)
- El binario compilado con `bun build --compile` no debe tener dependencias externas en runtime
- Ink requiere React: el JSX/TSX debe compilar correctamente con Bun
- Nunca modificar configs sin hacer backup primero

## Criterios de éxito

1. `pedrito install` abre la TUI y completa un flujo end-to-end en macOS Apple Silicon
2. `pedrito install --agents claude-code --preset full-pedrito --non-interactive --yes` funciona sin input del usuario
3. Cada agente soportado se configura correctamente (skills, MCP, Engram plugin, GGA, persona)
4. Se crea backup en `~/.pedrito/backups/` antes de cualquier modificación
5. `pedrito doctor` reporta el estado de todos los componentes
6. `bun test` verde en el package
