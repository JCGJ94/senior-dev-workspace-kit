# Spec Técnica — V4 Phase 6: Team Sharing & Perfiles

## Package

`@pedrito/installer` — todo el trabajo es en `src/profiles/` y `src/main.ts`.

---

## Formato del Perfil — `PedritoProfile`

```typescript
// src/profiles/profile.schema.ts

import { z } from 'zod';

export const ProfileSkillsSchema = z.object({
  categories: z.array(z.string()).default([]),    // ["frontend", "typescript"]
  custom: z.array(z.string()).default([]),         // nombres de skills extra
});

export const ProfileMCPSchema = z.object({
  servers: z.array(z.string()),                   // ["context7", "notion"]
  // Tokens de P1 servers: null en export (usuario los configura al importar)
  tokens: z.record(z.string(), z.string().nullable()).default({}),
});

export const ProfilePermissionsSchema = z.object({
  denyPaths: z.array(z.string()).default([]),
  requireConfirmation: z.array(z.string()).default([]),
});

export const ProfileGGASchema = z.object({
  provider: z.string(),          // "claude" | "ollama:llama3" | etc.
  globalHook: z.boolean().default(false),
});

export const PedritoProfileSchema = z.object({
  version: z.string(),            // "4.0" — compatibilidad semántica
  name: z.string(),
  description: z.string().default(''),
  agents: z.array(z.string()),    // ["claude-code", "opencode"]
  preset: z.string(),             // "full-pedrito" | "minimal" | "custom"
  skills: ProfileSkillsSchema,
  mcp: ProfileMCPSchema,
  persona: z.string().nullable().default(null),    // "pedrito-mode" | null
  theme: z.string().nullable().default(null),
  permissions: ProfilePermissionsSchema.optional(),
  gga: ProfileGGASchema.optional(),
});

export type PedritoProfile = z.infer<typeof PedritoProfileSchema>;
```

**Ejemplo de archivo exportado:**

```json
{
  "version": "4.0",
  "name": "Full Stack Team Profile",
  "description": "Configuración estándar del equipo",
  "agents": ["claude-code", "opencode"],
  "preset": "full-pedrito",
  "skills": {
    "categories": ["frontend", "typescript", "testing"],
    "custom": []
  },
  "mcp": {
    "servers": ["context7", "engram", "notion"],
    "tokens": {
      "notion": null
    }
  },
  "persona": "pedrito-mode",
  "theme": "pedrito-dark",
  "permissions": {
    "denyPaths": [".env", ".env.*", "**/secrets/**"],
    "requireConfirmation": ["git push", "git reset --hard", "rm -rf"]
  },
  "gga": {
    "provider": "claude",
    "globalHook": true
  }
}
```

---

## Módulos

### `profiles/profile.schema.ts`

El schema Zod. Además del schema principal, incluye:

```typescript
// Versión del perfil que puede importar este installer
const SUPPORTED_PROFILE_VERSION_MAJOR = '4';

export function validateProfile(raw: unknown): PedritoProfile {
  const parsed = PedritoProfileSchema.parse(raw);  // lanza ZodError si inválido
  const major = parsed.version.split('.')[0];
  if (major !== SUPPORTED_PROFILE_VERSION_MAJOR) {
    throw new ProfileVersionError(
      `Profile version ${parsed.version} requires a newer installer. ` +
      `Run: pedrito update`
    );
  }
  return parsed;
}
```

### `profiles/exporter.ts`

Lee `ConfigStore` y genera un `PedritoProfile`:

```typescript
export async function exportProfile(
  name: string,
  description: string,
  configStore: ConfigStore,
): Promise<PedritoProfile>
```

**Lógica de export:**
1. Leer `ConfigStore.read()` — si null, lanzar `NotInstalledError`
2. Construir `agents` desde `config.agents` keys
3. Inferir `preset` desde `config.agents[0].preset` (todos deben tener el mismo)
4. Construir `skills` desde el catálogo + lo instalado
5. Construir `mcp.servers` desde `config.mcp.servers`
6. **Sanitizar tokens:** para cada P1 server en `mcp.servers` que requiera token → poner `null`
7. Leer `gga` desde `config.gga`
8. `persona`, `theme`, `permissions` — valores hardcoded del preset o null

**Sanitización de tokens (crítico):**
```typescript
function sanitizeTokens(servers: string[]): Record<string, null> {
  const P1_SERVERS_REQUIRING_TOKEN = ['notion', 'jira'];
  return Object.fromEntries(
    servers
      .filter(s => P1_SERVERS_REQUIRING_TOKEN.includes(s))
      .map(s => [s, null])
  );
}
```

### `profiles/importer.ts`

Toma un `PedritoProfile` y ejecuta la instalación:

```typescript
export async function importProfile(
  profile: PedritoProfile,
  opts: ImportOptions,
): Promise<void>

interface ImportOptions {
  resolvedTokens?: Record<string, string>;  // tokens que el usuario proveyó
  dryRun?: boolean;
  nonInteractive?: boolean;
  yes?: boolean;
}
```

**Flujo de import:**

```
1. Validar perfil (validateProfile)
2. Detectar tokens faltantes (mcp.tokens con null value)
3. Si hay tokens null y !nonInteractive → prompt interactivo por cada uno
4. Si hay tokens null y nonInteractive → warning + skip esos servers
5. Construir InstallState desde el perfil:
   - selectedAgents: resolver strings a Agent instances
   - preset: resolver string a PresetConfig (o construir custom desde campos)
6. Llamar orchestrator.runInstall(state)
   - Esto crea backup (Fase 5) antes de modificar nada
7. Si mcp.tokens tiene valores → llamar configureMCPForAgent con esos tokens
8. Si gga → escribir .gga config
```

**Resolución de agentes desconocidos:**
Si el perfil menciona un agente no instalado en el sistema (ej. `opencode` no detectado),
mostrar warning y continuar con los que sí están disponibles.

### `profiles/fetcher.ts`

Para import desde URL:

```typescript
export async function fetchProfile(url: string): Promise<PedritoProfile>
```

```typescript
async function fetchProfile(url: string): Promise<PedritoProfile> {
  // Solo HTTPS
  if (!url.startsWith('https://')) {
    throw new Error('Profile URL must use HTTPS');
  }

  const res = await fetch(url, {
    signal: AbortSignal.timeout(10_000),   // 10s timeout
    headers: { 'User-Agent': `pedrito/${VERSION}` },
  });

  if (!res.ok) throw new FetchError(url, res.status);

  const raw = await res.json();
  return validateProfile(raw);
}
```

**URLs soportadas de forma especial:**
- `https://github.com/<user>/<repo>/blob/<branch>/pedrito-profile.json`
  → auto-convertir a `https://raw.githubusercontent.com/...`

### `profiles/store.ts` — Store local

Directorio `~/.pedrito/profiles/` para perfiles guardados:

```typescript
export class ProfileStore {
  private dir: string;  // ~/.pedrito/profiles/

  // Guardar un perfil bajo un nombre local
  async save(name: string, profile: PedritoProfile): Promise<void>
  // name → ~/.pedrito/profiles/<name>.json

  // Leer un perfil por nombre
  async get(name: string): Promise<PedritoProfile | null>

  // Listar todos los perfiles guardados
  async list(): Promise<{ name: string; profile: PedritoProfile }[]>

  // Eliminar un perfil guardado
  async delete(name: string): Promise<void>
}
```

---

## CLI `pedrito profile`

### `pedrito profile export`

```
pedrito profile export [--output <file>] [--name <name>] [--description <desc>]
```

- Sin `--output`: imprime JSON a stdout (compatible con pipes)
- Con `--output team.json`: escribe al archivo
- `--name` (default: nombre del proyecto en `config.json` o `"My Pedrito Profile"`)
- Tras exportar, preguntar si quiere guardarlo en el store local:
  ```
  Profile exported to team.json
  Save to local profiles? [y/N]
  ```

### `pedrito profile import`

```
pedrito profile import <file | url> [--yes] [--dry-run] [--non-interactive]
```

Flujo en terminal:
```
Importing profile "Full Stack Team Profile"...

Agents:     claude-code, opencode
Preset:     full-pedrito
Skills:     all (32 skills)
MCP:        context7, engram, notion ⚠ token required
GGA:        claude

Missing tokens:
  notion API token: _______________

[Import]  [Cancel]
```

Con `--non-interactive --yes`: skip tokens null, advertir al final.

### `pedrito profile list`

```
Saved profiles (~/.pedrito/profiles/)
────────────────────────────────────────────────────────
NAME                  AGENTS              PRESET          SAVED
team-fullstack         claude-code         full-pedrito    2026-03-21
minimal-setup          claude-code         minimal         2026-03-20
```

### `pedrito profile save <name>`

Guarda el perfil actual (desde ConfigStore) en el store local bajo un nombre.
Shorthand de `export + store.save`.

### `pedrito profile delete <name>`

Elimina del store local.

### `pedrito profile show <name | file>`

Muestra el contenido de un perfil guardado o un archivo, formateado.

### Subcomandos stub (registry — Fase 7+)

```
pedrito profile publish <file>    → "Registry coming soon. Stay tuned."
pedrito profile search <query>    → "Registry coming soon. Stay tuned."
pedrito profile install <handle>  → "Registry coming soon. Stay tuned."
```

---

## Estructura de archivos

```
packages/installer/src/
├── profiles/
│   ├── profile.schema.ts     ← Zod schema + validateProfile
│   ├── exporter.ts           ← ConfigStore → PedritoProfile
│   ├── importer.ts           ← PedritoProfile → orchestrator.runInstall
│   ├── fetcher.ts            ← fetch URL → PedritoProfile
│   └── store.ts              ← ~/.pedrito/profiles/ CRUD
└── main.ts                   ← añadir subcomando `pedrito profile`
```

---

## Compatibilidad de versiones

| Perfil `version` | Installer V4 | Acción |
|---|---|---|
| `4.x` | ✓ compatible | Importar sin cambios |
| `3.x` | Upgrade parcial | Warning + migrar campos conocidos |
| `5.x` | ✗ incompatible | Error: "Upgrade installer first" |

Migración desde `3.x`: solo si en el futuro hay perfiles V3 en circulación.
Para esta fase, solo soportar `4.x` plenamente.

---

## Decisiones de Diseño

### ¿Por qué tokens `null` en lugar de omitir la clave?
`null` es explícito: "este server necesita token, el usuario debe configurarlo".
Si omitimos la clave, el importador no sabe si el server requiere token o si fue un
error de exportación. `null` es un señal clara de "pendiente de configurar".

### ¿Por qué el import usa `orchestrator.runInstall()` en lugar de código propio?
Reutilizar el orquestador garantiza que el import es idéntico a un install normal:
backup previo, verify por agente, ConfigStore actualizado. No se duplica lógica crítica.

### ¿Por qué store local en `~/.pedrito/profiles/` y no en `config.json`?
Los perfiles pueden ser grandes (skills, permissions, etc.) y son entidades independientes.
Mezclarlos en `config.json` lo haría unwieldy. El store es un directorio de archivos JSON,
simple y debuggeable.

### ¿Por qué los subcomandos de registry son stubs?
El registry (GitHub-backed o API propia) es infraestructura no-trivial que bloquearía
el release de Fase 6. Los stubs evitan broken UX ("pedrito profile publish" → command not found)
y reservan el espacio en la CLI para Fase 7+.

### GitHub URL conversion
`github.com/.../blob/...` → `raw.githubusercontent.com/...` es el pattern más común.
Sin esta conversión, el 80% de los usuarios copiaría la URL del browser y fallaría.

---

## Criterios de Verificación

| # | Check | Cómo verificar |
|---|---|---|
| 1 | Export produce JSON válido con schema Zod | `pedrito profile export \| jq .` |
| 2 | Tokens P1 son `null` en el export | Verificar campo `mcp.tokens` en JSON |
| 3 | Import desde archivo instala agentes correctos | `pedrito doctor` tras import |
| 4 | Import desde URL HTTPS funciona | Usar GitHub raw URL de un perfil de test |
| 5 | Import con URL HTTP lanza error | `pedrito profile import http://...` |
| 6 | Token prompting aparece para servers con `null` | Import perfil con notion en `mcp.servers` |
| 7 | `pedrito profile list` muestra perfiles en `~/.pedrito/profiles/` | Guardar uno, listar |
| 8 | Perfiles incompatibles (versión 5.x) dan error claro | Test con schema forzado |
| 9 | `pedrito profile publish` muestra "coming soon" sin error | Ejecutar en terminal |
| 10 | `bun test` verde — schema, export, import, store | `bun test packages/installer` |
