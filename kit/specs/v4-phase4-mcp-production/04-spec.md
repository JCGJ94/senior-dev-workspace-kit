# Spec Técnica — V4 Phase 4: Context7 y MCP en Producción

## Packages modificados

| Package | Cambios |
|---|---|
| `@pedrito/engram` | Añadir SSE transport al MCP server |
| `@pedrito/installer` | Completar `components/mcp.ts` + `pedrito mcp` CLI |

---

## Parte A — Engram: SSE Transport

### Problema con el estado actual

El endpoint `POST /mcp` es JSON-RPC over HTTP (request/response). Claude Code y otros
agentes configurados con `"type": "sse"` esperan el transporte SSE del protocolo MCP:

```
Client → POST /mcp/message   (envía JSON-RPC requests)
Server → GET  /mcp/sse       (stream SSE de responses y notificaciones)
```

El endpoint HTTP actual (`POST /mcp`) seguirá existiendo para compatibilidad con
agentes que usen HTTP directo (Gemini CLI, scripts de usuario).

### Transporte SSE — Protocolo

```
1. Cliente abre  GET /mcp/sse            → recibe stream SSE
2. Servidor envía event: endpoint         → URL para mensajes: /mcp/message?sessionId=<id>
3. Cliente envía POST /mcp/message?sessionId=<id>  con body JSON-RPC
4. Servidor responde vía SSE stream con event: message
```

Formato SSE:
```
event: endpoint
data: /mcp/message?sessionId=abc123

event: message
data: {"jsonrpc":"2.0","id":1,"result":{...}}
```

### Handshake MCP completo

Además de `tools/list` y `tools/call`, el server debe manejar:

```typescript
// initialize — el cliente se identifica y negocia protocolo
method: 'initialize'
params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name, version } }
result: { protocolVersion, capabilities: { tools: {} }, serverInfo: { name: 'engram', version: '4.0.0' } }

// notifications/initialized — el cliente confirma que procesó initialize
// El server no responde, solo registra el session como lista
method: 'notifications/initialized'
```

### Cambios en `packages/engram/src/mcp/server.ts`

```typescript
// Sesiones SSE en memoria (se limpian al cerrar conexión)
interface SSESession {
  id: string;
  writer: WritableStreamDefaultWriter;
  createdAt: number;
}

// Nuevas rutas a añadir:
app.get('/mcp/sse', handleSSEConnect)     // Abre stream SSE, envía endpoint event
app.post('/mcp/message', handleSSEMessage) // Recibe JSON-RPC, responde via SSE

// Rutas existentes (mantener para compatibilidad):
app.get('/mcp', handleDiscovery)           // Sin cambios
app.post('/mcp', handleHTTPJsonRPC)        // Sin cambios
```

### Nuevo archivo: `packages/engram/src/mcp/sessions.ts`

```typescript
// Gestión de sesiones SSE en memoria
export class SessionStore {
  private sessions = new Map<string, SSESession>();

  create(writer: WritableStreamDefaultWriter): string   // Genera ID, registra sesión
  get(id: string): SSESession | undefined
  close(id: string): void                               // Cierra writer, elimina sesión
  pruneStale(maxAgeMs: number): void                    // Limpia sesiones > maxAge
}
```

---

## Parte B — Installer: MCP Component completo

### Config exacta por agente

El componente `mcp.ts` necesita conocer el formato exacto de cada agente:

#### Claude Code — `~/.claude.json`

```json
{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "engram": {
      "type": "sse",
      "url": "http://localhost:7437/mcp/sse"
    }
  }
}
```

Estrategia: leer `~/.claude.json`, merge `mcpServers`, escribir de vuelta.
Si el archivo no existe, crearlo. Si `mcpServers` ya tiene context7, no duplicar.

#### OpenCode — `~/.config/opencode/opencode.json`

```json
{
  "mcp": {
    "context7": { "type": "remote", "url": "https://mcp.context7.com/sse" },
    "engram": { "type": "sse", "url": "http://localhost:7437/mcp/sse" }
  }
}
```

#### Gemini CLI — `~/.gemini/settings.json`

```json
{
  "mcpServers": {
    "engram": { "httpUrl": "http://localhost:7437/mcp" }
  }
}
```

Nota: Gemini CLI no soporta Context7 via stdio. Solo Engram vía httpUrl.

#### Cursor — `~/.cursor/mcp.json`

Mismo formato que Claude Code (`mcpServers` con `type: stdio / sse`).

#### Codex — `~/.codex/config.toml`

```toml
[[mcp_servers]]
name = "context7"
command = "npx"
args = ["-y", "@upstash/context7-mcp@latest"]
```

#### VSCode / Copilot — `.vscode/settings.json` (workspace)

```json
{
  "github.copilot.chat.mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

#### Windsurf, Zed, JetBrains

Estos agentes tienen soporte partial/minimal de MCP. El componente
emite un warning y no escribe config si el agente no tiene soporte documentado.

### P1 Servers: Notion y Jira

```typescript
interface P1ServerConfig {
  name: 'notion' | 'jira';
  token: string;
  // Notion: API token de integración
  // Jira: Atlassian API token + base URL
  extraFields?: Record<string, string>;  // ej. { jira_base_url: "https://..." }
}
```

El flujo de instalación (Fase 3 CustomConfig screen o `pedrito mcp add`) debe:
1. Preguntar si el usuario quiere configurar Notion/Jira
2. Solicitar el token (+ base URL para Jira)
3. Escribir la config sin loguear el token en texto plano

Config de Notion en Claude Code:
```json
{
  "notion": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@notionhq/notion-mcp-server"],
    "env": { "NOTION_API_KEY": "<token>" }
  }
}
```

Config de Jira en Claude Code:
```json
{
  "jira": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "mcp-atlassian"],
    "env": {
      "JIRA_URL": "<base_url>",
      "JIRA_API_TOKEN": "<token>"
    }
  }
}
```

### `components/mcp.ts` — Interface final

```typescript
export interface MCPServerDef {
  name: string;
  priority: 'p0' | 'p1' | 'p2';
  // Config por agente — null si el agente no soporta este server
  forAgent(agentName: string): AgentMCPEntry | null;
}

export interface AgentMCPEntry {
  transport: 'stdio' | 'sse' | 'http';
  command?: string;       // para stdio
  args?: string[];        // para stdio
  url?: string;           // para sse/http
  env?: Record<string, string>;  // vars de entorno (tokens)
}

// Catálogo de servers conocidos
export const MCP_SERVERS: Record<string, MCPServerDef> = {
  context7: { ... },
  engram: { ... },
  notion: { ... },   // P1 — requiere token
  jira: { ... },     // P1 — requiere token + url
};

// Función principal — escribe config MCP en el agente
export async function configureMCPForAgent(
  agentName: string,
  serverNames: string[],
  tokens?: Record<string, string>,
  dryRun?: boolean,
): Promise<void>

// Lee config MCP actual del agente
export async function readMCPConfig(agentName: string): Promise<Record<string, AgentMCPEntry>>
```

---

## Parte C — `pedrito mcp` CLI

Nuevos subcomandos en `packages/installer/src/main.ts`:

```bash
pedrito mcp list                    # Lista todos los MCP servers configurados por agente
pedrito mcp status                  # Verifica que los servers stdio/sse responden
pedrito mcp add <server>            # Añade server a todos los agentes instalados
  --agent <name>                    #   o solo a un agente específico
  --token <tok>                     #   token para P1 servers
pedrito mcp remove <server>         # Elimina server de las configs
pedrito mcp test <server>           # Envía un tools/list y muestra respuesta
```

### `mcp status` — Verificación

Para cada server configurado:
- **stdio:** intentar spawnar el proceso con `--version` o `tools/list`, verificar exit 0
- **sse/http:** hacer `GET /mcp` o `GET /mcp/sse`, verificar respuesta válida

Output:
```
MCP Servers Status
──────────────────────────────────────────
context7   stdio   ✓ running   (Claude Code, Cursor)
engram     sse     ✓ running   (Claude Code, OpenCode, Gemini)
notion     stdio   ✗ not configured
```

---

## Archivos nuevos/modificados

### `@pedrito/engram`

| Archivo | Acción |
|---|---|
| `src/mcp/server.ts` | Modificar: añadir rutas SSE + handshake initialize |
| `src/mcp/sessions.ts` | Nuevo: `SessionStore` para sesiones SSE |

### `@pedrito/installer`

| Archivo | Acción |
|---|---|
| `src/components/mcp.ts` | Nuevo (completo): catálogo + writers por agente |
| `src/mcp/writers/claude-code.ts` | Nuevo: escribe `~/.claude.json` mcpServers |
| `src/mcp/writers/opencode.ts` | Nuevo: escribe opencode.json mcp field |
| `src/mcp/writers/gemini.ts` | Nuevo: escribe ~/.gemini/settings.json |
| `src/mcp/writers/cursor.ts` | Nuevo: escribe ~/.cursor/mcp.json |
| `src/mcp/writers/codex.ts` | Nuevo: escribe ~/.codex/config.toml |
| `src/mcp/writers/vscode.ts` | Nuevo: escribe .vscode/settings.json workspace |
| `src/main.ts` | Modificar: añadir subcomando `pedrito mcp` |

---

## Decisiones de Diseño

### ¿Por qué mantener `POST /mcp` además de SSE?
Compatibilidad. Gemini CLI usa `httpUrl` (HTTP simple). Scripts de usuario y tests usan el
JSON-RPC HTTP directo. El SSE es aditivo, no reemplaza.

### ¿Por qué sesiones SSE en memoria y no en SQLite?
Las sesiones SSE son efímeras — duran la vida de la conexión HTTP. SQLite es para
persistencia cross-session. Guardar en SQLite añade complejidad sin beneficio; si el
server se reinicia, los clientes reconectan automáticamente.

### ¿Por qué Context7 usa stdio (npx) y no remote URL?
Context7 tiene un servidor MCP oficial en `https://mcp.context7.com/sse` pero
depende de red externa. El stdio via npx es local, más rápido y funciona offline.
Para OpenCode se usa el remote URL porque ese agente tiene mejor soporte para remote SSE.

### ¿Por qué tokens en `env` y no en el config directo?
Los tokens en `env` los pasa el runner del proceso MCP (el agente), no quedan expuestos
en el archivo de config (que podría commitarse). Es la práctica estándar en MCP stdio.

### Sobre Fase 3 vs Fase 4
Fase 3 spec'ó `components/mcp.ts` como placeholder con `resolveMCPServers()`.
Fase 4 lo implementa completamente. Si durante la implementación de Fase 3 se hace antes
el trabajo de Fase 4, se puede colapsar — pero el plan los mantiene separados porque
Fase 3 es el instalador completo y Fase 4 es la especialización MCP.

---

## Criterios de Verificación

| # | Check | Cómo verificar |
|---|---|---|
| 1 | Engram SSE: `GET /mcp/sse` devuelve stream con `event: endpoint` | `curl -N http://localhost:7437/mcp/sse` |
| 2 | Engram SSE: handshake initialize → initialized completo | Test automático en `index.test.ts` |
| 3 | `pedrito mcp list` muestra servers por agente tras instalación | Ejecutar en terminal |
| 4 | `use context7` en Claude Code devuelve docs reales | Prueba manual en Claude Code |
| 5 | Engram `search_memory` funciona desde Claude Code vía MCP | Prueba manual |
| 6 | `pedrito mcp add notion --token <tok>` escribe config correcta | Verificar `~/.claude.json` |
| 7 | `pedrito mcp status` reporta ✓/✗ correcto por server | Ejecutar con Engram corriendo y detenido |
| 8 | `bun test` verde en ambos packages | `bun test packages/engram packages/installer` |
