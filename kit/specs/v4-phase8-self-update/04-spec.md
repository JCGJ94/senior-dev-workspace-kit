# Spec Técnica — V4 Phase 8: Self-Update & Mantenimiento

## Package

`@pedrito/installer` — nuevos módulos en `src/updater/` y `src/sync/`.

---

## Módulos

```
packages/installer/src/
├── updater/
│   ├── release.ts        ← Consulta GitHub Releases API
│   ├── downloader.ts     ← Descarga binario + verifica checksum
│   ├── replacer.ts       ← Reemplazo atómico del binario en disco
│   ├── skills-sync.ts    ← Sincroniza skills del kit a agentes
│   └── updater.ts        ← Orquestador: binarios + skills + engram
└── sync/
    └── sync.ts           ← pedrito sync (archivo + GitHub Gist)
```

---

## Parte A — Binary Self-Update

### `updater/release.ts` — GitHub Releases API

```typescript
interface ReleaseInfo {
  version: string;          // "4.1.0"
  tag: string;              // "v4.1.0"
  publishedAt: string;      // ISO timestamp
  isPrerelease: boolean;
  assets: ReleaseAsset[];
}

interface ReleaseAsset {
  name: string;             // "pedrito-macos-arm64"
  downloadUrl: string;
  size: number;
}

// Consulta la GitHub Releases API
async function getLatestRelease(repo: string, includePrerelease: boolean): Promise<ReleaseInfo>
async function getRelease(repo: string, version: string): Promise<ReleaseInfo>

// Detecta el target de la plataforma actual
function currentTarget(): string
// Ej: "macos-arm64" | "macos-x64" | "linux-x64" | "windows-x64"
// Usa process.platform + process.arch
```

### `updater/downloader.ts` — Descarga + Checksum

```typescript
interface DownloadResult {
  tempPath: string;    // path del binario descargado en /tmp
  verified: boolean;   // checksum OK
}

async function downloadBinary(
  asset: ReleaseAsset,
  checksumAsset: ReleaseAsset,
): Promise<DownloadResult>
```

Flujo:
1. `fetch(asset.downloadUrl)` con progress logging a stderr
2. Escribir a `tmpfile = /tmp/pedrito-update-<random>`
3. `fetch(checksumAsset.downloadUrl)` → leer SHA256 esperado
4. Calcular SHA256 del tmpfile con `Bun.CryptoHasher`
5. Comparar — si no coincide: eliminar tmpfile, lanzar `ChecksumError`
6. Devolver `{ tempPath, verified: true }`

### `updater/replacer.ts` — Reemplazo atómico

```typescript
interface ReplaceOptions {
  binaryName: string;    // "pedrito" | "pedrito-engram" | "gga"
  tempPath: string;      // path del binario descargado
}

interface ReplaceResult {
  strategy: 'atomic' | 'pending-restart';
  installedPath?: string;
  pendingPath?: string;
}

async function replaceBinary(opts: ReplaceOptions): Promise<ReplaceResult>
```

**Estrategia por plataforma:**

**macOS / Linux (atómico):**
```typescript
// Localizar binario actual
const currentPath = Bun.which(opts.binaryName);
if (!currentPath) throw new Error(`${opts.binaryName} not found in PATH`);

// chmod +x al nuevo binario
chmodSync(opts.tempPath, 0o755);

// mv atómico — funciona aunque el proceso esté corriendo
// (en Unix, mv reemplaza el inode; el proceso en memoria sigue funcionando)
renameSync(opts.tempPath, currentPath);

return { strategy: 'atomic', installedPath: currentPath };
```

**Windows (pending-restart):**
```typescript
// En Windows, no se puede reemplazar un .exe en ejecución
// Estrategia: guardar el nuevo binario como pedrito.new.exe
// Al próximo inicio, pedrito detecta el .new y se auto-reemplaza

const currentPath = Bun.which(opts.binaryName) ??
  join(process.env['LOCALAPPDATA']!, 'pedrito', 'bin', `${opts.binaryName}.exe`);
const pendingPath = currentPath.replace(/\.exe$/, '.new.exe');

renameSync(opts.tempPath, pendingPath);
return { strategy: 'pending-restart', pendingPath };
```

**Startup check en Windows (`main.ts`):**
```typescript
// Al arrancar, verificar si hay un .new.exe pendiente
async function applyPendingUpdate(): Promise<boolean> {
  if (process.platform !== 'win32') return false;
  const currentExe = process.execPath;
  const pendingExe = currentExe.replace(/\.exe$/, '.new.exe');
  if (!existsSync(pendingExe)) return false;

  // Usar cmd /c move para reemplazar desde un proceso externo
  Bun.spawnSync(['cmd', '/c', `move /y "${pendingExe}" "${currentExe}"`]);
  console.log('Update applied. Please restart pedrito.');
  return true;
}
```

### `updater/updater.ts` — Orquestador

```typescript
interface UpdateOptions {
  components: ('pedrito' | 'engram' | 'gga' | 'skills')[];
  version?: string;          // default: "latest"
  includePrerelease?: boolean;
  dryRun?: boolean;
  yes?: boolean;
}

interface UpdateReport {
  component: string;
  previousVersion: string;
  newVersion: string;
  status: 'updated' | 'already-latest' | 'skipped' | 'error';
  error?: string;
}

async function runUpdate(opts: UpdateOptions): Promise<UpdateReport[]>
```

Flujo por componente binario (pedrito, engram, gga):
1. `getLatestRelease()` → obtener `newVersion`
2. Comparar con `VERSION` actual del binario — si igual → `already-latest`, skip
3. Si `!dryRun && !yes` → confirmar con el usuario: `Update pedrito v4.0.0 → v4.1.0? [Y/n]`
4. `downloadBinary()` para el asset del target actual
5. Si Engram está corriendo → `pedrito-engram stop` antes de reemplazar
6. `replaceBinary()` → atomic o pending-restart
7. Si Engram estaba corriendo → `pedrito-engram serve` en background
8. Actualizar `ConfigStore` con nueva versión

---

## Parte B — Skills Sync

### `updater/skills-sync.ts`

```typescript
interface SkillSyncResult {
  agent: string;
  added: string[];
  updated: string[];
  removed: string[];
}

async function syncSkills(
  kitPath: string,
  configStore: ConfigStore,
  dryRun?: boolean,
): Promise<SkillSyncResult[]>
```

Flujo:
1. Leer `configStore.read()` → obtener agentes instalados y sus `configPaths`
2. Para cada agente, localizar su directorio de skills (ej. `~/.claude/skills/`)
3. Leer skills del kit en `kitPath/skills/` → obtener lista canónica
4. Comparar con skills en el directorio del agente:
   - **Added**: skill en kit pero no en agente → copiar
   - **Updated**: skill en ambos, pero el del kit tiene fecha más reciente → copiar
   - **Removed**: skill en agente pero no en kit → skip (no eliminar skills del usuario)
5. En `dryRun`: solo reportar diferencias sin escribir

**¿Cómo determinar `kitPath` en runtime?**
```typescript
// 1. ConfigStore puede registrar el kitPath al instalar (añadir campo en Fase 5/6)
// 2. Fallback: ~/.pedrito/kit/ (donde pedrito install coloca el kit)
// 3. Fallback 2: usar la variable de entorno PEDRITO_KIT_PATH
function resolveKitPath(configStore: ConfigStore): string
```

---

## Parte C — `pedrito sync`

### `sync/sync.ts`

```typescript
interface SyncOptions {
  direction: 'to' | 'from';
  target: string;              // path de archivo o "gist"
  gistId?: string;             // si target es "gist", ID del gist existente
  yes?: boolean;
}

async function runSync(opts: SyncOptions): Promise<void>
```

**`pedrito sync --to <file>`:**
Alias de `pedrito profile export --output <file>`. Usa el exporter de Fase 6.

**`pedrito sync --from <file>`:**
Alias de `pedrito profile import <file>`. Usa el importer de Fase 6.

**`pedrito sync --github-gist`:**
```typescript
// Requiere gh CLI autenticado
async function syncViaGist(direction: 'push' | 'pull', gistId?: string): Promise<void> {
  // push: exportar perfil, crear/actualizar Gist privado
  //   Si no hay gistId: gh gist create --secret --filename pedrito-profile.json
  //   Si hay gistId:    gh gist edit <id> -f pedrito-profile.json
  //   Guardar el gistId en ConfigStore para próximas sincronizaciones

  // pull: obtener Gist, importar perfil
  //   gh gist view <id> --raw → JSON → importProfile()
}
```

El `gistId` se persiste en `ConfigStore`:
```typescript
// Añadir campo en PedritoConfig (Fase 5):
sync?: {
  gistId?: string;
  lastSyncAt?: string;
}
```

---

## CLI — Nuevos subcomandos en `main.ts`

### `pedrito update`

```bash
pedrito update [--skills] [--engram] [--all] [--version <v>] [--yes] [--dry-run]
```

Sin flags: actualiza solo el binario `pedrito`.
```
Checking for updates...
  pedrito:        v4.0.0 → v4.1.0 ✓ Update available
  pedrito-engram: v4.0.0 (latest)
  gga:            v4.0.0 (latest)

Update pedrito to v4.1.0? [Y/n]
Downloading pedrito-macos-arm64 (8.2 MB)... ████████████ 100%
Verifying checksum... ✓
Installing... ✓

pedrito updated to v4.1.0
```

Con `--all`:
```
Updating all components...
  ✓ pedrito        v4.0.0 → v4.1.0
  ✓ pedrito-engram v4.0.0 → v4.1.0
  ✓ gga            v4.0.0 → v4.1.0
  ✓ skills         12 updated, 3 added

All components up to date.
```

### `pedrito sync`

```bash
pedrito sync --to <file>           # Exportar config a archivo
pedrito sync --from <file>         # Importar config desde archivo
pedrito sync --github-gist         # Push config a Gist privado
pedrito sync --github-gist --pull  # Pull config desde Gist
```

---

## Startup check (Windows pending update)

En `main.ts`, primera línea del handler principal:

```typescript
// Solo en Windows — verificar si hay un update pendiente de aplicar
if (process.platform === 'win32') {
  const applied = await applyPendingUpdate();
  if (applied) process.exit(0);  // reiniciar para usar el nuevo binario
}
```

---

## Decisiones de Diseño

### ¿Por qué `mv` atómico y no copiar + reemplazar?
`renameSync` en Unix es atómico a nivel de syscall si origen y destino están en el mismo
filesystem. Copiar + borrar no es atómico: hay una ventana donde el binario podría estar
corrupto. Para `/usr/local/bin` → `/tmp` pueden ser filesystems distintos — en ese caso
usar `cp` + `chmod` como fallback.

### ¿Por qué no usar un "updater helper" en Windows?
Un updater helper separado (un proceso que reemplaza el binario principal y lo reinicia)
es la solución profesional pero añade complejidad considerable: necesita ser un segundo
binario distribuido, firmado, y gestionado. El patrón `.new.exe` + startup check es
suficientemente robusto para V4 y evita distribuir un cuarto binario.

### ¿Por qué `pedrito sync` es un alias de profile export/import?
Porque es exactamente eso. No tiene sentido duplicar la lógica. El naming es más
intuitivo para el caso de uso de sincronización entre máquinas, pero la implementación
es la misma. El GitHub Gist agrega solo el transport layer.

### ¿Por qué no eliminar skills en `syncSkills`?
El usuario puede tener skills personalizados en el directorio del agente que no están
en el kit. Eliminarlos automáticamente sería destructivo. Solo se añaden y actualizan.

### Sobre la versión actual del binario en runtime
Para comparar versiones, cada binario expone `VERSION` (quemado en build time, Fase 7).
`getLatestRelease()` devuelve la versión del último GitHub Release. La comparación es
semver simple: si `latestVersion !== currentVersion` → hay update disponible.

---

## Criterios de Verificación

| # | Check | Cómo verificar |
|---|---|---|
| 1 | `getLatestRelease()` devuelve versión correcta | Test con mock del API o llamada real |
| 2 | Checksum incorrecto → `ChecksumError`, binario no reemplazado | Test con checksum corrupto |
| 3 | `pedrito update` reemplaza binario en macOS atómicamente | `which pedrito; pedrito update; pedrito version` |
| 4 | `pedrito update --dry-run` no modifica nada | Verificar que mtime del binario no cambia |
| 5 | `pedrito update --skills` actualiza archivos en `~/.claude/skills/` | Modificar un skill local, update, verificar que vuelve al original |
| 6 | `pedrito update --all` en macOS pasa todos los pasos | Log de salida completo |
| 7 | Windows: update deja `pedrito.new.exe`, al reiniciar se aplica | Test manual en Windows |
| 8 | `pedrito sync --to profile.json` genera JSON válido | `pedrito sync --to /tmp/p.json && jq . /tmp/p.json` |
| 9 | `pedrito sync --github-gist` requiere `gh auth` | Ejecutar sin auth → error descriptivo |
| 10 | `bun test` verde | `bun test packages/installer` |
