# Summary — V4 Phase 2: GGA Guardian Angel

**Status:** Planning
**Started:** 2026-03-21
**Completed:** —

## What This Is

Pre-commit hook que revisa código staged con IA antes de cada commit.
CLI `gga` compilado con Bun. Soporte para 6 providers (claude, ollama, gemini, opencode, lmstudio, github).
Caché SHA256 para evitar re-revisar archivos sin cambios.

## Key Decisions

- **TOML config** (`.gga` o `~/.config/gga/config`) — legible, editable manualmente, `smol-toml` sin bindings nativos
- **SHA256 del contenido completo** — identifica el archivo real independiente del truncado para el LLM
- **fail_open = false por defecto** — GGA existe para garantizar estándares; bloquear en error es intencional
- **stderr para output del hook** — no interfiere con el output de git
- **Sin dependencia de Engram en MVP** — evita bootstrap circular; integración opcional post-MVP

## Files to Create

26 tareas en `06-tasks.md`:
- 1 package.json update
- 6 core modules (config, staged, cache, rules, review, hook)
- 7 providers (claude, ollama, gemini, opencode, lmstudio, github + factory)
- 1 CLI main.ts (commander)
- 1 hook template script
- 1 test suite (6 módulos)
- 8 build + verification steps
