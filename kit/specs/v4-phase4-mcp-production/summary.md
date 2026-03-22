# Summary — V4 Phase 4: Context7 y MCP en Producción

**Status:** Planning
**Started:** 2026-03-21
**Completed:** —

## What This Is

Hace que MCP funcione realmente en producción. Dos frentes paralelos:
1. **Engram** — añade SSE transport real + handshake MCP completo al servidor existente
2. **Installer** — completa `components/mcp.ts` con writers por agente + `pedrito mcp` CLI

## Key Decisions

- **SSE es aditivo, no reemplaza HTTP** — `POST /mcp` se mantiene para Gemini CLI y scripts; el SSE (`GET /mcp/sse` + `POST /mcp/message`) se añade para Claude Code, Cursor, OpenCode
- **Sesiones SSE en memoria** — efímeras por diseño; SQLite es para persistencia cross-session
- **Context7 via stdio (npx), no remote URL** — local, rápido, funciona offline; OpenCode usa remote SSE como excepción porque tiene mejor soporte nativo
- **Tokens MCP en `env`** — no quedan en texto plano en el config file, práctica estándar MCP stdio

## Packages afectados

- `@pedrito/engram` — `mcp/server.ts` + nuevo `mcp/sessions.ts`
- `@pedrito/installer` — `components/mcp.ts` (completo) + 6 writers + `mcp/status.ts` + `pedrito mcp` CLI

## Files to Create / Modify

23 tareas en `06-tasks.md`:
- 5 tareas Engram (sessions.ts + server.ts SSE + handshake + pruning + tests)
- 6 writers MCP (claude-code, opencode, gemini, cursor, codex, vscode)
- 2 tareas catálogo + status checker
- 1 CLI (`pedrito mcp` subcomandos)
- 1 test suite installer
- 8 build + verificación (incluyendo tests end-to-end manuales)
