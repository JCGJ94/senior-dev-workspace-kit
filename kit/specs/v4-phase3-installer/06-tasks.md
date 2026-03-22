# Phase 3 Tasks — Installer con TUI

## Setup del package

- [ ] **3.1** Actualizar `packages/installer/package.json`
  - Añadir `commander` a deps
  - Cambiar script `build` a `bun build src/main.ts --compile --outfile dist/pedrito`
  - Añadir `build:dev` para desarrollo sin compile

- [ ] **3.2** Actualizar `packages/installer/tsconfig.json`
  - Añadir `"jsx": "react-jsx"` y `"jsxImportSource": "react"`

## System detection

- [ ] **3.3** Crear `packages/installer/src/system/detect.ts`
  - Interface `SystemInfo` (os, arch, isWSL, isTermux, homeDir, shell)
  - `detectSystem(): SystemInfo`
  - Detectar macOS vs Linux vs Windows, ARM64 vs x64, WSL2 via `/proc/version`

- [ ] **3.4** Crear `packages/installer/src/system/deps.ts`
  - Interface `DepStatus` (name, installed, version?, path?)
  - `detectDeps(): DepStatus[]` — chequea: bun, git, claude, opencode, gemini, codex, ollama, gh
  - `checkDep(name): DepStatus`

- [ ] **3.5** Crear `packages/installer/src/system/exec.ts`
  - Wrapper sobre `Bun.spawnSync` con logging opcional y flag `dryRun`
  - `exec(cmd, args, opts): { stdout, stderr, exitCode }`

## Backup

- [ ] **3.6** Crear `packages/installer/src/backup/backup.ts`
  - Interface `BackupManifest`
  - Class `BackupManager` con métodos: `create`, `restore`, `list`, `prune`
  - Layout: `~/.pedrito/backups/<timestamp>-<label>/`
  - `create` copia todos los `configPaths()` de los agentes seleccionados
  - `restore` copia de vuelta los archivos del backup al destino original

## Presets

- [ ] **3.7** Crear `packages/installer/src/presets/preset.interface.ts`
  - Interface `PresetConfig` con campo `components`

- [ ] **3.8** Crear `packages/installer/src/presets/full-pedrito.ts`
  - Engram + GGA + SDD + MCP (context7 + engram) + skills all + persona

- [ ] **3.9** Crear `packages/installer/src/presets/ecosystem-only.ts`
  - Engram + GGA + SDD + MCP (context7 + engram) + skills all, sin persona

- [ ] **3.10** Crear `packages/installer/src/presets/minimal.ts`
  - Solo Engram + skills core, sin GGA/SDD/MCP/persona

## Components

- [ ] **3.11** Crear `packages/installer/src/components/engram.ts`
  - `installEngram(kitPath): Promise<void>` — copia/linka el binario engram
  - Configura autostart (launchd en macOS, systemd user en Linux)
  - Genera `CLAUDE_ENGRAM.md` con instrucciones de uso

- [ ] **3.12** Crear `packages/installer/src/components/gga.ts`
  - `installGGA(kitPath): Promise<void>` — copia/linka el binario gga
  - Genera `.gga` config con el provider seleccionado

- [ ] **3.13** Crear `packages/installer/src/components/mcp.ts`
  - `resolveMCPServers(names: string[]): MCPServer[]`
  - Definiciones de Context7, Engram MCP SSE
  - Utilidades para escribir configs en los paths correctos por agente

- [ ] **3.14** Crear `packages/installer/src/components/skills.ts`
  - `resolveSkills(spec: 'all' | 'core' | string[]): Skill[]`
  - Lee `kit/registry/skill_manifest.json` para el catálogo
  - Copia los skills seleccionados al destino del agente

- [ ] **3.15** Crear `packages/installer/src/components/sdd.ts`
  - `configureSDD(agentConfigPath: string): Promise<void>`
  - Copia el SDD orchestrator skill + spec templates

- [ ] **3.16** Crear `packages/installer/src/components/persona.ts`
  - `buildPersonaRules(): string` — genera bloque de reglas de Pedrito persona
  - Para inyectar en CLAUDE.md o equivalente de cada agente

## Agent implementations

- [ ] **3.17** Crear `packages/installer/src/agents/claude-code.ts`
  - Tier: full — implementar todos los métodos de `Agent`
  - `detect`: busca `claude` en PATH + `~/.claude/`
  - `install`: copia CLAUDE.md base a `~/.claude/CLAUDE.md`
  - `configureEngram`: hooks en `~/.claude/settings.json` + CLAUDE_ENGRAM.md
  - `configureMCP`: edita `~/.claude.json` → mcpServers
  - `configureSkills`: copia skills a `~/.claude/skills/`
  - `configureSDD`, `configurePersona`, `configureTheme`, `configurePermissions`
  - `configureGGA`: escribe `.gga` en proyectos del usuario
  - `verify`: verifica CLAUDE.md, skills dir, settings.json

- [ ] **3.18** Crear `packages/installer/src/agents/opencode.ts`
  - Tier: full
  - Config path: `~/.config/opencode/opencode.json`
  - `configureMCP`: campo `mcp` en opencode.json
  - `configureSkills`: `~/.config/opencode/skill/`

- [ ] **3.19** Crear `packages/installer/src/agents/gemini-cli.ts`
  - Tier: good
  - Config path: `~/.gemini/settings.json`, `~/.gemini/system.md`
  - `configureMCP`: campo `mcpServers` en settings.json
  - `configureSkills`: inyectar en system.md

- [ ] **3.20** Crear `packages/installer/src/agents/codex.ts`
  - Tier: good
  - Config path: `~/.codex/config.toml`, `~/.codex/instructions.md`

- [ ] **3.21** Crear `packages/installer/src/agents/cursor.ts`
  - Tier: good
  - Config path: `~/.cursor/`, `.cursorrules`
  - `configureMCP`: `~/.cursor/mcp.json`

- [ ] **3.22** Crear `packages/installer/src/agents/vscode.ts`
  - Tier: good
  - Config: `.github/copilot-instructions.md` + `.vscode/settings.json`
  - `configureMCP`: settings.json MCP extension config

- [ ] **3.23** Crear `packages/installer/src/agents/windsurf.ts`
  - Tier: partial — solo skills + persona (vía rules)
  - Config path: `~/.windsurf/`

- [ ] **3.24** Crear `packages/installer/src/agents/jetbrains.ts`
  - Tier: partial — AI Assistant system prompt + plugin config
  - Detectar cuáles IDEs JetBrains están instalados

- [ ] **3.25** Crear `packages/installer/src/agents/zed.ts`
  - Tier: partial
  - Config path: `~/.config/zed/assistant.json`

- [ ] **3.26** Crear `packages/installer/src/agents/antigravity.ts`
  - Tier: minimal — stub con comentario de roadmap
  - `detect`: busca `antigravity` en PATH
  - Resto de métodos: throw `ErrNotSupported`

## TUI — Componentes base

- [ ] **3.27** Crear `packages/installer/src/tui/components/StatusLine.tsx`
  - Props: `status: 'ok' | 'error' | 'pending'`, `text: string`
  - Render: `✓ text` / `✗ text` / `◌ text` con colores via Ink

- [ ] **3.28** Crear `packages/installer/src/tui/components/ProgressBar.tsx`
  - Props: `percent: number`, `width?: number`
  - Render: `[████████░░] 80%`

- [ ] **3.29** Crear `packages/installer/src/tui/components/Checkbox.tsx`
  - Lista de items con checkbox, navegación con flechas, toggle con espacio
  - Props: `items: {label, value, checked, disabled}[]`, `onChange`

## TUI — Screens

- [ ] **3.30** Crear `packages/installer/src/tui/screens/Welcome.tsx`
  - Muestra nombre, versión y tagline
  - Espera Enter para continuar

- [ ] **3.31** Crear `packages/installer/src/tui/screens/SystemScan.tsx`
  - Ejecuta `detectSystem()` + `detectDeps()` al montar
  - Muestra OS, arch, y estado de cada dep con StatusLine
  - Continúa automáticamente cuando termina el scan

- [ ] **3.32** Crear `packages/installer/src/tui/screens/AgentSelect.tsx`
  - Checkbox list con todos los agentes disponibles
  - Los agentes detectados aparecen pre-seleccionados
  - Muestra tier (Full/Good/Partial/Minimal) junto a cada nombre

- [ ] **3.33** Crear `packages/installer/src/tui/screens/PresetSelect.tsx`
  - Lista de presets con descripción corta
  - Selección con flechas + Enter

- [ ] **3.34** Crear `packages/installer/src/tui/screens/CustomConfig.tsx`
  - Solo se muestra si preset = 'custom'
  - Checkboxes para cada componente (Engram, GGA, SDD, MCP, Skills, Persona)

- [ ] **3.35** Crear `packages/installer/src/tui/screens/Review.tsx`
  - Resumen de: agentes seleccionados, preset, componentes a instalar
  - Botones: [Install] [Back] [Cancel]

- [ ] **3.36** Crear `packages/installer/src/tui/screens/Installing.tsx`
  - Ejecuta `runInstall()` al montar
  - Muestra progreso por agente y componente con StatusLine + ProgressBar
  - Los pasos van actualizando de ◌ a ✓ o ✗ en tiempo real

- [ ] **3.37** Crear `packages/installer/src/tui/screens/Complete.tsx`
  - Muestra resumen final: qué se instaló, errores si los hay
  - Muestra next steps

## TUI — App root

- [ ] **3.38** Crear `packages/installer/src/tui/App.tsx`
  - Máquina de estados con `useState` para `currentScreen` + `installState`
  - Renderiza la screen activa pasando callbacks de navegación

## CLI y orquestación

- [ ] **3.39** Crear `packages/installer/src/main.ts`
  - Commander.js con todos los subcomandos definidos en spec
  - Detectar si es TTY → lanzar TUI, sino → modo non-interactive
  - `install`: orquesta `BackupManager` + `runInstall()`
  - `doctor`: llama `agent.verify()` en todos los agentes detectados
  - `backup list/restore`: delegar a `BackupManager`
  - `version`: imprimir VERSION
  - Eliminar el stub actual en `src/cli.ts` (reemplazado por main.ts)

- [ ] **3.40** Crear `packages/installer/src/orchestrator.ts`
  - Función `runInstall(state: InstallState, onProgress): Promise<InstallReport>`
  - Implementar el loop de backup → install → components → verify
  - Callback `onProgress` para que la TUI pueda actualizar en tiempo real

## Tests

- [ ] **3.41** Crear tests en `packages/installer/src/index.test.ts`
  - Test de `detectSystem()` — verifica campos básicos en el OS actual
  - Test de `BackupManager.create()` — crea backup, verifica manifest.json
  - Test de `BackupManager.restore()` — restaura y verifica que archivos vuelven
  - Test de preset `full-pedrito` — verifica que todos los componentes están habilitados
  - Test de `resolveSkills('core')` — devuelve lista no vacía
  - Test de `ClaudeCodeAgent.detect()` — sin necesitar claude instalado (mock PATH)

## Build y verificación

- [ ] **3.42** Ejecutar `bun install` en raíz para instalar `commander`
- [ ] **3.43** Ejecutar `bun test packages/installer` — todos los tests deben pasar
- [ ] **3.44** Ejecutar `bun run build` en `packages/installer` — produce `dist/pedrito`
- [ ] **3.45** Smoke test: `pedrito version` y `pedrito doctor` en terminal
- [ ] **3.46** Test TUI: `pedrito install` en macOS — navegar el flujo completo
- [ ] **3.47** Test non-interactive: `pedrito install --agents claude-code --preset minimal --non-interactive --yes`
- [ ] **3.48** Cerrar spec: completar `summary.md` y marcar status Complete

---

## Orden de implementación recomendado

```
Setup (3.1–3.2)
  → System (3.3–3.5)
  → Backup (3.6)
  → Presets (3.7–3.10)
  → Components (3.11–3.16)
  → Agents (3.17–3.26) ← en paralelo, empezar por claude-code
  → TUI components (3.27–3.29)
  → TUI screens (3.30–3.37) ← en orden de flujo
  → TUI App (3.38)
  → CLI + orchestrator (3.39–3.40)
  → Tests (3.41)
  → Build + verificación (3.42–3.48)
```

**MVP mínimo verificable:** 3.1–3.6 + 3.17 (Claude Code) + 3.39–3.40 en modo non-interactive.
Suficiente para reemplazar `setup.sh` para Claude Code antes de tener la TUI completa.
