# Phase 2 Tasks — GGA Guardian Angel

## Setup del package

- [ ] **2.1** Actualizar `packages/gga/package.json`
  - Añadir deps: `commander`, `smol-toml`, `chalk`
  - Añadir `bin: { gga: "./dist/gga" }`
  - Cambiar script `build` a `bun build src/main.ts --compile --outfile dist/gga`

## Core modules

- [ ] **2.2** Crear `packages/gga/src/config.ts`
  - Interface `GGAConfig` con todos los campos
  - Función `loadConfig(cwd: string): GGAConfig`
  - Búsqueda en orden: `.gga` local → `~/.config/gga/config` → defaults
  - Parser TOML con `smol-toml`

- [ ] **2.3** Crear `packages/gga/src/staged.ts`
  - Interface `StagedFile` (path, content, sha256, status)
  - Función `getStagedFiles(config: GGAConfig): Promise<StagedFile[]>`
  - Implementar con `git diff --cached --name-status` + `git show :path`
  - Filtrar binarios, archivos D (deleted), patrones en `config.exclude`
  - Truncar contenido si excede `max_file_size`

- [ ] **2.4** Crear `packages/gga/src/cache.ts`
  - Interface `CacheEntry` (sha256, result, timestamp, provider)
  - `checkCache(cacheDir, project, sha256): CacheEntry | null`
  - `writeCache(cacheDir, project, entry): void`
  - `clearCache(cacheDir, project?): void`
  - `getCacheStats(cacheDir): { projects, entries, size_bytes }`
  - Layout: `~/.cache/gga/<project>/<sha256>.json`
  - Usar `Bun.CryptoHasher` para SHA256

- [ ] **2.5** Crear `packages/gga/src/rules.ts`
  - Función `extractRules(rulesFile: string, cwd: string): string`
  - Buscar `AGENTS.md`, fallback a `CLAUDE.md`, fallback a reglas genéricas
  - Extraer secciones con keywords: rules, standards, conventions, guidelines
  - Truncar a 4000 chars si el documento es muy grande

- [ ] **2.6** Crear `packages/gga/src/review.ts`
  - Interfaces `ReviewResult`, `ReviewIssue`
  - Función `buildPrompt(files: StagedFile[], rules: string): string`
  - Función `parseResponse(raw: string): ReviewResult`
  - Parser: busca `VERDICT: PASSED` / `VERDICT: FAILED`
  - Parser: extrae líneas `ISSUE: <file> | <severity> | <message>`

## Providers

- [ ] **2.7** Crear `packages/gga/src/providers/provider.interface.ts`
  - Interface `AIProvider { name: string; call(prompt, timeout): Promise<string> }`

- [ ] **2.8** Crear `packages/gga/src/providers/claude.ts`
  - `Bun.spawn(['claude', '--print', prompt])` con timeout
  - Manejar error si `claude` no está en PATH

- [ ] **2.9** Crear `packages/gga/src/providers/ollama.ts`
  - `fetch('http://localhost:11434/api/generate', ...)` con modelo configurable
  - Parsear respuesta streaming de Ollama (líneas JSON) o non-streaming
  - Manejar error de conexión (servidor no corriendo)

- [ ] **2.10** Crear `packages/gga/src/providers/gemini.ts`
  - `Bun.spawn(['gemini', '-p', prompt])` con timeout

- [ ] **2.11** Crear `packages/gga/src/providers/opencode.ts`
  - `Bun.spawn(['opencode', 'run', prompt])` con timeout

- [ ] **2.12** Crear `packages/gga/src/providers/lmstudio.ts`
  - `fetch('http://localhost:1234/v1/chat/completions', ...)` OpenAI-compatible
  - Puerto configurable vía `provider = "lmstudio:8080"` (default 1234)

- [ ] **2.13** Crear `packages/gga/src/providers/github.ts`
  - `gh auth token` para obtener el token
  - `fetch('https://models.inference.ai.azure.com/...')` con el modelo configurado
  - Manejar `provider = "github:gpt-4o"` / `"github:claude-3-5-sonnet"`

- [ ] **2.14** Crear factory `packages/gga/src/providers/index.ts`
  - Función `getProvider(providerString: string): AIProvider`
  - Parsea `"claude"`, `"ollama:llama3"`, `"github:gpt-4o"`, etc.
  - Lanza error claro si el provider string no es reconocido

## Orquestador

- [ ] **2.15** Crear `packages/gga/src/hook.ts`
  - Función `runHook(opts: { prMode?: boolean; ci?: boolean }): Promise<void>`
  - Implementar flujo completo: staged → cache → rules → review → resultado
  - Output a stderr con prefijo `[GGA]`
  - En `prMode`: usar `git diff <base-branch>...HEAD` en lugar de staged
  - En modo normal: `git diff --cached`
  - Respetar `fail_open`: si provider lanza error y `fail_open=true` → exit 0

## CLI

- [ ] **2.16** Crear `packages/gga/src/main.ts`
  - Commander.js con todos los subcomandos:
    - `install [--global]` → escribir hook-template.sh en `.git/hooks/pre-commit`
    - `uninstall` → eliminar hook si fue instalado por GGA
    - `run [--pr-mode] [--ci]` → llamar `runHook()`
    - `config` → mostrar config actual (leyendo `.gga` o defaults)
    - `cache clear [--all]` → llamar `clearCache()`
    - `cache stats` → llamar `getCacheStats()` y mostrar tabla
    - `status` → mostrar provider, last review timestamp, cache stats
    - `version` → mostrar versión

- [ ] **2.17** Crear `packages/gga/scripts/hook-template.sh`
  - Script bash mínimo que llama `gga run || exit 1`
  - Con comentario de cabecera indicando que fue instalado por GGA

## Tests

- [ ] **2.18** Crear tests en `packages/gga/src/index.test.ts`
  - Test de `parseResponse`: casos PASSED, FAILED, respuesta malformada
  - Test de `extractRules`: con AGENTS.md real, sin archivo, con CLAUDE.md
  - Test de `checkCache` / `writeCache`: escritura y lectura de entradas
  - Test de `buildPrompt`: verifica que el prompt incluye las reglas y los archivos
  - Test de `loadConfig`: valores por defecto, merge con archivo .gga
  - Test de factory `getProvider`: parseo de strings de provider

## Build y verificación

- [ ] **2.19** Ejecutar `bun install` en raíz del monorepo para instalar nuevas deps
- [ ] **2.20** Ejecutar `bun test packages/gga` — todos los tests deben pasar
- [ ] **2.21** Ejecutar `bun run build` en `packages/gga` — produce `dist/gga`
- [ ] **2.22** Smoke test manual: `gga install` + hacer un commit en repo de prueba
- [ ] **2.23** Verificar provider `claude` end-to-end (requiere claude CLI)
- [ ] **2.24** Verificar provider `ollama` end-to-end (requiere ollama + modelo)
- [ ] **2.25** Actualizar `packages/gga/src/index.ts` — re-exportar VERSION + tipos públicos
- [ ] **2.26** Cerrar spec: completar `summary.md` y marcar status Complete

---

## Orden de implementación recomendado

```
2.1 (package.json deps)
  → 2.7 (provider interface)
  → 2.2 (config)
  → 2.4 (cache)
  → 2.3 (staged)
  → 2.5 (rules)
  → 2.6 (review)
  → 2.8–2.14 (providers, en paralelo)
  → 2.15 (hook orchestrator)
  → 2.16 (CLI main)
  → 2.17 (hook template)
  → 2.18 (tests)
  → 2.19–2.26 (build + verificación)
```
