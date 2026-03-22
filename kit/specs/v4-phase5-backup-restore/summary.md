# Summary — V4 Phase 5: Backup & Restore

**Status:** Planning
**Started:** 2026-03-21
**Completed:** —

## What This Is

Expande el `BackupManager` mínimo de Fase 3 al feature completo.
Adds restore atómico con rollback, ciclo de vida de backups (delete, prune),
`~/.pedrito/config.json` para trackear estado instalado, y CLI `pedrito backup`.

## Key Decisions

- **ID = timestamp ISO** — ordenación lexicográfica gratuita, legible para debug; sin UUID opacos
- **Restore atómico via staging dir** — copiar estado actual antes de restaurar; revertir si falla; limpiar staging en `finally`; es el patrón correcto para filesystem (sin transacciones)
- **No backup de Engram DB** — puede pesar cientos de MB; tiene su propia lógica de migración; el symlink `~/.pedrito/engram.db` es solo referencia visual
- **ConfigStore en esta fase** — no era bloqueante para Fase 3 pero sí para Fase 6 (profiles necesitan saber el estado instalado para exportar)
- **Guard en orchestrator** — si `backup.create()` lanza → abortar operación; nunca modificar configs sin backup exitoso

## Files to Create / Modify

18 tareas en `06-tasks.md`:
- 1 utils helper (pathToBackupName, formatSize, formatAge, backupDirectory)
- 1 BackupManager completo (reemplaza stub de Fase 3)
- 1 ConfigStore nuevo (`~/.pedrito/config.json`)
- 3 integraciones (orchestrator, mcp add, mcp remove)
- 4 CLI subcomandos (list, restore, delete, prune)
- 1 doctor update
- 1 test suite (10 casos)
- 6 build + verificación (incluyendo smoke tests manuales)
