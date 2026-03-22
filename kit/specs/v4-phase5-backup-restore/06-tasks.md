# Phase 5 Tasks — Backup & Restore

## Helpers

- [ ] **5.1** Crear `packages/installer/src/backup/utils.ts`
  - `pathToBackupName(absPath: string): string` — aplana el path con `--`
  - `expandHome(p: string): string` — `~` → `homedir()`
  - `formatSize(bytes: number): string` — `"48 KB"`, `"1.2 MB"`
  - `formatAge(isoTimestamp: string): string` — `"2h ago"`, `"3d ago"`, `"just now"`
  - `backupDirectory(sourceDir, destDir, files): Promise<void>` — copia recursiva excluyendo binarios y archivos > 1MB

## BackupManager completo

- [ ] **5.2** Reemplazar/completar `packages/installer/src/backup/backup.ts`
  - Interfaces `BackupFile` y `BackupManifest` (con `pedritoVersion`, `totalSize`)
  - Class `BackupManager` con constructor que acepta `backupDir` opcional
  - Implementar `create(label, agents[])`:
    - Crear directorio `<backupDir>/<id>-<label>/files/`
    - Iterar `agent.configPaths()` — copiar archivos existentes, skip directorios que no existen
    - Llamar `backupDirectory` para entries que son directorios
    - Escribir `manifest.json` con todos los campos
  - Implementar `restore(backupId)` con restore atómico via staging:
    - Copiar estado actual a staging temp
    - Restaurar desde backup
    - Si falla → revertir desde staging
    - `finally` → limpiar staging dir
  - Implementar `list()` — lee todos los `manifest.json`, ordena desc por timestamp
  - Implementar `delete(backupId)` — `rmSync` recursivo del directorio del backup
  - Implementar `prune(keepLast)` — llama `list()`, slice desde keepLast, delete cada uno
  - Implementar `get(backupId)` — busca manifest.json en el directorio exacto
  - Implementar `latest()` — `list()[0] ?? null`
  - Implementar `totalSize()` — cuenta dirs y suma `totalSize` de cada manifest

## ConfigStore

- [ ] **5.3** Crear `packages/installer/src/backup/config-store.ts`
  - Interface `PedritoConfig` con todos los campos (version, installedAt, lastUpdatedAt, agents, mcp, gga)
  - Class `ConfigStore` con `configPath = ~/.pedrito/config.json`
  - `read(): PedritoConfig | null` — parsea JSON, devuelve null si no existe
  - `write(config)` — stringify con 2-space indent
  - `update(patch)` — deep merge sobre config existente, llama write
  - `recordInstall(agents, preset, components)` — actualiza `agents` map y `lastUpdatedAt`
  - `recordMCPAdd(servers)` — merge en `mcp.servers` sin duplicar
  - `recordGGAConfig(provider, globalHook)` — actualiza `gga`

## Integración con operaciones mutantes

- [ ] **5.4** Verificar/actualizar `packages/installer/src/orchestrator.ts`
  - Confirmar que `runInstall()` llama `backup.create('pre-install', agents)` antes de cualquier `agent.install()`
  - Si `backup.create()` lanza → abortar con error claro, no continuar instalación
  - Añadir flag `skipBackup?: boolean` en `InstallState` (solo para tests internos)
  - Tras instalación exitosa → llamar `configStore.recordInstall(agents, preset, components)`

- [ ] **5.5** Verificar/actualizar `packages/installer/src/main.ts` — comando `mcp add`
  - Confirmar que `pedrito mcp add` llama `backup.create('pre-mcp-add', installedAgents)` antes de escribir configs
  - Tras éxito → `configStore.recordMCPAdd(servers)`

- [ ] **5.6** Verificar/actualizar `packages/installer/src/main.ts` — comando `mcp remove`
  - Backup con label `pre-mcp-remove` antes de modificar configs

## CLI `pedrito backup`

- [ ] **5.7** Añadir subcomando `pedrito backup list` en `main.ts`
  - Leer `BackupManager.list()`
  - Si vacío → `No backups found.`
  - Si hay backups → tabla con columnas: ID (truncado a 24 chars), Label, Agents, Files, Size, Age
  - Usar chalk para cabecera y separador

- [ ] **5.8** Añadir subcomando `pedrito backup restore` en `main.ts`
  - `pedrito backup restore <id>` → llamar `backup.restore(id)`
  - `pedrito backup restore --latest` → `backup.latest()` y restaurar
  - Mostrar progreso: `Restoring <id> (<label>)...` + cada archivo con ✓/✗
  - Mostrar error de rollback si aplica

- [ ] **5.9** Añadir subcomando `pedrito backup delete` en `main.ts`
  - `pedrito backup delete <id>`
  - Sin `--yes`: pedir confirmación mostrando id, label y size
  - Con `--yes`: eliminar directamente
  - Error si el id no existe

- [ ] **5.10** Añadir subcomando `pedrito backup prune` en `main.ts`
  - `pedrito backup prune --keep <n>` (default 5 si no se especifica)
  - Mostrar cuántos backups se eliminan y cuánto espacio se libera
  - Con `--yes`: sin confirmación; sin `--yes`: pedir confirm si hay > 0 a eliminar

## Comando `pedrito doctor` — integración con ConfigStore

- [ ] **5.11** Actualizar `pedrito doctor` en `main.ts`
  - Leer `ConfigStore.read()` para saber qué agentes/componentes están instalados
  - Para cada agente registrado: llamar `agent.verify()` y mostrar resultado
  - Mostrar sección "Last install: <timestamp> (<preset>)"
  - Mostrar sección "Backups: <N> backups, <total size>"

## Tests

- [ ] **5.12** Añadir tests en `packages/installer/src/index.test.ts`
  - Test de `pathToBackupName`: rutas con ~, sin ~, con subdirectorios
  - Test de `formatSize`: 0, 1023, 1024, 1_048_576
  - Test de `formatAge`: timestamps de 1 min, 2h, 3d, 10d atrás
  - Test de `BackupManager.create`: crea directorio, manifest.json, copia archivos
  - Test de `BackupManager.list`: vacío, uno, varios — orden desc
  - Test de `BackupManager.restore` exitoso: archivos restaurados al contenido del backup
  - Test de `BackupManager.restore` con fallo atómico: mock que lanza en archivo N → ningún archivo modificado
  - Test de `BackupManager.prune`: con 5 backups y keepLast=2 → quedan 2
  - Test de `ConfigStore.recordInstall`: crea config.json si no existe, merge si existe
  - Test de `ConfigStore.recordMCPAdd`: no duplica servers

## Build y verificación

- [ ] **5.13** `bun test packages/installer` — todos los tests deben pasar
- [ ] **5.14** `bun run build` en `packages/installer` — binario compila sin errores
- [ ] **5.15** Smoke test: `pedrito install --agents claude-code --preset minimal --non-interactive --yes`
  - Verificar que `~/.pedrito/backups/` tiene un directorio nuevo
  - Verificar que `~/.pedrito/config.json` fue creado/actualizado
- [ ] **5.16** Smoke test restore: modificar `~/.claude/CLAUDE.md`, ejecutar `pedrito backup restore --latest`, verificar que se revirtió
- [ ] **5.17** Test restore atómico manual: simular fallo de permiso en archivo → verificar que no hay archivos a medio restaurar
- [ ] **5.18** Cerrar spec: completar `summary.md`, marcar status Complete

---

## Orden de implementación recomendado

```
5.1 (utils)
  → 5.2 (BackupManager completo)
  → 5.3 (ConfigStore)
  → 5.4–5.6 (integración con orchestrator y mcp commands)
  → 5.7–5.10 (CLI backup subcommands)
  → 5.11 (doctor integración)
  → 5.12 (tests)
  → 5.13–5.18 (build + verificación)
```

**MVP mínimo:** 5.1 + 5.2 + 5.4 — BackupManager funcional integrado con el instalador.
El resto (ConfigStore, CLI, doctor) es incremental sobre esa base.
