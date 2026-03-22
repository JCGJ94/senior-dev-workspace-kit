# Phase 5 Intake — Backup & Restore

**Fecha:** 2026-03-21
**Fase:** V4 Phase 5
**Package:** `@pedrito/installer`
**Directorio:** `packages/installer/src/backup/`

---

## Contexto

En Fase 3 se spec'ó un `BackupManager` mínimo como precondición del instalador:
`create(label, agents[])` y `restore --latest`. Su único propósito era
evitar que `pedrito install` modificara configs sin salvaguarda.

Fase 5 expande esto al feature completo: manifest enriquecido, restore atómico,
gestión del ciclo de vida de backups (delete, prune), CLI de gestión, y el archivo
`~/.pedrito/config.json` que registra el estado instalado de Pedrito.

## Estado actual

`packages/installer/src/backup/backup.ts` existe como stub (spec'd en Fase 3,
implementado durante la implementación de Fase 3). Puede tener un create/restore mínimo.
Fase 5 lo reemplaza con la versión completa.

## Problema que resuelve

Sin un sistema de backup robusto:
- `pedrito update` no tiene forma segura de actualizar skills, MCP configs ni CLAUDE.md
- No hay forma de deshacer una instalación que rompe el entorno del usuario
- Los backups crecen indefinidamente sin poda automática
- No hay visibilidad de qué se instaló, cuándo, y qué archivos se tocaron
- Si un restore falla a mitad, el sistema puede quedar en estado parcial inconsistente

## Objetivo de la fase

1. **BackupManager completo** — create, restore, list, delete, prune con manifest enriquecido
2. **Restore atómico** — si falla al restaurar un archivo, hacer rollback del restore
3. **`~/.pedrito/config.json`** — registro del estado instalado de Pedrito
4. **CLI `pedrito backup`** — list / restore / delete / prune
5. **Garantía de integración** — cada operación de install/update/mcp-add llama `create` antes de modificar

## Restricciones

- Los backups solo guardan archivos de texto (configs) — no binarios ni la DB de Engram
- Nunca almacenar API keys o tokens en texto plano dentro del backup
- Los tokens en `env` de MCP configs sí se guardan en backup (son parte de la config del usuario)
- El directorio de backups no debe crecer más allá de N entradas (configurable, default 10)

## Criterios de éxito

1. `pedrito backup restore --latest` deja el sistema exactamente como estaba antes del último install
2. Restore atómico: si falla, ningún archivo queda a medio restaurar
3. `pedrito backup list` muestra id, fecha, label, agentes, nº de archivos, tamaño total
4. `pedrito backup prune --keep 5` elimina todos excepto los últimos 5
5. `~/.pedrito/config.json` refleja el estado instalado correctamente después de install/update
6. `bun test` verde en el package
