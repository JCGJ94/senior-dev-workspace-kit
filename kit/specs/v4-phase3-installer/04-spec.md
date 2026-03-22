# Spec Técnica — V4 Phase 3: Installer con TUI

## Stack

- **Runtime:** Bun (TypeScript + TSX/JSX)
- **TUI:** Ink v5 + React 18
- **CLI parsing:** Commander.js (`commander`)
- **Validación:** Zod (ya en deps)
- **File I/O:** Node.js `fs/promises` + Bun built-ins
- **Build:** `bun build src/main.ts --compile --outfile dist/pedrito`

> Nota: Ink requiere JSX. El tsconfig debe incluir `"jsx": "react-jsx"` y los archivos TUI usan extensión `.tsx`.

---

## Arquitectura general

```
pedrito install
      │
      ├── [TUI mode]           ← default si TTY disponible
      │     App.tsx
      │       Welcome → SystemScan → AgentSelect → PresetSelect
      │       → CustomConfig? → Review → Installing → Complete
      │
      └── [Non-interactive]    ← --non-interactive flag
            Parsear flags → validar → ejecutar instalación directa
```

El instalador orquesta **componentes** (Engram, GGA, SDD, MCP, Skills, Persona) sobre **agentes** (Claude Code, OpenCode, etc.) usando los **presets** como matrices de qué componentes activar por agente.

---

## Estructura de Archivos

```
packages/installer/
├── src/
│   ├── main.ts                        ← CLI entrypoint (commander)
│   ├── version.ts                     ← VERSION constant (ya existe)
│   │
│   ├── tui/
│   │   ├── App.tsx                    ← Root con máquina de estados de screens
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
│   │       ├── Checkbox.tsx           ← Checkbox list con navegación por teclado
│   │       ├── ProgressBar.tsx        ← Barra de progreso ASCII
│   │       └── StatusLine.tsx         ← Línea con ✓/✗/◌ + texto
│   │
│   ├── system/
│   │   ├── detect.ts                  ← OS, arch, WSL, Termux detection
│   │   ├── deps.ts                    ← Detección de deps (bun, git, claude, etc.)
│   │   └── exec.ts                    ← spawnSync wrapper con logging
│   │
│   ├── agents/
│   │   ├── agent.interface.ts         ← Ya existe (Fase 0) — no modificar
│   │   ├── claude-code.ts
│   │   ├── opencode.ts
│   │   ├── gemini-cli.ts
│   │   ├── codex.ts
│   │   ├── cursor.ts
│   │   ├── vscode.ts
│   │   ├── windsurf.ts
│   │   ├── jetbrains.ts
│   │   ├── zed.ts
│   │   └── antigravity.ts             ← Minimal tier stub
│   │
│   ├── components/
│   │   ├── engram.ts                  ← Install Engram + configurar por agente
│   │   ├── gga.ts                     ← Install GGA + provider config
│   │   ├── sdd.ts                     ← SDD skills + orchestrator config
│   │   ├── mcp.ts                     ← MCP server configuration
│   │   ├── skills.ts                  ← Skills library install
│   │   └── persona.ts                 ← Persona, theme, permissions
│   │
│   ├── presets/
│   │   ├── preset.interface.ts
│   │   ├── full-pedrito.ts
│   │   ├── ecosystem-only.ts
│   │   └── minimal.ts
│   │
│   ├── backup/
│   │   └── backup.ts                  ← BackupManager
│   │
│   └── index.test.ts
│
├── package.json
└── tsconfig.json
```

---

## Módulos — Detalle

### `system/detect.ts`

```typescript
interface SystemInfo {
  os: 'macos' | 'linux' | 'windows';
  arch: 'arm64' | 'x64';
  isWSL: boolean;
  isTermux: boolean;
  homeDir: string;
  shell: string;
}

function detectSystem(): SystemInfo
```

### `system/deps.ts`

```typescript
interface DepStatus {
  name: string;
  installed: boolean;
  version?: string;
  path?: string;
}

// Detecta: bun, git, claude (CLI), opencode, gemini, codex, ollama, gh
function detectDeps(): DepStatus[]
function checkDep(name: string): DepStatus
```

### `agents/` — Implementaciones

Cada agente implementa `Agent` de `agent.interface.ts`. Ejemplo para Claude Code:

```typescript
// agents/claude-code.ts
export class ClaudeCodeAgent implements Agent {
  name() { return 'Claude Code'; }
  tier(): SupportTier { return 'full'; }

  async detect(): Promise<DetectionResult> {
    // Busca 'claude' en PATH + verifica ~/.claude/
  }

  async install(ctx: InstallContext): Promise<void> {
    // Copia CLAUDE.md a ~/.claude/CLAUDE.md
    // Copia skills a ~/.claude/skills/ (o via CLAUDE.md include)
  }

  async configureEngram(): Promise<void> {
    // Añade hooks en ~/.claude/settings.json (PreToolUse, Stop)
    // Escribe ~/.claude/CLAUDE_ENGRAM.md con instrucciones
  }

  async configureMCP(servers: MCPServer[]): Promise<void> {
    // Edita ~/.claude.json → mcpServers
  }

  async configureSkills(skills: Skill[]): Promise<void> {
    // Copia skills a ~/.claude/skills/
  }

  async configureSDD(): Promise<void> {
    // Incluye SDD orchestrator skill en CLAUDE.md
  }

  async configurePersona(persona: Persona): Promise<void> {
    // Añade persona rules al CLAUDE.md
  }

  async configureTheme(theme: Theme): Promise<void> {
    // settings.json → theme
  }

  async configurePermissions(perms: Permissions): Promise<void> {
    // settings.json → permissions
  }

  async configureGGA(provider: GGAProvider): Promise<void> {
    // Escribe .gga en el directorio del proyecto
  }

  async verify(): Promise<VerificationResult> {
    // Verifica que CLAUDE.md existe, skills presentes, etc.
  }

  configPaths() { return ['~/.claude/', '~/.claude.json']; }
  capabilities() { return ['engram','mcp','skills','sdd','persona','theme','permissions','gga']; }
}
```

**Tiers y capabilities por agente:**

| Agente | Tier | Capabilities |
|---|---|---|
| Claude Code | full | engram, mcp, skills, sdd, persona, theme, permissions, gga |
| OpenCode | full | engram, mcp, skills, sdd, persona, gga |
| Gemini CLI | good | skills, mcp, persona, gga |
| Codex | good | skills, persona, gga |
| Cursor | good | skills, mcp, gga, persona |
| VSCode | good | skills, mcp, gga |
| Windsurf | partial | skills, persona |
| JetBrains | partial | skills, persona |
| Zed | partial | skills, persona |
| Antigravity | minimal | persona (stub — API inestable) |

### `presets/preset.interface.ts`

```typescript
interface PresetConfig {
  name: string;
  description: string;
  components: {
    engram: boolean;
    gga: boolean;
    sdd: boolean;
    mcp: string[];       // ['context7', 'engram']
    skills: 'all' | 'core' | string[];
    persona: boolean;
  };
}
```

**Presets definidos:**

| Preset | Engram | GGA | SDD | MCP | Skills | Persona |
|---|---|---|---|---|---|---|
| `full-pedrito` | ✓ | ✓ | ✓ | context7 + engram | all | ✓ |
| `ecosystem-only` | ✓ | ✓ | ✓ | context7 + engram | all | ✗ |
| `minimal` | ✓ | ✗ | ✗ | engram | core | ✗ |
| `custom` | usuario | usuario | usuario | usuario | usuario | usuario |

### `backup/backup.ts`

```typescript
interface BackupManifest {
  id: string;               // timestamp ISO
  label: string;            // ej. "pre-install"
  timestamp: string;
  agents: string[];
  files: { source: string; backup: string }[];
}

class BackupManager {
  private backupDir = '~/.pedrito/backups/';

  async create(label: string, agents: Agent[]): Promise<BackupManifest>
  async restore(backupId: string): Promise<void>
  async list(): Promise<BackupManifest[]>
  async prune(keepLast = 5): Promise<void>
}
```

### `tui/App.tsx` — Máquina de estados

```typescript
type Screen =
  | 'welcome'
  | 'system-scan'
  | 'agent-select'
  | 'preset-select'
  | 'custom-config'
  | 'review'
  | 'installing'
  | 'complete'
  | 'error';

// Estado compartido entre screens
interface InstallState {
  system: SystemInfo;
  deps: DepStatus[];
  selectedAgents: Agent[];
  preset: PresetConfig;
  customConfig?: Partial<PresetConfig['components']>;
}
```

### `main.ts` — CLI Commands

```bash
pedrito install [options]
  --agents <list>        Agentes separados por coma: claude-code,opencode
  --preset <name>        full-pedrito | ecosystem-only | minimal | custom
  --skills <list>        all | core | lista específica
  --mcp <list>           Servidores MCP: context7,engram
  --gga-provider <name>  Provider para GGA: claude | ollama | gemini
  --non-interactive      No mostrar TUI, usar flags
  --yes                  Auto-confirmar sin prompts
  --dry-run              Mostrar qué haría sin ejecutar nada
  --kit-path <path>      Path al kit (default: ~/.pedrito/kit/)

pedrito doctor           Estado de todos los componentes
pedrito update           Actualizar kit a la última versión
pedrito backup list      Listar backups
pedrito backup restore   Restaurar backup
pedrito version          Mostrar versión
```

---

## Flujo de instalación — orquestación

```typescript
async function runInstall(state: InstallState): Promise<void> {
  const backup = new BackupManager();

  // 1. Backup de configs existentes
  await backup.create('pre-install', state.selectedAgents);

  for (const agent of state.selectedAgents) {
    const components = state.preset.components;

    // 2. Install base (CLAUDE.md / equivalente)
    await agent.install({ kitPath, targetPath });

    // 3. Componentes según preset
    if (components.engram)   await agent.configureEngram();
    if (components.sdd)      await agent.configureSDD();
    if (components.persona)  await agent.configurePersona(pedritoPersona);
    if (components.gga)      await agent.configureGGA(gga_provider);

    if (components.mcp.length)
      await agent.configureMCP(resolveMCPServers(components.mcp));

    if (components.skills)
      await agent.configureSkills(resolveSkills(components.skills));

    // 4. Verificar
    const result = await agent.verify();
    if (!result.success) throw new InstallError(agent, result.errors);
  }
}
```

---

## package.json — Cambios necesarios

```json
{
  "scripts": {
    "build": "bun build src/main.ts --compile --outfile dist/pedrito",
    "build:dev": "bun build src/main.ts --outdir dist",
    "test": "bun test",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "commander": "^12.0.0",
    "ink": "^5.0.0",
    "react": "^18.0.0",
    "zod": "^3.22.0"
  }
}
```

### tsconfig.json — Cambios necesarios

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

---

## Decisiones de Diseño

### ¿Por qué Ink y no una TUI en terminal puro?
Ink usa el modelo de componentes React para renderizar en terminal. El equipo ya conoce React. Los componentes son testeables, composables y mantenibles. La alternativa (ANSI escape sequences manuales) sería frágil y difícil de mantener para una TUI con múltiples pantallas.

### ¿Por qué `bun build --compile` y no distribución como script npm?
Un binario compilado no requiere que el usuario tenga Bun instalado para ejecutarlo. Es distribuible como release de GitHub Actions y funciona como `curl | sh` para instalación rápida.

### ¿Por qué BackupManager en esta fase y no en Fase 5 del roadmap?
El roadmap pone Backup en Fase 5, pero modificar configs sin backup es inaceptable desde el primer día que el instalador sea funcional. Se implementa la versión mínima (create + restore --latest) en esta fase. Las features avanzadas (prune, list detallado) van en Fase 5.

### ¿Por qué `verify()` después de cada agente y no al final?
Falla rápido. Si Claude Code falla en verificación, no tiene sentido continuar con OpenCode. El usuario ve el error mientras el contexto está fresco.

### ¿Qué pasa con `--dry-run`?
Cada `Agent` recibe un flag `dryRun` en el `InstallContext`. En dry-run, los métodos loguean lo que harían sin ejecutar ningún cambio en disco.

---

## Criterios de Verificación

| # | Check | Cómo verificar |
|---|---|---|
| 1 | `bun build` produce binario `dist/pedrito` | `ls -la packages/installer/dist/pedrito` |
| 2 | TUI abre y navega entre todas las pantallas | Ejecutar `pedrito install` en terminal |
| 3 | `--non-interactive --yes` completa sin input | Script de test automatizado |
| 4 | Claude Code queda configurado con skills + MCP + Engram | `pedrito doctor` después de instalar |
| 5 | Backup creado en `~/.pedrito/backups/` | `pedrito backup list` |
| 6 | `pedrito backup restore --latest` revierte cambios | Verificar que configs originales vuelven |
| 7 | `pedrito doctor` muestra estado de cada componente | Output en terminal |
| 8 | `bun test` verde (unit tests de agents, presets, backup) | `bun test packages/installer` |
