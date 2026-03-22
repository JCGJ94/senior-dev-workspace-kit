# Phase 4 Tasks — Context7 y MCP en Producción

## Parte A — Engram: SSE Transport

- [ ] **4.1** Crear `packages/engram/src/mcp/sessions.ts`
  - Interface `SSESession` (id, writer, createdAt)
  - Class `SessionStore` con métodos: `create`, `get`, `close`, `pruneStale`
  - Almacenamiento en `Map<string, SSESession>` (en memoria, no SQLite)
  - `create` genera UUID con `crypto.randomUUID()`

- [ ] **4.2** Modificar `packages/engram/src/mcp/server.ts` — añadir SSE transport
  - Importar `SessionStore` y crear instancia compartida
  - Añadir `GET /mcp/sse` → `handleSSEConnect`:
    - Crea sesión en `SessionStore`
    - Responde con `Content-Type: text/event-stream`
    - Envía `event: endpoint\ndata: /mcp/message?sessionId=<id>\n\n`
    - Mantiene conexión abierta (no cierra el stream)
    - Al cerrar la conexión del cliente → llama `sessionStore.close(id)`
  - Añadir `POST /mcp/message?sessionId=<id>` → `handleSSEMessage`:
    - Lee el body JSON-RPC
    - Busca la sesión en `SessionStore`
    - Si no existe → 404
    - Procesa el mensaje (reutilizar lógica del POST /mcp existente)
    - Escribe la respuesta en el SSE stream de la sesión como `event: message`
    - Devuelve HTTP 202 Accepted (la respuesta real va por SSE)

- [ ] **4.3** Añadir handshake MCP completo en `server.ts`
  - Manejar `method: 'initialize'`:
    - Responder con `protocolVersion`, `capabilities: { tools: {} }`, `serverInfo`
  - Manejar `method: 'notifications/initialized'`:
    - No responder (es una notification, no un request)
    - Registrar la sesión como "ready"
  - Aplica tanto en `POST /mcp` (HTTP) como en `POST /mcp/message` (SSE)

- [ ] **4.4** Añadir pruning periódico de sesiones stale
  - En `cmdServe()`, llamar `setInterval(() => sessionStore.pruneStale(5 * 60 * 1000), 60_000)`
  - Sesiones sin actividad > 5 minutos se cierran automáticamente

- [ ] **4.5** Actualizar tests en `packages/engram/src/index.test.ts`
  - Test del handshake initialize → initialized
  - Test de `GET /mcp/sse` devuelve `Content-Type: text/event-stream` y event endpoint
  - Test de `POST /mcp/message` con sessionId válido devuelve respuesta via stream
  - Test de `POST /mcp/message` con sessionId inválido devuelve 404
  - Test de `SessionStore`: create, get, close, pruneStale

## Parte B — Installer: MCP Writers por agente

- [ ] **4.6** Crear `packages/installer/src/mcp/writers/claude-code.ts`
  - `readClaudeJson(homeDir): Record<string, unknown>` — lee `~/.claude.json` (JSON)
  - `writeClaudeJson(homeDir, data): void` — escribe con format 2-space indent
  - `mergeMCPServers(existing, toAdd): void` — merge sin sobrescribir entries existentes
  - Maneja el caso de archivo inexistente (crea con `{}`)

- [ ] **4.7** Crear `packages/installer/src/mcp/writers/opencode.ts`
  - Lee/escribe `~/.config/opencode/opencode.json`
  - Merge en el campo `mcp` (no `mcpServers`)

- [ ] **4.8** Crear `packages/installer/src/mcp/writers/gemini.ts`
  - Lee/escribe `~/.gemini/settings.json`
  - Solo configura Engram (httpUrl) — Context7 no aplica a Gemini

- [ ] **4.9** Crear `packages/installer/src/mcp/writers/cursor.ts`
  - Lee/escribe `~/.cursor/mcp.json`
  - Mismo formato que Claude Code (mcpServers con type: stdio/sse)

- [ ] **4.10** Crear `packages/installer/src/mcp/writers/codex.ts`
  - Lee/escribe `~/.codex/config.toml`
  - Formato TOML: `[[mcp_servers]]` array entries
  - Usar `smol-toml` (ya en deps de gga, añadir a installer si no está)

- [ ] **4.11** Crear `packages/installer/src/mcp/writers/vscode.ts`
  - Escribe en `.vscode/settings.json` del workspace actual (no global)
  - Campo: `github.copilot.chat.mcpServers`
  - Solo Context7 (Engram no aplica en VSCode workspace)

## Parte B — Installer: MCP Component y Catálogo

- [ ] **4.12** Crear `packages/installer/src/components/mcp.ts` (completo)
  - Interfaces `MCPServerDef` y `AgentMCPEntry`
  - Catálogo `MCP_SERVERS`:
    - `context7`: P0, stdio via npx, soportado en claude-code/opencode/cursor/codex/vscode
    - `engram`: P0, SSE `localhost:7437/mcp/sse`, soportado en claude-code/opencode/gemini/cursor
    - `notion`: P1, stdio, requiere `NOTION_API_KEY` en env
    - `jira`: P1, stdio, requiere `JIRA_URL` + `JIRA_API_TOKEN` en env
  - Función `configureMCPForAgent(agentName, serverNames, tokens?, dryRun?)`:
    - Selecciona el writer correcto por agente
    - Llama al writer con las entradas del catálogo
    - En dryRun: solo loguea lo que haría
  - Función `readMCPConfig(agentName)`: lee config actual del agente

## Parte C — `pedrito mcp` CLI

- [ ] **4.13** Crear `packages/installer/src/mcp/status.ts`
  - Función `checkMCPServerStatus(server: MCPServerDef): Promise<'running' | 'error' | 'not-configured'>`
  - Para stdio: spawn con timeout de 5s, llamar `tools/list`, verificar respuesta
  - Para sse/http: fetch `GET /mcp` o `/mcp/sse`, verificar 200 + Content-Type correcto

- [ ] **4.14** Modificar `packages/installer/src/main.ts` — añadir `pedrito mcp`
  - `pedrito mcp list`:
    - Leer config MCP de todos los agentes instalados (via `readMCPConfig`)
    - Mostrar tabla: `agente | server | transport | url/command`
  - `pedrito mcp status`:
    - Llamar `checkMCPServerStatus` por cada server único encontrado
    - Mostrar tabla con ✓/✗ y qué agentes lo usan
  - `pedrito mcp add <server> [--agent <name>] [--token <tok>] [--token2 <tok>]`:
    - Resolver `server` en el catálogo `MCP_SERVERS`
    - Si es P1 y no se pasa `--token`: prompt interactivo para el token
    - Llamar `configureMCPForAgent` para cada agente afectado
    - Mostrar qué archivos se modificaron
  - `pedrito mcp remove <server> [--agent <name>]`:
    - Leer config del agente, eliminar la entrada del server, escribir
  - `pedrito mcp test <server>`:
    - Spawn o fetch del server, enviar `tools/list`, pretty-print respuesta

## Tests

- [ ] **4.15** Añadir tests en `packages/installer/src/index.test.ts`
  - Test de `claude-code` writer: merge sin duplicar entries existentes
  - Test de `opencode` writer: crea archivo si no existe, merge correcto
  - Test de catálogo `MCP_SERVERS`: context7 no aplica a gemini, engram sí aplica
  - Test de `readMCPConfig` con archivo inexistente → devuelve `{}`
  - Test de `configureMCPForAgent` en dryRun → no escribe archivos

## Build y verificación

- [ ] **4.16** `bun install` en raíz (por si `smol-toml` se añade a installer)
- [ ] **4.17** `bun test packages/engram` — tests SSE y handshake verdes
- [ ] **4.18** `bun test packages/installer` — tests MCP writers verdes
- [ ] **4.19** Smoke test SSE: `curl -N http://localhost:7437/mcp/sse` muestra event:endpoint
- [ ] **4.20** Test end-to-end Context7: instalar en Claude Code, usar `use context7` en sesión
- [ ] **4.21** Test end-to-end Engram MCP: `search_memory` desde Claude Code vía MCP
- [ ] **4.22** Verificar `pedrito mcp status` muestra estado correcto con Engram corriendo/detenido
- [ ] **4.23** Cerrar spec: completar `summary.md`, marcar status Complete

---

## Orden de implementación recomendado

```
Engram SSE (4.1 → 4.2 → 4.3 → 4.4 → 4.5)
  ↓ (en paralelo con writers)
Writers (4.6 → 4.7 → 4.8 → 4.9 → 4.10 → 4.11)
  ↓
Catálogo MCP (4.12)
  ↓
CLI status + mcp commands (4.13 → 4.14)
  ↓
Tests (4.15)
  ↓
Build + verificación (4.16 → 4.23)
```

**Dependencia clave:** 4.14 (`pedrito mcp`) depende de 4.12 (catálogo) y 4.13 (status checker).
Todo lo demás en cada rama es lineal.
