# Spec Técnica — V4 Phase 5: Backup & Restore

## Package

`@pedrito/installer` — todo el trabajo es en `src/backup/` y `src/main.ts`.

---

## Layout en disco

```
~/.pedrito/
├── backups/
│   ├── 2026-03-21T10:30:00.000Z-pre-install/
│   │   ├── manifest.json
│   │   ├── files/
│   │   │   ├── claude--CLAUDE.md          ← path aplanado con '--' como separador
│   │   │   ├── claude--settings.json
│   │   │   └── opencode--opencode.json
│   └── 2026-03-22T14:00:00.000Z-pre-update/
│       └── ...
└── config.json                             ← estado instalado de Pedrito
```

**Convención de nombres de archivos dentro del backup:**
El path `~/.claude/CLAUDE.md` se guarda como `claude--CLAUDE.md`
(se reemplaza `/` por `--` y se elimina el prefijo del home dir).
Esto evita crear subdirectorios anidados dentro del backup y simplifica el restore.

El `manifest.json` guarda el mapeo completo `source → backup` para que el restore
no dependa de la convención de nombres.

---

## `backup/backup.ts` — Interfaces y clase completa

```typescript
export interface BackupFile {
  source: string;    // path absoluto original: /Users/jose/.claude/CLAUDE.md
  backup: string;    // nombre en el directorio del backup: claude--CLAUDE.md
  size: number;      // bytes
}

export interface BackupManifest {
  id: string;                  // timestamp ISO 8601: "2026-03-21T10:30:00.000Z"
  label: string;               // "pre-install", "pre-update", "pre-mcp-add"
  timestamp: string;           // igual que id — redundante pero legible
  agents: string[];            // ["claude-code", "opencode"]
  files: BackupFile[];
  pedritoVersion: string;      // VERSION del installer al crear el backup
  totalSize: number;           // suma de sizes en bytes
}

export class BackupManager {
  constructor(private backupDir: string = path.join(homedir(), '.pedrito', 'backups')) {}

  // Crear backup de todos los configPaths de los agentes dados
  async create(label: string, agents: Agent[]): Promise<BackupManifest>

  // Restaurar un backup por id — atómico (ver sección restore)
  async restore(backupId: string): Promise<void>

  // Listar todos los backups ordenados por fecha descendente
  async list(): Promise<BackupManifest[]>

  // Eliminar un backup por id
  async delete(backupId: string): Promise<void>

  // Mantener solo los últimos N backups, eliminar el resto
  async prune(keepLast: number): Promise<void>

  // Helpers
  async get(backupId: string): Promise<BackupManifest | null>
  async latest(): Promise<BackupManifest | null>
  totalSize(): Promise<{ backups: number; bytes: number }>
}
```

### `create` — Implementación

```typescript
async create(label: string, agents: Agent[]): Promise<BackupManifest> {
  const id = new Date().toISOString();           // "2026-03-21T10:30:00.000Z"
  const backupPath = path.join(this.backupDir, `${id}-${label}`);
  const filesDir = path.join(backupPath, 'files');

  mkdirSync(filesDir, { recursive: true });

  const files: BackupFile[] = [];
  const agentNames: string[] = [];

  for (const agent of agents) {
    agentNames.push(agent.name());
    for (const configPath of agent.configPaths()) {
      const absPath = expandHome(configPath);  // ~ → homedir
      if (!existsSync(absPath)) continue;      // skip si no existe aún

      const stat = statSync(absPath);
      if (stat.isDirectory()) {
        // Para directorios: backup recursivo de archivos de texto
        await backupDirectory(absPath, filesDir, files);
      } else {
        const backupName = pathToBackupName(absPath);
        copyFileSync(absPath, path.join(filesDir, backupName));
        files.push({ source: absPath, backup: backupName, size: stat.size });
      }
    }
  }

  const manifest: BackupManifest = {
    id, label, timestamp: id,
    agents: agentNames, files,
    pedritoVersion: VERSION,
    totalSize: files.reduce((s, f) => s + f.size, 0),
  };

  writeFileSync(
    path.join(backupPath, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  return manifest;
}
```

**Nota sobre directorios:** `~/.claude/skills/` puede tener muchos archivos.
`backupDirectory` los copia recursivamente, excluyendo binarios y archivos > 1MB.

### `restore` — Implementación atómica

El restore atómico usa un directorio staging temporal:

```typescript
async restore(backupId: string): Promise<void> {
  const manifest = await this.get(backupId);
  if (!manifest) throw new Error(`Backup ${backupId} not found`);

  const backupPath = path.join(this.backupDir, `${backupId}-${manifest.label}`);
  const filesDir = path.join(backupPath, 'files');

  // 1. Staging: crear backup temporal de los archivos ACTUALES antes de restaurar
  //    Si algo falla, revertimos desde staging
  const stagingDir = path.join(this.backupDir, `.staging-${Date.now()}`);
  mkdirSync(stagingDir, { recursive: true });

  const staged: { dest: string; staging: string }[] = [];

  try {
    for (const file of manifest.files) {
      if (existsSync(file.source)) {
        const stagingCopy = path.join(stagingDir, file.backup);
        copyFileSync(file.source, stagingCopy);
        staged.push({ dest: file.source, staging: stagingCopy });
      }
    }

    // 2. Restaurar desde el backup
    for (const file of manifest.files) {
      const backupCopy = path.join(filesDir, file.backup);
      if (!existsSync(backupCopy)) continue;  // archivo no existía al hacer backup → skip
      mkdirSync(path.dirname(file.source), { recursive: true });
      copyFileSync(backupCopy, file.source);
    }

  } catch (err) {
    // 3. Rollback: restaurar desde staging
    for (const { dest, staging } of staged) {
      try { copyFileSync(staging, dest); } catch { /* best effort */ }
    }
    throw new RestoreError(`Restore failed and was rolled back: ${err}`);

  } finally {
    // 4. Limpiar staging
    rmSync(stagingDir, { recursive: true, force: true });
  }
}
```

### `list` — Ordenación y formato

```typescript
async list(): Promise<BackupManifest[]> {
  const entries = readdirSync(this.backupDir, { withFileTypes: true })
    .filter(e => e.isDirectory() && !e.name.startsWith('.'))
    .map(e => {
      const manifestPath = path.join(this.backupDir, e.name, 'manifest.json');
      if (!existsSync(manifestPath)) return null;
      return JSON.parse(readFileSync(manifestPath, 'utf8')) as BackupManifest;
    })
    .filter(Boolean) as BackupManifest[];

  return entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
```

### `prune`

```typescript
async prune(keepLast: number): Promise<void> {
  const all = await this.list(); // ya ordenado desc por fecha
  const toDelete = all.slice(keepLast);
  for (const backup of toDelete) {
    await this.delete(backup.id);
  }
}
```

---

## `backup/config-store.ts` — Estado instalado

```typescript
// ~/.pedrito/config.json
export interface PedritoConfig {
  version: string;               // versión del instalador que escribió este archivo
  installedAt: string;           // ISO timestamp de la primera instalación
  lastUpdatedAt: string;         // ISO timestamp de la última modificación
  agents: {
    [agentName: string]: {
      installedAt: string;
      preset: string;            // "full-pedrito" | "minimal" | etc.
      components: string[];      // ["engram", "gga", "mcp", "skills", "sdd", "persona"]
      configPaths: string[];     // paths que se configuraron
    };
  };
  mcp: {
    servers: string[];           // ["context7", "engram"]
  };
  gga: {
    provider: string;            // "claude"
    globalHook: boolean;
  };
}

export class ConfigStore {
  private configPath: string;

  constructor(pedritoDir = path.join(homedir(), '.pedrito')) {
    this.configPath = path.join(pedritoDir, 'config.json');
  }

  read(): PedritoConfig | null
  write(config: PedritoConfig): void
  update(patch: DeepPartial<PedritoConfig>): void  // merge patch sobre config existente
  recordInstall(agents: Agent[], preset: string, components: string[]): void
  recordMCPAdd(servers: string[]): void
  recordGGAConfig(provider: string, globalHook: boolean): void
}
```

---

## Integración con operaciones existentes

Todas las operaciones mutantes de `pedrito` deben llamar `BackupManager.create()`
antes de modificar cualquier archivo. El label describe la operación:

| Operación | Label del backup |
|---|---|
| `pedrito install` | `pre-install` |
| `pedrito update` | `pre-update` |
| `pedrito mcp add` | `pre-mcp-add` |
| `pedrito mcp remove` | `pre-mcp-remove` |

El `orchestrator.ts` (Fase 3) ya tiene el hook para backup. Fase 5 garantiza que
está correctamente implementado y que `mcp add/remove` también lo respetan.

**Guard en `orchestrator.ts`:**
```typescript
// Si el create() lanza error → abortar la operación
const manifest = await backup.create(label, agents);
// Si el usuario pasa --skip-backup (solo para testing) → omitir
```

---

## CLI `pedrito backup`

### `pedrito backup list`

Output formateado en tabla:
```
ID                           Label         Agents          Files  Size     Age
─────────────────────────────────────────────────────────────────────────────
2026-03-21T10:30:00.000Z    pre-install   claude-code       12   48 KB    2h ago
2026-03-20T09:00:00.000Z    pre-install   claude-code        8   32 KB    1d ago
```

### `pedrito backup restore <id | --latest>`

```
Restoring backup 2026-03-21T10:30:00.000Z (pre-install)...
  ✓ ~/.claude/CLAUDE.md
  ✓ ~/.claude/settings.json
  ✓ ~/.claude.json
Restore complete. 3 files restored.
```

Si falla:
```
Restore failed: could not write ~/.claude/settings.json (permission denied)
Rolling back... done. No files were modified.
```

### `pedrito backup delete <id>`

Pide confirmación antes de eliminar:
```
Delete backup 2026-03-20T09:00:00.000Z (pre-install, 32 KB)? [y/N]
```

Con `--yes` no pide confirmación.

### `pedrito backup prune --keep <n>`

```
Keeping last 5 backups. Deleting 3 older backups...
  ✓ Deleted 2026-03-18T... (pre-install)
  ✓ Deleted 2026-03-17T... (pre-update)
  ✓ Deleted 2026-03-16T... (pre-install)
Freed 96 KB.
```

---

## Helpers en `backup/utils.ts`

```typescript
// Convierte un path absoluto a nombre de archivo plano
// /Users/jose/.claude/CLAUDE.md → claude--CLAUDE.md
export function pathToBackupName(absPath: string): string

// Inverso — reconstruir path desde backup name y manifest source
// (el restore usa manifest.source directamente, esta es solo para debug)
export function backupNameToPath(name: string, homeDir: string): string

// Expandir ~ en paths de configPaths()
export function expandHome(p: string): string

// Backup recursivo de un directorio (solo archivos de texto, < 1MB)
export async function backupDirectory(
  sourceDir: string,
  destDir: string,
  files: BackupFile[]
): Promise<void>

// Formatear tamaño en bytes como string legible
export function formatSize(bytes: number): string  // "48 KB", "1.2 MB"

// Formatear timestamp como "2h ago", "3d ago"
export function formatAge(isoTimestamp: string): string
```

---

## Decisiones de Diseño

### ¿Por qué staging para restore atómico en lugar de transacciones DB?
Los backups son archivos del sistema (no en SQLite). La única forma de hacer restore
atómico en el filesystem es copiar los archivos actuales a staging, intentar el restore,
y revertir desde staging si algo falla. Es el patrón estándar para operaciones
de filesystem que deben ser atómicas.

### ¿Por qué `id = timestamp ISO` y no UUID?
El timestamp hace que los backups estén ordenados lexicográficamente por fecha,
facilita el debug visual ("¿qué pasó a las 10:30?") y el `prune` no necesita
parsear fechas — el sort string es suficiente. Los UUIDs serían opacos.

### ¿Por qué no guardar la DB de Engram en los backups?
La DB de Engram puede pesar cientos de MB. Copiarla en cada install sería
prohibitivo. Engram tiene su propia lógica de migración. El symlink
`~/.pedrito/engram.db` es solo una referencia visual para el usuario.

### ¿Por qué `config.json` en Fase 5 y no en Fase 3?
Fase 3 necesitaba el backup mínimo para no romper entornos. El `config.json`
es más sobre observabilidad del estado instalado — `pedrito doctor` lo usa para
saber qué mostrar. No era bloqueante para Fase 3 pero sí para Fase 6 (profiles).

---

## Criterios de Verificación

| # | Check | Cómo verificar |
|---|---|---|
| 1 | `create` genera directorio con manifest.json y archivos copiados | Verificar `~/.pedrito/backups/` después de install |
| 2 | `restore --latest` restaura todos los archivos del manifest | Modificar un archivo, restore, verificar contenido original |
| 3 | Restore atómico: forzar error a mitad → ningún archivo modificado | Test con mock que lanza en el 2º archivo |
| 4 | `pedrito backup list` muestra tabla formateada | Ejecutar con 2+ backups existentes |
| 5 | `prune --keep 2` deja exactamente 2 backups | Crear 5, prune, contar directorios |
| 6 | `config.json` se actualiza tras `pedrito install` | Verificar `~/.pedrito/config.json` |
| 7 | `pedrito install` sin backup previo crea uno antes de modificar | Spy en BackupManager.create |
| 8 | `bun test` verde — todos los casos de backup | `bun test packages/installer` |
