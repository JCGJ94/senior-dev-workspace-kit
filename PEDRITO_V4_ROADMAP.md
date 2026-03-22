# Pedrito V4 — Roadmap de Elevación a Nivel Gentleman

> **Objetivo:** Convertir Pedrito de un framework de gobernanza en Markdown a un producto de ingeniería de IA completo: instalador, servidor de memoria real, code review automatizado, soporte multi-agente y distribución profesional.
>
> **Filosofía:** Mantener lo mejor de Pedrito (gobernanza SDD de 9 fases, skill system con tiers, arquitectura source/runtime, Engram como sistema de memoria) y agregar las herramientas reales que le faltan.

---

## Stack Tecnológico Recomendado: TypeScript + Bun

### Por qué TypeScript con Bun (no Go, no Python)

| Criterio | Go | Python | **TypeScript + Bun** |
|---|---|---|---|
| Binario único compilado | ✓ | Difícil (pyinstaller) | **✓ `bun build --compile`** |
| TUI de calidad | Bubbletea | Textual | **Ink (React para terminal)** |
| SQLite nativo | `database/sql` | `sqlite3` | **`bun:sqlite` (built-in, sin deps)** |
| HTTP server | `net/http` | FastAPI | **Hono (ultraligero, 12KB)** |
| Velocidad de arranque | ~1ms | ~300ms | **~5ms (Bun runtime)** |
| Cross-compile | Excelente | Limitado | **✓ `--target=bun-linux-x64`** |
| Curva de aprendizaje | Alta | Baja | **Baja (ya conoces TS)** |
| Ecosistema AI/tooling | Limitado | Excelente | **Excelente (tsx, zod, etc.)** |

**Decisión:** TypeScript + Bun para todo. Los skills y core rules permanecen en Markdown (esa es su fortaleza). Solo las herramientas ejecutables se construyen en TS.

### Proyectos a construir

```
pedrito-kit/          ← Este repositorio (existente, mantener)
  └── PEDRITO_V4_ROADMAP.md

pedrito-engram/       ← Nuevo: Servidor de memoria (SQLite + FTS5 + REST API)
pedrito-gga/          ← Nuevo: Guardian Angel (pre-commit hook + AI review)
pedrito-installer/    ← Nuevo: CLI instalador con TUI (Ink)
```

O alternativamente, un monorepo:

```
pedrito/
├── packages/
│   ├── engram/       ← @pedrito/engram
│   ├── gga/          ← @pedrito/gga
│   └── installer/    ← @pedrito/installer (CLI: `pedrito` command)
├── kit/              ← Este repositorio (skills, core, workflows, etc.)
└── package.json      ← workspace root
```

---

## Soporte Multi-Agente

### Matriz de Soporte por Tier

| Tier | Agentes | Qué se configura |
|---|---|---|
| **Full** | Claude Code, OpenCode | Engram plugin/MCP + skills + SDD orchestrator + GGA + persona + theme + permissions + statusline + hooks |
| **Good** | Cursor, VSCode (Copilot/Cline) | Skills + MCP + SDD inline + GGA como reviewer + persona rules |
| **Partial** | Gemini CLI, Codex, Windsurf, JetBrains, Zed | Skills via system instructions + MCP donde aplica + GGA provider config + persona |
| **Minimal** | Xcode, Antigravity, agentes emergentes | Persona y convenciones via project/workspace rules — implementar via Agent interface cuando el agente estabilice su API |

### Paths de Configuración por Agente

| Agente | Config Path | Archivos Clave |
|---|---|---|
| **Claude Code** | `~/.claude/` | `CLAUDE.md`, `settings.json`, `skills/`, `plugins/`, `~/.claude.json` (MCP) |
| **OpenCode** | `~/.config/opencode/` | `opencode.json`, `skill/`, `commands/`, `plugins/` |
| **Gemini CLI** | `~/.gemini/` | `settings.json`, `system.md`, `.env` |
| **Codex** | `~/.codex/` | `config.toml`, `instructions.md` |
| **Cursor** | `~/.cursor/` | `.cursorrules`, `skills/`, MCP config |
| **VSCode** | `~/.vscode/` + workspace | `.github/copilot-instructions.md`, `.vscode/settings.json`, MCP extension config |
| **Windsurf** | `~/.windsurf/` | `rules`, MCP config |
| **JetBrains** | IDE config paths | AI Assistant system prompt, plugin config |
| **Zed** | `~/.config/zed/` | `assistant.json`, system prompt |
| **Xcode** | Xcode config | Project-level instructions |
| **Antigravity** | TBD (API emergente) | Implementar via Agent interface cuando estabilice — P2 |

---

## Fase 0: Foundation Architecture (2-3 días)

### Objetivo
Establecer la estructura del monorepo, toolchain, y las abstracciones base antes de construir cualquier herramienta.

### Tareas

**0.1 Inicializar monorepo con Bun workspaces**

```
pedrito/
├── packages/
│   ├── engram/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── gga/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── installer/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── kit/                    ← mover el repositorio actual aquí
│   ├── core/
│   ├── skills/
│   ├── workflows/
│   ├── specs/
│   ├── docs/
│   └── AGENTS.md
├── package.json            ← workspace root
├── bun.lockb
└── tsconfig.base.json
```

**0.2 Definir el Agent Interface (TypeScript)**

```typescript
// packages/installer/src/agents/agent.interface.ts

export type SupportTier = 'full' | 'good' | 'partial' | 'minimal';

export interface DetectionResult {
  installed: boolean;
  version?: string;
  configExists: boolean;
  configPaths: string[];
}

export interface Agent {
  // Identidad
  name(): string;
  tier(): SupportTier;

  // Detección
  detect(): Promise<DetectionResult>;
  install(ctx: InstallContext): Promise<void>;

  // Configuración del ecosistema (retornan ErrNotSupported si no aplica)
  configureEngram(): Promise<void>;
  configureMCP(servers: MCPServer[]): Promise<void>;
  configureSkills(skills: Skill[]): Promise<void>;
  configureSDD(): Promise<void>;
  configurePersona(persona: Persona): Promise<void>;
  configureTheme(theme: Theme): Promise<void>;
  configurePermissions(perms: Permissions): Promise<void>;
  configureGGA(provider: GGAProvider): Promise<void>;

  // Validación
  verify(): Promise<VerificationResult>;

  // Metadata
  configPaths(): string[];
  capabilities(): Capability[];
}
```

**0.3 CI/CD base del monorepo**

```yaml
# .github/workflows/build.yml
# - bun test en todos los packages
# - bun build --compile para cada binario
# - Matrix de plataformas: macos-arm64, macos-x64, ubuntu-x64, windows-x64
```

**Criterio de éxito:** Monorepo funcional con Bun workspaces, `bun test` verde, interface definida.

---

## Fase 1: Engram Real — Servidor de Memoria (1-2 semanas)

### Objetivo
Reemplazar el sistema de carpetas Markdown de Engram por un servidor de memoria real: SQLite con FTS5, API REST, búsqueda semántica, cross-session, cross-agent.

### Arquitectura

```
Engram Server (localhost:7437)
├── SQLite + FTS5          ← Persistencia + búsqueda full-text
├── REST API (Hono)        ← Interface para todos los agentes
├── Claude Code Plugin     ← Hooks: PreToolUse/PostToolUse/Stop
├── OpenCode Plugin        ← TypeScript plugin nativo
└── MCP Server             ← Para Gemini CLI, Cursor, etc.
```

### Schema de la Base de Datos

```sql
-- packages/engram/src/db/schema.sql

CREATE TABLE sessions (
  id          TEXT PRIMARY KEY,
  project     TEXT NOT NULL,
  agent       TEXT NOT NULL,         -- 'claude-code', 'opencode', 'gemini', etc.
  started_at  INTEGER NOT NULL,
  ended_at    INTEGER,
  goal        TEXT,
  summary     TEXT
);

CREATE TABLE observations (
  id          TEXT PRIMARY KEY,
  session_id  TEXT REFERENCES sessions(id),
  project     TEXT NOT NULL,
  type        TEXT NOT NULL,         -- 'decision', 'bug', 'pattern', 'convention', 'lesson'
  topic_key   TEXT NOT NULL,         -- upsert key para deduplicar
  content     TEXT NOT NULL,
  tags        TEXT,                  -- JSON array
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);

-- FTS5 para búsqueda semántica full-text
CREATE VIRTUAL TABLE observations_fts USING fts5(
  content,
  tags,
  content=observations,
  content_rowid=rowid,
  tokenize='porter unicode61'
);

-- Triggers para mantener FTS sincronizado
CREATE TRIGGER obs_ai AFTER INSERT ON observations BEGIN
  INSERT INTO observations_fts(rowid, content, tags)
  VALUES (new.rowid, new.content, new.tags);
END;

CREATE TRIGGER obs_au AFTER UPDATE ON observations BEGIN
  INSERT INTO observations_fts(observations_fts, rowid, content, tags)
  VALUES ('delete', old.rowid, old.content, old.tags);
  INSERT INTO observations_fts(rowid, content, tags)
  VALUES (new.rowid, new.content, new.tags);
END;
```

### API REST (Hono)

```typescript
// packages/engram/src/api/routes.ts

// Sesiones
POST   /sessions                    // Iniciar sesión
PATCH  /sessions/:id                // Actualizar sesión (summary al cerrar)
GET    /sessions?project=X&limit=5  // Últimas sesiones del proyecto

// Memoria
POST   /observations                // Guardar observación
GET    /observations/search?q=X&project=Y&type=Z  // Búsqueda FTS5
GET    /observations/context?project=X            // Contexto completo del proyecto
DELETE /observations/:id            // Eliminar observación

// Health
GET    /health                      // Status del servidor
GET    /health/db                   // Stats de la DB
```

### Estructura de Archivos

```
packages/engram/
├── src/
│   ├── main.ts              ← Entry point + servidor Hono
│   ├── db/
│   │   ├── schema.sql       ← Schema SQLite
│   │   ├── migrations.ts    ← Migraciones automáticas al arrancar
│   │   └── queries.ts       ← Queries tipadas (zod schemas)
│   ├── api/
│   │   ├── routes.ts        ← Routes Hono
│   │   ├── sessions.ts      ← Handlers de sesiones
│   │   └── observations.ts  ← Handlers de observaciones
│   ├── plugins/
│   │   ├── claude-code/     ← Hook scripts para Claude Code
│   │   │   ├── session-start.sh
│   │   │   ├── session-end.sh
│   │   │   └── CLAUDE_ENGRAM.md  ← Instrucciones de uso para el agente
│   │   └── opencode/        ← TypeScript plugin para OpenCode
│   │       └── engram.ts
│   └── mcp/
│       └── server.ts        ← MCP server (para Gemini, Cursor, etc.)
├── package.json
└── tsconfig.json
```

### Plugin de Claude Code (Hooks)

```bash
# packages/engram/src/plugins/claude-code/session-start.sh
# Se ejecuta como PreToolUse hook en CLAUDE.md

SESSION_ID=$(curl -s -X POST http://localhost:7437/sessions \
  -H "Content-Type: application/json" \
  -d "{\"project\": \"$(basename $PWD)\", \"agent\": \"claude-code\"}" \
  | jq -r '.id')

# Inyectar contexto previo en el agente
CONTEXT=$(curl -s "http://localhost:7437/observations/context?project=$(basename $PWD)")
echo "$CONTEXT"  # Claude Code lo lee del hook output
```

### Instrucciones para el Agente (en CLAUDE.md)

```markdown
## Engram Memory Protocol

When starting work on a project, ALWAYS call:
- `GET /observations/context?project=<name>` to load previous context
- Search relevant memories: `GET /observations/search?q=<topic>&project=<name>`

When making architectural decisions or discovering important patterns, ALWAYS save:
- `POST /observations` with type: 'decision' | 'pattern' | 'bug' | 'convention' | 'lesson'

When ending a session, ALWAYS summarize:
- `PATCH /sessions/<id>` with goal, discoveries, accomplished, modified_files

Base URL: http://localhost:7437
```

### Inicialización Automática

```bash
# macOS: launchd
# Linux: systemd user service
# ambos: pedrito doctor detecta si está corriendo
```

### Migración desde Engram Markdown

```typescript
// packages/engram/src/migrate-from-markdown.ts
// Lee docs/engram/decisions/*.md, patterns/*.md, lessons/*.md
// y los importa como observations en la DB nueva
```

**Criterio de éxito:**
- `engram serve` arranca en <100ms
- `engram search "auth patterns"` devuelve resultados relevantes
- Claude Code lee contexto previo al iniciar una sesión nueva
- Dos agentes distintos ven las mismas memories del mismo proyecto

---

## Fase 2: GGA — Guardian Angel (1 semana)

### Objetivo
Pre-commit hook que revisa código staged contra los estándares de `AGENTS.md` usando cualquier proveedor IA. Bloquea commits que no pasan. Caché SHA256 para evitar re-revisar archivos sin cambios.

### Arquitectura

```
git commit
    │
    ▼
GGA pre-commit hook
    ├── Lee archivos staged
    ├── Verifica caché SHA256 (~/.cache/gga/)
    │   └── Si PASSED y sin cambios → skip ✓
    ├── Lee AGENTS.md (estándares del proyecto)
    ├── Envía a proveedor IA configurado
    │   ├── claude: claude --print "..."
    │   ├── opencode: opencode run "..."
    │   ├── gemini: gemini -p "..."
    │   ├── ollama: REST API localhost:11434
    │   └── lmstudio: OpenAI-compatible API
    └── Resultado:
        ├── PASSED → commit permitido, actualizar caché
        └── FAILED → commit bloqueado, mostrar feedback
```

### Proveedores Soportados

| Provider | Config Value | Mecanismo |
|---|---|---|
| Claude Code | `claude` | `claude --print <prompt>` |
| OpenCode | `opencode` | `opencode run <prompt>` |
| Gemini CLI | `gemini` | `gemini -p <prompt>` |
| Codex | `codex` | `codex exec <prompt>` |
| Ollama (local) | `ollama:<model>` | REST API `localhost:11434` |
| LM Studio | `lmstudio` | OpenAI-compatible API |
| GitHub Models | `github:<model>` | Azure API via `gh auth` |

### Estructura de Archivos

```
packages/gga/
├── src/
│   ├── main.ts              ← CLI entrypoint (commander)
│   ├── hook.ts              ← Lógica del pre-commit hook
│   ├── providers/
│   │   ├── provider.interface.ts
│   │   ├── claude.ts
│   │   ├── opencode.ts
│   │   ├── gemini.ts
│   │   ├── ollama.ts
│   │   └── lmstudio.ts
│   ├── cache.ts             ← SHA256 cache management
│   ├── rules.ts             ← Parser de AGENTS.md para extraer estándares
│   └── review.ts            ← Lógica de review + prompt construction
├── scripts/
│   └── hook-template.sh     ← Template del pre-commit hook
└── package.json
```

### CLI Commands

```bash
gga install          # Instala pre-commit hook en el repo actual
gga install --global # git config --global core.hooksPath
gga run              # Ejecuta review manualmente (todos los staged)
gga run --pr-mode    # Review de todos los cambios vs branch base
gga run --ci         # Modo CI (no interactivo, exit code 1 si falla)
gga config           # Mostrar/editar configuración
gga cache clear      # Limpiar caché de archivos passed
gga status           # Mostrar estado: proveedor, caché stats, último review
```

### Configuración (`.gga` en raíz del proyecto o `~/.config/gga/config`)

```toml
provider = "claude"
timeout = 120
cache_dir = "~/.cache/gga"
rules_file = "AGENTS.md"   # o CLAUDE.md si no existe AGENTS.md
```

### Template del Pre-commit Hook

```bash
#!/usr/bin/env bash
# .git/hooks/pre-commit — instalado por: gga install

if command -v gga &> /dev/null; then
  gga run || exit 1
fi
```

**Criterio de éxito:**
- `git commit` en un proyecto con GGA instalado activa el review automático
- Archivos que no cambiaron desde el último PASSED no se re-revisan (caché)
- El feedback del review se muestra antes de bloquear el commit
- Funciona con al menos claude y ollama como providers

---

## Fase 3: Instalador con TUI (2 semanas)

### Objetivo
Reemplazar `setup.sh` con un instalador TypeScript (CLI + TUI opcional con Ink) que detecte el sistema, permita seleccionar agentes, preset y componentes, y configure todo automáticamente.

### Flujo de Instalación

```
pedrito install
       │
       ▼
  ┌─────────────────────────────────┐
  │  Welcome                         │
  │  Pedrito AI Workspace Kit        │
  │  "Governance meets real tooling" │
  └──────────┬──────────────────────┘
             │
             ▼
  ┌─────────────────────────────────┐
  │  System Scan                     │
  │  OS: macOS Apple Silicon ✓       │
  │  Claude Code: installed ✓        │
  │  OpenCode: not found ✗           │
  │  Engram: not running ✗           │
  │  GGA: not installed ✗            │
  └──────────┬──────────────────────┘
             │
             ▼
  ┌─────────────────────────────────┐
  │  Select Agents                   │
  │  ☑ Claude Code (detected)        │
  │  ☐ OpenCode                      │
  │  ☐ Gemini CLI                    │
  │  ☐ Codex                         │
  │  ☐ Cursor                        │
  │  ☐ VSCode                        │
  │  ☐ Windsurf  ☐ JetBrains         │
  │  ☐ Zed       ☐ Xcode             │
  │  ☐ Antigravity (Minimal tier)    │
  └──────────┬──────────────────────┘
             │
             ▼
  ┌─────────────────────────────────┐
  │  Select Preset                   │
  │  ★ Full Pedrito                  │
  │    Engram + GGA + SDD + Skills   │
  │    + MCP + Persona               │
  │  ○ Ecosystem Only (sin persona)  │
  │  ○ Minimal (Engram + básicos)    │
  │  ○ Custom                        │
  └──────────┬──────────────────────┘
             │
             ▼
  ┌─────────────────────────────────┐
  │  Review & Confirm                │
  │  Agents: Claude Code             │
  │  Preset: Full Pedrito            │
  │  Memory: Engram ✓                │
  │  Code Review: GGA (claude) ✓     │
  │  SDD: 9-phase workflow ✓         │
  │  MCP: Context7 ✓                 │
  │  Skills: 32 skills ✓             │
  │  [Install]  [Back]               │
  └──────────┬──────────────────────┘
             │
             ▼
  ┌─────────────────────────────────┐
  │  Installing...                   │
  │  ✓ Backup existing configs       │
  │  ✓ Installing Engram             │
  │  ✓ Installing GGA                │
  │  ◌ Configuring Claude Code...    │
  │    ✓ Skills (32 files)           │
  │    ✓ MCP: Context7               │
  │    ◌ Engram plugin...            │
  │    [████████░░] 80%              │
  └──────────┬──────────────────────┘
             │
             ▼
  ┌─────────────────────────────────┐
  │  Done! ✓                         │
  │                                  │
  │  Next steps:                     │
  │  1. Set API key (see below)      │
  │  2. Run: claude "hola pedrito"   │
  │  3. Try: /sdd-new mi-feature     │
  │                                  │
  │  Memory: Engram running ✓        │
  │  Code Review: GGA ready ✓        │
  └─────────────────────────────────┘
```

### Estructura del Instalador

```
packages/installer/
├── src/
│   ├── main.ts                   ← CLI entry + commander.js
│   ├── tui/
│   │   ├── App.tsx               ← Ink root component
│   │   ├── screens/
│   │   │   ├── Welcome.tsx
│   │   │   ├── SystemScan.tsx
│   │   │   ├── AgentSelect.tsx
│   │   │   ├── PresetSelect.tsx
│   │   │   ├── CustomConfig.tsx
│   │   │   ├── Review.tsx
│   │   │   ├── Installing.tsx
│   │   │   └── Complete.tsx
│   │   └── components/
│   │       ├── Checkbox.tsx
│   │       ├── ProgressBar.tsx
│   │       └── StatusLine.tsx
│   ├── system/
│   │   ├── detect.ts             ← OS, arch, WSL, Termux detection
│   │   ├── deps.ts               ← Dependency detection + installation
│   │   └── exec.ts               ← Command execution con logging
│   ├── agents/
│   │   ├── agent.interface.ts
│   │   ├── claude-code.ts
│   │   ├── opencode.ts
│   │   ├── gemini-cli.ts
│   │   ├── codex.ts
│   │   ├── cursor.ts
│   │   ├── vscode.ts
│   │   ├── windsurf.ts
│   │   ├── jetbrains.ts
│   │   ├── zed.ts
│   │   ├── xcode.ts
│   │   └── antigravity.ts    ← Minimal tier — stub extensible cuando estabilice API
│   ├── components/
│   │   ├── engram.ts             ← Engram install + configure per agent
│   │   ├── gga.ts                ← GGA install + provider config
│   │   ├── sdd.ts                ← SDD skills + orchestrator config
│   │   ├── mcp.ts                ← MCP server configuration
│   │   ├── skills.ts             ← Skills library install
│   │   └── persona.ts            ← Persona, theme, permissions
│   ├── presets/
│   │   ├── full-pedrito.ts
│   │   ├── ecosystem-only.ts
│   │   ├── minimal.ts
│   │   └── preset.interface.ts
│   └── backup/
│       └── backup.ts             ← Backup & restore
└── package.json
```

### Modo No-Interactivo (CI/CD)

```bash
pedrito install \
  --agents claude-code,opencode \
  --preset full-pedrito \
  --skills all \
  --mcp context7 \
  --non-interactive \
  --yes
```

**Criterio de éxito:**
- `pedrito install` funciona en macOS Apple Silicon, macOS Intel, Ubuntu, WSL2
- TUI responde fluido con Ink
- Modo `--non-interactive` funciona para onboarding de equipos
- Cada agente se configura correctamente según su tier

---

## Fase 4: Context7 y MCP en Producción (3-4 días)

### Objetivo
Que `pedrito install` configure Context7 y otros MCPs en los archivos de configuración correctos de cada agente. No solo mencionarlo en reglas.

### Qué se Configura por Agente

**Claude Code (`~/.claude.json`):**
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
      "url": "http://localhost:7437/mcp"
    }
  }
}
```

**OpenCode (`~/.config/opencode/opencode.json`):**
```json
{
  "mcp": {
    "context7": { "type": "remote", "url": "https://mcp.context7.com/sse" },
    "engram": { "type": "sse", "url": "http://localhost:7437/mcp" }
  }
}
```

**Gemini CLI (`~/.gemini/settings.json`):**
```json
{
  "mcpServers": {
    "engram": { "httpUrl": "http://localhost:7437/mcp" }
  }
}
```

**Cursor:** MCP via `~/.cursor/mcp.json` (mismo formato que Claude Code)

### MCP Servers Soportados

| Server | Tipo | Auth | Priority |
|---|---|---|---|
| Context7 | Remote HTTP | Sin auth | P0 — instalar siempre |
| Engram | Local SSE | Sin auth | P0 — si Engram está corriendo |
| Notion | Remote HTTP | Token (usuario configura) | P1 |
| Jira | Remote HTTP | Token (usuario configura) | P1 |
| Custom | Varies | Usuario define | P2 |

**Criterio de éxito:**
- `pedrito install` configura Context7 en todos los agentes seleccionados
- Engram expone endpoint MCP en `localhost:7437/mcp`
- El agente puede llamar `use context7` y obtener docs actualizadas

---

## Fase 5: Backup & Restore (2-3 días)

### Objetivo
Antes de cualquier modificación a configs de agentes, crear backup timestamped. Soporte de restore completo.

### Implementación

```typescript
// packages/installer/src/backup/backup.ts

export interface BackupManifest {
  id: string;
  timestamp: string;
  agents: string[];
  files: { source: string; backup: string }[];
}

export class BackupManager {
  private backupDir = path.join(os.homedir(), '.pedrito', 'backups');

  async create(label: string): Promise<BackupManifest>
  async restore(backupId: string): Promise<void>
  async list(): Promise<BackupManifest[]>
  async delete(backupId: string): Promise<void>
  async prune(keepLast: number = 5): Promise<void>
}
```

### Estructura de Backups

```
~/.pedrito/
├── backups/
│   ├── 2026-03-21T10:30:00-pre-install/
│   │   ├── manifest.json
│   │   ├── claude/CLAUDE.md
│   │   ├── claude/settings.json
│   │   └── opencode/opencode.json
│   └── 2026-03-22T14:00:00-pre-update/
│       └── ...
├── engram.db         ← Symlink a ~/.engram/engram.db
└── config.json       ← Config de Pedrito installer
```

### CLI Commands

```bash
pedrito backup list              # Listar backups disponibles
pedrito backup restore <id>      # Restaurar backup específico
pedrito backup restore --latest  # Restaurar el más reciente
pedrito backup delete <id>       # Eliminar backup
pedrito backup prune --keep 5    # Mantener solo los últimos 5
```

**Criterio de éxito:**
- Ninguna instalación modifica configs sin crear backup primero
- `pedrito backup restore --latest` deja el sistema exactamente como estaba
- Los backups tienen nombres descriptivos con timestamp

---

## Fase 6: Team Sharing & Perfiles (1 semana)

### Objetivo
Exportar la configuración actual como perfil compartible. Importar perfiles de equipo para onboarding en 1 comando.

### Formato del Perfil

```json
// pedrito-profile.json
{
  "version": "4.0",
  "name": "Full Stack Team Profile",
  "description": "Configuración estándar del equipo",
  "agents": ["claude-code", "opencode"],
  "preset": "full-pedrito",
  "skills": {
    "categories": ["frontend", "typescript", "testing"],
    "custom": ["mi-skill-especial"]
  },
  "mcp": {
    "servers": ["context7", "notion"],
    "notionToken": null    // null = el usuario debe configurar
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

### CLI Commands

```bash
pedrito profile export            # Exportar perfil actual
pedrito profile export --output team-profile.json
pedrito profile import team-profile.json
pedrito profile import https://raw.github.com/.../profile.json
pedrito profile list              # Perfiles guardados localmente
```

### Registry de Perfiles (Futuro)

```bash
pedrito profile publish my-profile.json   # Publicar al registry
pedrito profile search "fullstack"         # Buscar perfiles públicos
pedrito profile install username/profilename
```

**Criterio de éxito:**
- Un nuevo desarrollador del equipo puede hacer `pedrito profile import team-profile.json` y tener el entorno completo en <5 minutos
- El perfil no contiene API keys ni tokens sensibles
- Los perfiles son reproducibles entre máquinas

---

## Fase 7: Distribución Profesional (1 semana)

### Objetivo
Que Pedrito sea instalable via `brew install`, `curl`, y binarios directos. Sin necesidad de tener Bun o Node instalado.

### Método 1: Binario único con Bun

```bash
# Compilar para cada plataforma
bun build --compile --target=bun-macos-arm64 ./packages/installer/src/main.ts --outfile pedrito
bun build --compile --target=bun-macos-x64   ./packages/installer/src/main.ts --outfile pedrito
bun build --compile --target=bun-linux-x64   ./packages/installer/src/main.ts --outfile pedrito
bun build --compile --target=bun-windows-x64 ./packages/installer/src/main.ts --outfile pedrito.exe

# Compilar Engram server
bun build --compile --target=bun-macos-arm64 ./packages/engram/src/main.ts --outfile pedrito-engram
# etc.

# Compilar GGA
bun build --compile --target=bun-macos-arm64 ./packages/gga/src/main.ts --outfile gga
# etc.
```

### Método 2: Curl Installer (como Gentleman)

```bash
curl -sL install.pedrito.dev | sh
```

```bash
#!/usr/bin/env bash
# scripts/install.sh — curl installer

PEDRITO_VERSION="4.0.0"
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

# Detectar plataforma
case "$ARCH" in
  arm64|aarch64) ARCH="arm64" ;;
  x86_64|amd64)  ARCH="x64" ;;
esac

BASE_URL="https://github.com/tu-user/pedrito/releases/download/v${PEDRITO_VERSION}"

# Descargar + verificar checksum
curl -sL "${BASE_URL}/pedrito-${OS}-${ARCH}" -o /tmp/pedrito
curl -sL "${BASE_URL}/pedrito-${OS}-${ARCH}.sha256" -o /tmp/pedrito.sha256
sha256sum --check /tmp/pedrito.sha256 || { echo "Checksum failed"; exit 1; }

# Instalar
chmod +x /tmp/pedrito
mv /tmp/pedrito /usr/local/bin/pedrito

# Arrancar
pedrito install
```

### Método 3: Homebrew Tap

```ruby
# Formula/pedrito.rb en tap repo (pedrito-tap)
class Pedrito < Formula
  desc "AI Agent Workspace Kit — governance meets real tooling"
  homepage "https://github.com/tu-user/pedrito"
  version "4.0.0"

  on_macos do
    on_arm do
      url "https://github.com/tu-user/pedrito/releases/download/v4.0.0/pedrito-macos-arm64.tar.gz"
      sha256 "..."
    end
    on_intel do
      url "https://github.com/tu-user/pedrito/releases/download/v4.0.0/pedrito-macos-x64.tar.gz"
      sha256 "..."
    end
  end

  def install
    bin.install "pedrito"
    bin.install "pedrito-engram"
    bin.install "gga"
  end
end
```

```bash
brew tap tu-user/pedrito
brew install pedrito
```

### Release Automation (GitHub Actions)

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags: ['v*']

jobs:
  build:
    strategy:
      matrix:
        include:
          - os: macos-latest,  target: bun-macos-arm64
          - os: macos-13,      target: bun-macos-x64
          - os: ubuntu-latest, target: bun-linux-x64
          - os: windows-latest, target: bun-windows-x64

    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run build:${{ matrix.target }}
      - uses: actions/upload-artifact@v4
```

**Criterio de éxito:**
- `brew install tu-user/pedrito/pedrito` funciona en macOS
- `curl -sL install.pedrito.dev | sh` funciona en Ubuntu y macOS
- Los binarios tienen checksum verificable
- El CI genera release automáticamente al crear un tag

---

## Fase 8: Self-Update & Mantenimiento (3-4 días)

### Objetivo
Que Pedrito pueda actualizarse a sí mismo, actualizar skills, y actualizar Engram desde un solo comando.

### CLI Commands

```bash
pedrito update              # Actualizar el binario de Pedrito
pedrito update --skills     # Actualizar skills para todos los agentes configurados
pedrito update --engram     # Actualizar Engram al latest
pedrito update --all        # Todo lo anterior
pedrito version             # Mostrar versiones: pedrito, engram, gga, kit
```

### Sincronización de Skills

```bash
# Cuando se actualiza un skill, se sincroniza a todos los agentes configurados:
# ~/.claude/skills/sdd-manager.md
# ~/.config/opencode/skill/sdd-manager.md
# ~/.cursor/skills/sdd-manager.md
# etc.
```

### Config Sync entre Machines

```bash
pedrito sync --to ~/.pedrito/profile.json    # Export
pedrito sync --from ~/.pedrito/profile.json  # Import
pedrito sync --github-gist                   # Sync via GitHub Gist (privado)
```

---

## Fase 9: Polish de Pedrito Core (1 semana)

### Objetivo
Mantener y mejorar lo mejor de Pedrito que Gentleman no tiene: gobernanza SDD, skill tiers, Engram memory rules, y la arquitectura source/runtime.

### 9.1 Skills Adicionales (inspirados en Gentleman)

Agregar skills que Pedrito no tiene pero Gentleman sí menciona:

| Skill Nuevo | Propósito |
|---|---|
| `react-19` | Best practices React 19 específicas |
| `nextjs-15` | App Router, Server Actions, RSC patterns |
| `tailwind-4` | Nueva API de Tailwind v4 |
| `zod-4` | Validación con Zod v4 |
| `ai-sdk-5` | Vercel AI SDK v5 patterns |
| `playwright` | E2E testing con Playwright |
| `pr-review` | Cómo hacer code reviews de PRs |

### 9.2 Mejoras al AGENTS.md

```markdown
## Engram Protocol
- Start: GET /observations/context?project=<name>
- Search: GET /observations/search?q=<topic>
- Save: POST /observations (type: decision|pattern|bug|convention)
- End session: PATCH /sessions/<id> with summary

## GGA Integration
- Every commit goes through GGA pre-commit hook
- Standards defined in AGENTS.md Section "Coding Standards"
- Override for WIP commits: git commit --no-verify (with reason in message)

## Context7
- Use for: React, Next.js, TypeScript, any volatile/modern API docs
- MCP tool: use_mcp_tool with server_name: "context7"
```

### 9.3 SDD Enhancement — Skills Discretos

Gentleman tiene 9 SDD skills separados (`sdd-init`, `sdd-explore`, etc.). Pedrito tiene un solo `sdd-manager` monolítico. Separar en skills discretos mejora la composabilidad:

| Skill | Fase SDD |
|---|---|
| `sdd-init` | Bootstrap SDD en un proyecto |
| `sdd-explore` | Fase 2: Exploración |
| `sdd-propose` | Fase 3: Propuesta |
| `sdd-spec` | Fase 4: Especificación formal |
| `sdd-design` | Fase 5: Diseño técnico |
| `sdd-tasks` | Fase 6: Desglose de tareas |
| `sdd-apply` | Fase 7: Implementación |
| `sdd-verify` | Fase 8: Verificación |
| `sdd-archive` | Fase 9: Archivo |

### 9.4 Personas — Sistema de Selección

Agregar sistema de persona como first-class feature (actualmente hardcoded en reglas):

```markdown
<!-- .agent/personas/pedrito-mode.md -->
---
name: pedrito-mode
displayName: "Tu propio Pedrito"
description: "Senior Architect mentor que enseña, desafía y exige entender antes de escribir código"
language: "Spanish (Rioplatense) for Spanish input, English otherwise"
---

## Persona

Soy Pedrito, tu Senior Architect personal. Trabajo como mentor...
[resto de la persona]
```

Presets de persona:
- **Pedrito Mode** — Mentor Senior, español rioplatense, pushback en malas prácticas
- **Neutral Mode** — Sin personalidad overlay, comportamiento default
- **Custom** — El usuario trae su propia persona

---

## Resumen de Fases y Prioridades

| Fase | Qué construyes | Impacto | Tiempo est. |
|---|---|---|---|
| **0** | Monorepo TS+Bun + Agent Interface | Foundation | 2-3 días |
| **1** | Engram real (SQLite + FTS5 + REST) | **Crítico** | 1-2 semanas |
| **2** | GGA — Guardian Angel (pre-commit AI review) | **Crítico** | 1 semana |
| **3** | Instalador TUI (Ink) + multi-agente | Alto | 2 semanas |
| **4** | Context7 + MCP en producción | Alto | 3-4 días |
| **5** | Backup & Restore | Medio-Alto | 2-3 días |
| **6** | Team Sharing & Perfiles | Medio | 1 semana |
| **7** | Distribución (Homebrew + curl + binarios) | Medio | 1 semana |
| **8** | Self-update & Skills sync | Medio | 3-4 días |
| **9** | Polish Core (skills nuevos, SDD discreto, personas) | Bajo | 1 semana |

**Total estimado: 8-10 semanas** para Pedrito V4 completo.
**MVP mínimo viable (Fases 0-4): 4-5 semanas.**

---

## Lo que Pedrito Conserva y Potencia

Esto es lo que Pedrito tiene y Gentleman NO tiene (o tiene menos desarrollado):

| Feature | Pedrito Advantage |
|---|---|
| **Gobernanza de 10 reglas** | Marco completo: seguridad, arquitectura, deploy, memoria, contexto, activación |
| **SDD de 9 fases** | Ciclo auditable completo con artifacts en `specs/` |
| **Skill tiers (1 y 2)** | Priorización inteligente del contexto según costo y relevancia |
| **Arquitectura source/runtime** | Separación entre `core/` (source kit) y `.agent/` (runtime por proyecto) |
| **Engram como arquitectura de conocimiento** | Decisiones, patrones, lecciones, incidentes — más estructurado que solo sesiones |
| **Runtime contract (AGENTS.md)** | Documento único que gobierna TODO el comportamiento del agente |
| **Context window discipline** | Reglas específicas de optimización del contexto (07_context_optimization_rules.md) |
| **Approval gates explícitos** | Qué puede hacer el agente solo vs. qué requiere confirmación |

---

## Stack Final Recomendado

```
pedrito/
├── packages/
│   ├── engram/          TypeScript + Bun + Hono + bun:sqlite (FTS5)
│   ├── gga/             TypeScript + Bun (compila a bash-compatible binary)
│   └── installer/       TypeScript + Bun + Ink (React TUI)
├── kit/
│   ├── core/            Markdown (governance rules) ← mantener
│   ├── skills/          Markdown (skill definitions) ← expandir
│   ├── workflows/       Markdown (SDD workflows) ← expandir
│   ├── specs/           Markdown (SDD artifacts) ← mantener
│   └── docs/            Markdown (documentation) ← mantener
└── scripts/             Bash (backwards compat helpers)
```

**Runtime por proyecto (post-install):**
```
proyecto-del-usuario/
├── .agent/              ← Runtime instalado por pedrito init
│   ├── core/            ← Governance rules
│   ├── skills/          ← Skills del agente
│   ├── workflows/       ← Workflow definitions
│   └── registry/        ← Skill activation index
├── docs/engram/         ← Knowledge base del proyecto (Markdown, promotable a DB)
├── specs/               ← SDD artifacts
└── AGENTS.md            ← Runtime contract
```

**Infraestructura global del usuario:**
```
~/.pedrito/
├── engram.db            ← Base de datos Engram (SQLite + FTS5)
├── config.json          ← Configuración global de Pedrito
├── backups/             ← Backups timestamped de configs de agentes
└── profiles/            ← Perfiles guardados localmente

~/.pedrito-engram/       ← (o ~/.engram/) Directorio del servidor
├── engram.db
└── engram.pid

/usr/local/bin/
├── pedrito              ← Installer + CLI principal
├── pedrito-engram       ← Servidor de memoria (demonio)
└── gga                  ← Guardian Angel (pre-commit hook)
```

---

*Pedrito V4 — donde la gobernanza se encuentra con las herramientas reales.*
