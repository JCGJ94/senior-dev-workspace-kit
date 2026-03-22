# Spec Técnica — V4 Phase 2: GGA Guardian Angel

## Stack

- **Runtime:** Bun (TypeScript, ESM)
- **CLI:** Commander.js (`commander`)
- **Configuración:** TOML via `smol-toml` (ligero, sin deps nativas)
- **SHA256:** `Bun.CryptoHasher` (built-in)
- **Output:** `chalk` para colores en terminal
- **Build:** `bun build --compile` → binario `gga`

---

## Arquitectura del flujo

```
git commit
    │
    ▼
.git/hooks/pre-commit  ←── instalado por `gga install`
    │  #!/usr/bin/env bash
    │  gga run || exit 1
    │
    ▼
gga run
    ├── 1. git diff --cached → lista de archivos staged
    ├── 2. Para cada archivo:
    │       a. Calcular SHA256 del contenido
    │       b. Buscar en ~/.cache/gga/<project>/<sha256>.json
    │       c. Si PASSED y SHA coincide → skip ✓
    │       d. Si no → añadir a review_queue
    ├── 3. Si review_queue vacío → exit 0 (todo cacheado)
    ├── 4. Leer AGENTS.md (o CLAUDE.md fallback)
    ├── 5. Construir prompt con archivos + reglas
    ├── 6. Enviar a provider configurado
    ├── 7. Parsear respuesta: PASSED / FAILED + feedback
    ├── 8. Si PASSED → actualizar caché, exit 0
    └── 9. Si FAILED → mostrar feedback, exit 1 (bloquea commit)
```

---

## Estructura de Archivos

```
packages/gga/
├── src/
│   ├── main.ts                      ← CLI entrypoint (commander)
│   ├── hook.ts                      ← Orquestador del review (paso 1-9 arriba)
│   ├── staged.ts                    ← Obtiene archivos staged (git diff --cached)
│   ├── review.ts                    ← Construcción del prompt + parseo de respuesta
│   ├── rules.ts                     ← Parser de AGENTS.md / CLAUDE.md
│   ├── cache.ts                     ← SHA256 cache (read/write/clear)
│   ├── config.ts                    ← Lectura de .gga / ~/.config/gga/config (TOML)
│   ├── providers/
│   │   ├── provider.interface.ts    ← Interface común
│   │   ├── claude.ts                ← claude --print "..."
│   │   ├── ollama.ts                ← REST API localhost:11434
│   │   ├── gemini.ts                ← gemini -p "..."
│   │   ├── opencode.ts              ← opencode run "..."
│   │   ├── lmstudio.ts              ← OpenAI-compatible API
│   │   └── github.ts                ← Azure/GitHub Models via gh auth token
│   └── index.ts                     ← VERSION export
├── scripts/
│   └── hook-template.sh             ← Template del pre-commit hook
├── src/
│   └── index.test.ts                ← Tests
├── package.json
└── tsconfig.json
```

---

## Módulos — Detalle

### `config.ts`

Busca configuración en orden:
1. `.gga` en la raíz del proyecto (cwd)
2. `~/.config/gga/config`
3. Valores por defecto

```typescript
interface GGAConfig {
  provider: string;        // "claude" | "ollama:llama3" | "gemini" | etc.
  timeout: number;         // segundos, default: 120
  cache_dir: string;       // default: "~/.cache/gga"
  rules_file: string;      // default: "AGENTS.md"
  fail_open: boolean;      // default: false — si true, no bloquea si provider falla
  max_file_size: number;   // bytes, default: 50000 — archivos más grandes se truncan
  exclude: string[];       // patrones glob a excluir del review (ej. "*.lock", "dist/**")
}
```

Formato TOML del archivo `.gga`:
```toml
provider = "claude"
timeout = 120
fail_open = false
exclude = ["*.lock", "dist/**", "*.min.js"]
```

### `staged.ts`

```typescript
interface StagedFile {
  path: string;
  content: string;     // contenido completo (truncado si > max_file_size)
  sha256: string;      // hash del contenido completo (sin truncar)
  status: 'A' | 'M' | 'D' | 'R';  // Added, Modified, Deleted, Renamed
}

function getStagedFiles(config: GGAConfig): Promise<StagedFile[]>
// Usa: git diff --cached --name-status + git show :path
// Filtra: archivos eliminados (D), binarios, patrones en config.exclude
```

### `cache.ts`

Layout en disco: `~/.cache/gga/<project-name>/<sha256>.json`

```typescript
interface CacheEntry {
  sha256: string;
  result: 'PASSED' | 'FAILED';
  timestamp: number;
  provider: string;
}

function checkCache(cacheDir: string, project: string, sha256: string): CacheEntry | null
function writeCache(cacheDir: string, project: string, entry: CacheEntry): void
function clearCache(cacheDir: string, project?: string): void
function getCacheStats(cacheDir: string): { projects: number; entries: number; size_bytes: number }
```

### `rules.ts`

Extrae reglas de `AGENTS.md` (o `CLAUDE.md`). El parser:
1. Extrae secciones marcadas con headers de nivel 2+ que contengan keywords: `rules`, `standards`, `conventions`, `guidelines`, `code review`, `requirements`
2. Si no encuentra secciones específicas, usa el documento completo (truncado a 4000 chars)
3. Si el archivo no existe, devuelve un string con reglas genéricas de calidad

```typescript
function extractRules(rulesFile: string, cwd: string): string
// Returns: string con las reglas relevantes para incluir en el prompt
```

### `review.ts`

Construye el prompt y parsea la respuesta:

```typescript
interface ReviewResult {
  verdict: 'PASSED' | 'FAILED' | 'ERROR';
  feedback: string;     // Feedback formateado para mostrar al usuario
  issues: ReviewIssue[];
}

interface ReviewIssue {
  file: string;
  severity: 'error' | 'warning';
  message: string;
  line?: number;
}

function buildPrompt(files: StagedFile[], rules: string): string
function parseResponse(raw: string): ReviewResult
```

**Formato del prompt:**
```
You are a code reviewer. Review the following staged changes against the project standards.

## Project Standards
<rules>

## Staged Files
### <filename>
```<ext>
<content>
```

## Instructions
- Review each file against the standards above
- Respond with exactly one of:
  VERDICT: PASSED
  VERDICT: FAILED

- If FAILED, list issues in this format:
  ISSUE: <filename> | <severity: error|warning> | <message>

- Keep feedback concise and actionable.
```

**Criterio de parseo:** La respuesta es PASSED solo si contiene `VERDICT: PASSED` y no contiene `VERDICT: FAILED`. Cualquier error de parseo → `ERROR` (respeta `fail_open`).

### `providers/provider.interface.ts`

```typescript
export interface AIProvider {
  name: string;
  call(prompt: string, timeout: number): Promise<string>;
}
```

### Providers — Implementaciones

| Provider | Mecanismo | Notas |
|---|---|---|
| `claude` | `Bun.spawnSync(['claude', '--print', prompt])` | Requiere claude CLI instalado |
| `ollama:<model>` | `fetch('http://localhost:11434/api/generate', {method:'POST',...})` | Modelo configurable: `ollama:llama3.2` |
| `gemini` | `Bun.spawnSync(['gemini', '-p', prompt])` | Requiere gemini CLI |
| `opencode` | `Bun.spawnSync(['opencode', 'run', prompt])` | Requiere opencode CLI |
| `lmstudio` | `fetch('http://localhost:1234/v1/chat/completions', ...)` | OpenAI-compatible |
| `github:<model>` | `fetch('https://models.inference.ai.azure.com/...', {headers: {Authorization: 'Bearer ' + ghToken}})` | Token via `gh auth token` |

### `hook.ts` — Orquestador

```typescript
export async function runHook(opts: { prMode?: boolean; ci?: boolean }): Promise<void>
```

Flujo completo con output a stderr (para que no interfiera con git):
- `[GGA] Checking staged files...`
- `[GGA] 3 files to review, 2 cached (skipped)`
- `[GGA] Reviewing with claude...`
- `[GGA] ✓ PASSED — commit allowed`
- o: `[GGA] ✗ FAILED — commit blocked\n\n<feedback>`

### `main.ts` — CLI Commands

```
gga [command]

Commands:
  install [--global]   Install pre-commit hook in current repo (or globally)
  uninstall            Remove pre-commit hook
  run [--pr-mode]      Run review on staged files (or all changes vs base branch)
      [--ci]           CI mode: non-interactive, exit 1 on failure
  config               Show current configuration
  cache clear          Clear cache (all projects or current project)
  cache stats          Show cache statistics
  status               Show GGA status: provider, last review, cache stats
  version              Show version
```

---

## package.json — Dependencias

```json
{
  "name": "@pedrito/gga",
  "version": "4.0.0",
  "bin": { "gga": "./dist/gga" },
  "scripts": {
    "build": "bun build src/main.ts --compile --outfile dist/gga",
    "test": "bun test",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "commander": "^12.0.0",
    "smol-toml": "^1.3.0",
    "chalk": "^5.3.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.4.0"
  }
}
```

---

## scripts/hook-template.sh

```bash
#!/usr/bin/env bash
# .git/hooks/pre-commit
# Installed by: gga install
# Do not edit manually.

if command -v gga &> /dev/null; then
  gga run || exit 1
fi
# If gga is not installed, allow commit (fail-open at install level)
```

---

## Decisiones de Diseño

### ¿Por qué `smol-toml` y no JSON para config?
TOML es más legible para archivos de configuración editados manualmente. `smol-toml` es puro TypeScript, sin bindings nativos, compatible con Bun compile.

### ¿Por qué fail-open por defecto es `false`?
El objetivo de GGA es garantizar estándares. Si el provider no responde y `fail_open = false`, el commit se bloquea con un mensaje claro. Los equipos pueden cambiarlo a `true` si prefieren no bloquear en errores de red.

### ¿Por qué SHA256 del contenido completo (no truncado)?
El hash identifica el archivo real. Si el archivo cambia, el hash cambia. Que el contenido enviado al LLM esté truncado no afecta la identidad del archivo en caché.

### ¿Por qué no integrar con Engram?
GGA puede opcionalmente reportar sus reviews como `observations` a Engram (`type: 'lesson'`), pero esto es un enhancement post-MVP. La dependencia circular (GGA usa Engram, Engram necesita GGA para sus commits) complica el bootstrap.

### ¿Por qué `Bun.spawnSync` para CLIs?
Los providers tipo CLI (claude, gemini, opencode) son procesos externos. `spawnSync` con timeout es suficiente para el caso de uso. No necesitamos streaming para el review.

---

## Criterios de Verificación

| # | Check | Cómo verificar |
|---|---|---|
| 1 | `bun build` produce binario `dist/gga` | `ls -la packages/gga/dist/gga` |
| 2 | `gga install` instala hook en `.git/hooks/pre-commit` | Inspectar archivo + `git commit` vacío |
| 3 | `gga run` con archivos staged llama al provider y parsea respuesta | Test con mock provider |
| 4 | Archivos cacheados (PASSED) no se re-envían al provider | Log muestra "N cached (skipped)" |
| 5 | `gga run` con respuesta FAILED devuelve exit code 1 | `gga run; echo $?` |
| 6 | Provider `ollama` funciona end-to-end | Requiere ollama corriendo con un modelo |
| 7 | Provider `claude` funciona end-to-end | Requiere claude CLI instalado |
| 8 | `bun test` verde (unit tests de cache, rules, review parser) | `bun test packages/gga` |
