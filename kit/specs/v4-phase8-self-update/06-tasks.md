# Phase 8 Tasks — Self-Update & Mantenimiento

## Parte A — Binary Self-Update

- [ ] **8.1** Crear `packages/installer/src/updater/release.ts`
  - Interfaces `ReleaseInfo` y `ReleaseAsset`
  - `getLatestRelease(repo, includePrerelease): Promise<ReleaseInfo>`
    - `fetch('https://api.github.com/repos/<repo>/releases/latest')`
    - Parsear assets → filtrar por nombre de binario + checksum
  - `getRelease(repo, version): Promise<ReleaseInfo>`
    - `fetch('https://api.github.com/repos/<repo>/releases/tags/v<version>')`
  - `currentTarget(): string` — detecta plataforma actual
    - `process.platform` (darwin→macos, linux→linux, win32→windows)
    - `process.arch` (arm64→arm64, x64→x64)
  - Constante `PEDRITO_REPO = 'tu-user/pedrito'` (configurable)

- [ ] **8.2** Crear `packages/installer/src/updater/downloader.ts`
  - Función `downloadBinary(asset, checksumAsset): Promise<DownloadResult>`
  - Crear tempfile en sistema operativo: `os.tmpdir() + '/pedrito-update-' + crypto.randomUUID()`
  - `fetch(asset.downloadUrl)` — streaming a disco con progress en stderr:
    `Downloading pedrito-macos-arm64 (8.2 MB)... X%`
  - `fetch(checksumAsset.downloadUrl)` → parsear SHA256 esperado del formato `<hash>  <filename>`
  - `Bun.CryptoHasher` → calcular SHA256 del archivo descargado
  - Comparar hashes — si difieren: `rmSync(tempPath)` + throw `ChecksumError`

- [ ] **8.3** Crear `packages/installer/src/updater/replacer.ts`
  - Función `replaceBinary(opts: ReplaceOptions): Promise<ReplaceResult>`
  - macOS/Linux: `Bun.which(binaryName)` para localizar path actual
    - Si no encontrado: throw `BinaryNotFoundError` con sugerencia de PATH
    - `chmodSync(tempPath, 0o755)`
    - `renameSync(tempPath, currentPath)` — atómico mismo filesystem
    - Si `EXDEV` (cross-device): fallback a `copyFileSync` + `rmSync(tempPath)`
  - Windows: localizar binario, escribir a `<currentPath>.new.exe`
    - Devolver `{ strategy: 'pending-restart', pendingPath }`
  - Función `applyPendingUpdate(): Promise<boolean>` para startup check en Windows
    - Busca `<process.execPath>.new.exe` → si existe, `cmd /c move /y`

- [ ] **8.4** Crear `packages/installer/src/updater/updater.ts`
  - Interfaces `UpdateOptions` y `UpdateReport`
  - Función `runUpdate(opts): Promise<UpdateReport[]>`
  - Para cada componente en `opts.components`:
    1. `getLatestRelease()` → comparar con versión actual del binario
    2. Si `already-latest` → skip con log
    3. Si `!dryRun && !yes` → confirm prompt
    4. `downloadBinary()` para el asset del target actual
    5. Si componente es `engram`: stop server antes de reemplazar, restart después
    6. `replaceBinary()`
    7. Acumular resultado en `UpdateReport[]`
  - Helper `stopEngram(): Promise<void>` — `fetch('http://localhost:7437/health')`, si corre: `kill` del proceso
  - Helper `startEngram(): Promise<void>` — spawn `pedrito-engram serve` en background

## Parte B — Skills Sync

- [ ] **8.5** Crear `packages/installer/src/updater/skills-sync.ts`
  - Función `resolveKitPath(configStore): string`
    - Intentar `configStore.read()?.kitPath` → si no: `~/.pedrito/kit/` → si no: `PEDRITO_KIT_PATH` env
    - Si ninguno existe: throw `KitNotFoundError` con instrucciones
  - Función `syncSkills(kitPath, configStore, dryRun?): Promise<SkillSyncResult[]>`
    - Para cada agente en `configStore.read().agents`:
      - Obtener directorio de skills del agente (cada Agent impl debe exponer `skillsDir(): string | null`)
      - Listar skills en `kitPath/skills/` (dirs con `SKILL.md`)
      - Listar skills en directorio del agente
      - Comparar por nombre + mtime del SKILL.md
      - En !dryRun: `copyFileSync` para added y updated
      - Acumular resultado
  - Añadir método `skillsDir(): string | null` en `agent.interface.ts` y en cada implementación

- [ ] **8.6** Actualizar `agent.interface.ts` — añadir método opcional `skillsDir(): string | null`
  - `claude-code.ts`: `~/.claude/skills/`
  - `opencode.ts`: `~/.config/opencode/skill/`
  - `cursor.ts`: `~/.cursor/skills/` (si aplica)
  - El resto: `null` (no tienen directorio de skills dedicado)

## Parte C — Config Sync

- [ ] **8.7** Crear `packages/installer/src/sync/sync.ts`
  - Función `runSync(opts: SyncOptions): Promise<void>`
  - `--to <file>`: llamar `exportProfile()` (Fase 6) + `writeFileSync`
  - `--from <file>`: `readFileSync` + `importProfile()` (Fase 6)
  - `--github-gist` (push):
    - `exportProfile()` → JSON string
    - Leer `configStore.read()?.sync?.gistId`
    - Si no hay gistId: `Bun.spawnSync(['gh', 'gist', 'create', '--secret', '--filename', 'pedrito-profile.json', '-'])` stdin=JSON
    - Parsear output → extraer nuevo gistId → `configStore.update({ sync: { gistId, lastSyncAt } })`
    - Si hay gistId: `gh gist edit <id> -f pedrito-profile.json <file>`
  - `--github-gist --pull`:
    - `gh gist view <gistId> --raw` → JSON → `importProfile()`
  - Verificar que `gh` está en PATH — si no: error con instrucciones `gh auth login`

- [ ] **8.8** Actualizar `packages/installer/src/backup/config-store.ts` (Fase 5)
  - Añadir campo `sync?: { gistId?: string; lastSyncAt?: string }` a `PedritoConfig`
  - Añadir campo `kitPath?: string` para que `skills-sync.ts` lo pueda leer
  - Actualizar `recordInstall()` para guardar el `kitPath` usado

## CLI

- [ ] **8.9** Añadir subcomando `pedrito update` en `main.ts`
  - Sin flags: actualizar solo `pedrito`
  - `--skills`: incluir skills sync
  - `--engram`: incluir `pedrito-engram`
  - `--all`: `['pedrito', 'engram', 'gga', 'skills']`
  - `--version <v>`: usar versión específica en lugar de latest
  - `--yes`: skip confirmación
  - `--dry-run`: mostrar qué haría
  - `--include-prerelease`: incluir prereleases en la búsqueda de latest
  - Output formateado: tabla de componentes con versión anterior → nueva + status

- [ ] **8.10** Añadir subcomando `pedrito sync` en `main.ts`
  - `pedrito sync --to <file>`
  - `pedrito sync --from <file>`
  - `pedrito sync --github-gist` (push por defecto)
  - `pedrito sync --github-gist --pull`
  - Mostrar last sync timestamp si está en ConfigStore

- [ ] **8.11** Añadir startup check de pending update en `main.ts` (Windows)
  - Primera llamada en el handler principal: `await applyPendingUpdate()`
  - Solo cuando `process.platform === 'win32'`
  - Si aplica update: imprimir mensaje y exit 0

## Tests

- [ ] **8.12** Añadir tests en `packages/installer/src/index.test.ts`
  - Test de `currentTarget()`: devuelve string válido en el OS del runner
  - Test de `downloadBinary()` con checksum correcto: devuelve `verified: true`
  - Test de `downloadBinary()` con checksum corrupto: lanza `ChecksumError`, no deja archivo
  - Test de `replaceBinary()` macOS/Linux: reemplaza archivo correctamente
  - Test de `replaceBinary()` Windows mock: deja `.new.exe`, no modifica original
  - Test de `applyPendingUpdate()`: sin `.new.exe` → devuelve false
  - Test de `syncSkills()` en dryRun: no escribe archivos, reporta diferencias
  - Test de `syncSkills()` con skills nuevos: copia correctamente
  - Test de `runSync --to` file: genera JSON válido
  - Test de `runSync --from` file: llama `importProfile` con el perfil correcto

## Build y verificación

- [ ] **8.13** `bun test packages/installer` — todos los tests verdes
- [ ] **8.14** `bun run build` en `packages/installer` — compila sin errores
- [ ] **8.15** Smoke test `--dry-run`: `pedrito update --all --dry-run` en macOS — muestra plan sin modificar nada
- [ ] **8.16** Smoke test update real (con tag de test): crear `v4.0.1-test`, hacer release, ejecutar `pedrito update`
- [ ] **8.17** Smoke test skills sync: modificar un skill en `~/.claude/skills/`, ejecutar `pedrito update --skills`, verificar restauración
- [ ] **8.18** Smoke test sync: `pedrito sync --to /tmp/test.json`, verificar JSON válido
- [ ] **8.19** Verificar error descriptivo cuando `gh` no está instalado al usar `--github-gist`
- [ ] **8.20** Cerrar spec: completar `summary.md`, marcar status Complete

---

## Orden de implementación recomendado

```
8.1 (release API)
  → 8.2 (downloader)
  → 8.3 (replacer)
  → 8.4 (updater orquestador)     ← depende de 8.1–8.3
  → 8.5–8.6 (skills sync)         ← independiente de 8.1–8.4
  → 8.8 (ConfigStore update)       ← pre-requisito de 8.7
  → 8.7 (sync)                     ← depende de Fase 6 exporter/importer
  → 8.9–8.11 (CLI)                 ← depende de todos los módulos
  → 8.12 (tests)
  → 8.13–8.20 (build + verificación)
```

**MVP mínimo:** 8.1 + 8.2 + 8.3 + 8.4 + 8.9 — `pedrito update` funcional para binarios.
Skills sync (8.5) y config sync (8.7) son incrementales.
