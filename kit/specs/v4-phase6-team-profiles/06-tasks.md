# Phase 6 Tasks — Team Sharing & Perfiles

## Schema y validación

- [ ] **6.1** Crear `packages/installer/src/profiles/profile.schema.ts`
  - Schemas Zod: `ProfileSkillsSchema`, `ProfileMCPSchema`, `ProfilePermissionsSchema`,
    `ProfileGGASchema`, `PedritoProfileSchema`
  - Tipo exportado `PedritoProfile` (inferido de Zod)
  - Función `validateProfile(raw: unknown): PedritoProfile`
    - Llama `PedritoProfileSchema.parse(raw)` — lanza `ZodError` con mensajes claros
    - Verifica major version (`"4"`) — lanza `ProfileVersionError` si incompatible
  - Clase `ProfileVersionError extends Error`
  - Clase `FetchError extends Error` (status HTTP)
  - Clase `NotInstalledError extends Error` (export sin ConfigStore)

## Export

- [ ] **6.2** Crear `packages/installer/src/profiles/exporter.ts`
  - Función `exportProfile(name, description, configStore): Promise<PedritoProfile>`
  - Leer `configStore.read()` — lanzar `NotInstalledError` si null
  - Construir `agents` desde keys de `config.agents`
  - Inferir `preset` desde `config.agents[firstAgent].preset`
  - Construir `skills` — categories desde preset, custom vacío por defecto
  - Construir `mcp` — servers desde `config.mcp.servers`
  - Sanitizar tokens: `sanitizeTokens(servers)` — P1 servers → `null`
  - Construir `gga` desde `config.gga`
  - Poner `persona`, `theme` según preset o null
  - Construir `permissions` con denyPaths y requireConfirmation del preset

## Fetcher (URL)

- [ ] **6.3** Crear `packages/installer/src/profiles/fetcher.ts`
  - Función `fetchProfile(url: string): Promise<PedritoProfile>`
  - Validar que el URL empieza con `https://` — lanzar error si HTTP
  - Convertir URLs de `github.com/.../blob/...` → `raw.githubusercontent.com/...`
  - `fetch()` con timeout 10s y `User-Agent: pedrito/<VERSION>`
  - Si status != 200 → lanzar `FetchError`
  - Parsear body como JSON → llamar `validateProfile`

## Importer

- [ ] **6.4** Crear `packages/installer/src/profiles/importer.ts`
  - Interface `ImportOptions` (resolvedTokens?, dryRun?, nonInteractive?, yes?)
  - Función `importProfile(profile, opts): Promise<void>`
  - Detectar tokens faltantes (`mcp.tokens` con valores null)
  - Si !nonInteractive y hay tokens null → prompt interactivo por cada uno
  - Si nonInteractive y hay tokens null → warning, continuar sin esos servers
  - Resolver agentes: string → Agent instance; si agente no detectado → warning + skip
  - Resolver preset: string → PresetConfig; si `custom`, construir desde campos del perfil
  - Construir `InstallState` completo
  - Llamar `orchestrator.runInstall(state)` — incluye backup automático (Fase 5)
  - Si `profile.mcp.tokens` tiene valores → llamar `configureMCPForAgent` con tokens
  - Si `profile.gga` → escribir `.gga` config en proyectos del usuario

## Profile Store (local)

- [ ] **6.5** Crear `packages/installer/src/profiles/store.ts`
  - Class `ProfileStore` con `dir = ~/.pedrito/profiles/`
  - `save(name, profile)`: escribe `<dir>/<name>.json` con 2-space indent
    - Sanitiza el nombre: lowercase, replace spaces con guiones
  - `get(name)`: lee y parsea el archivo; null si no existe
  - `list()`: lee todos los `.json` del dir, parsea cada uno, devuelve `{ name, profile }[]`
    - Ordena por fecha de modificación del archivo (más reciente primero)
  - `delete(name)`: elimina el archivo; error si no existe

## CLI `pedrito profile`

- [ ] **6.6** Añadir subcomando `pedrito profile export` en `main.ts`
  - Opciones: `--output <file>`, `--name <str>`, `--description <str>`
  - Llamar `exportProfile(name, description, configStore)`
  - Sin `--output`: imprimir JSON a stdout
  - Con `--output`: escribir al archivo + confirmar al usuario
  - Preguntar si guardar en store local (solo si TTY; skip si `--yes`)

- [ ] **6.7** Añadir subcomando `pedrito profile import` en `main.ts`
  - Acepta argumento: path de archivo o URL HTTPS
  - Si argumento es URL → `fetchProfile(url)`
  - Si argumento es path → leer archivo + `validateProfile`
  - Mostrar resumen del perfil: agents, preset, MCP, GGA
  - Si hay tokens null → mostrar sección "Missing tokens" con prompts
  - Con `--yes` y `--non-interactive` → skip prompts
  - Con `--dry-run` → mostrar qué haría sin ejecutar

- [ ] **6.8** Añadir subcomando `pedrito profile list` en `main.ts`
  - Llamar `profileStore.list()`
  - Si vacío → `No saved profiles. Run: pedrito profile export --output <file>`
  - Si hay perfiles → tabla: NAME, AGENTS, PRESET, SAVED (fecha relativa)

- [ ] **6.9** Añadir subcomando `pedrito profile save` en `main.ts`
  - `pedrito profile save <name>`
  - Exportar perfil actual + guardar en store con el nombre dado
  - Confirmar: `Profile "<name>" saved to ~/.pedrito/profiles/<name>.json`

- [ ] **6.10** Añadir subcomando `pedrito profile delete` en `main.ts`
  - `pedrito profile delete <name>`
  - Sin `--yes`: confirmar antes de eliminar
  - Error si el perfil no existe en el store

- [ ] **6.11** Añadir subcomando `pedrito profile show` en `main.ts`
  - `pedrito profile show <name | file>`
  - Si name → buscar en store local
  - Si parece un path → leer archivo
  - Mostrar JSON formateado con colores (chalk)

- [ ] **6.12** Añadir stubs registry en `main.ts`
  - `pedrito profile publish` → imprimir "Registry coming soon. Stay tuned."
  - `pedrito profile search` → idem
  - `pedrito profile install` → idem

## Tests

- [ ] **6.13** Añadir tests en `packages/installer/src/index.test.ts`
  - Test de `validateProfile`: perfil válido pasa, campos faltantes lanzan ZodError
  - Test de `validateProfile`: versión `"5.0"` lanza ProfileVersionError
  - Test de `exportProfile`: genera campos correctos desde ConfigStore mock
  - Test de `exportProfile`: tokens P1 son null en el resultado
  - Test de `exportProfile` sin ConfigStore → lanza NotInstalledError
  - Test de `fetchProfile`: URL HTTP lanza error
  - Test de `fetchProfile`: URL GitHub blob → se convierte a raw URL
  - Test de `ProfileStore.save/get/list/delete`: ciclo completo con dir temp
  - Test de `importProfile` en dryRun: no llama runInstall
  - Test de tokens null con nonInteractive: warning, no bloquea

## Build y verificación

- [ ] **6.14** `bun test packages/installer` — todos los tests verdes
- [ ] **6.15** `bun run build` en `packages/installer` — binario compila sin errores
- [ ] **6.16** Smoke test export: `pedrito profile export | jq .version` → `"4.0"`
- [ ] **6.17** Smoke test import: exportar + borrar config + reimportar → `pedrito doctor` verde
- [ ] **6.18** Smoke test URL: `pedrito profile import https://raw.githubusercontent.com/...`
  (usar un perfil de test en el repo o un gist)
- [ ] **6.19** Verificar stubs: `pedrito profile publish` → mensaje "coming soon" sin error
- [ ] **6.20** Cerrar spec: completar `summary.md`, marcar status Complete

---

## Orden de implementación recomendado

```
6.1 (schema + errores)
  → 6.2 (exporter)        ← depende de ConfigStore (Fase 5)
  → 6.3 (fetcher)         ← independiente
  → 6.5 (store)           ← independiente
  → 6.4 (importer)        ← depende de orchestrator (Fase 3) + schema
  → 6.6–6.12 (CLI)        ← dependen de todos los módulos anteriores
  → 6.13 (tests)
  → 6.14–6.20 (build + verificación)
```

**MVP mínimo:** 6.1 + 6.2 + 6.4 + 6.6 + 6.7 — export e import funcionando.
Store local (6.5) y resto del CLI son incrementales.
