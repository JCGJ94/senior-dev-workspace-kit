# Summary — V4 Phase 6: Team Sharing & Perfiles

**Status:** Planning
**Started:** 2026-03-21
**Completed:** —

## What This Is

Convierte el estado instalado de Pedrito en un JSON portable (`pedrito-profile.json`)
que puede compartirse, versionarse en git, e importarse en otra máquina con un comando.
Nuevo CLI: `pedrito profile export / import / list / save / delete / show`.

## Key Decisions

- **Tokens `null` en export** — señal explícita de "este server requiere configuración"; omitir sería ambiguo
- **Import reutiliza `orchestrator.runInstall()`** — no duplica lógica crítica; garantiza backup previo y verify por agente
- **Store local en `~/.pedrito/profiles/`** — directorio de archivos JSON, no en `config.json`; perfiles son entidades independientes y pueden ser grandes
- **Stubs registry en Fase 6** — registry es infraestructura no-trivial; los stubs reservan espacio en CLI y evitan "command not found" para usuarios que exploran
- **GitHub blob URL → raw URL automático** — el 80% de los usuarios copia la URL del browser; sin esta conversión la mayoría de imports desde GitHub fallarían

## Dependencias

- Fase 5 → `ConfigStore` (para export)
- Fase 3 → `orchestrator.runInstall()` + `InstallState` (para import)
- Fase 4 → catálogo `MCP_SERVERS` (para saber qué tokens son P1)

## Files to Create

20 tareas en `06-tasks.md`:
- 1 schema Zod + errores tipados
- 1 exporter (ConfigStore → PedritoProfile)
- 1 fetcher (URL → PedritoProfile)
- 1 importer (PedritoProfile → orchestrator.runInstall)
- 1 store local (~/.pedrito/profiles/)
- 7 subcomandos CLI (export, import, list, save, delete, show + stubs registry)
- 1 test suite (10 casos)
- 6 build + verificación
