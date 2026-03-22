import { join, resolve } from 'path';
import { existsSync } from 'fs';
import { BackupManager } from './backup/backup.js';
import { installProjectRuntime } from './components/project.js';
import { configureClaudeCode } from './components/claude.js';
import { ConfigStore } from './config/config-store.js';
import { detectSystem } from './system/detect.js';
import { getPreset } from './presets/index.js';
import { MCP_SERVERS } from './mcp/catalog.js';

export interface InstallState {
  projectPath: string;
  presetName: string;
  agents: string[];
  persona?: string;
}

export interface InstallReport {
  backupId: string;
  preset: string;
  projectPath: string;
  configuredAgents: string[];
}

export async function runInstall(state: InstallState): Promise<InstallReport> {
  const system = detectSystem();
  const repoRoot = resolveRepoRoot();
  const kitPath = join(repoRoot, 'kit');
  const projectPath = resolve(state.projectPath);
  const preset = getPreset(state.presetName);
  const personaName = state.persona ?? (preset.includePersona ? 'pedrito-mode' : 'neutral-mode');
  const includePersona = preset.includePersona || Boolean(state.persona);

  const backupManager = new BackupManager();
  const configStore = new ConfigStore();
  const backup = backupManager.create('install', [
    join(projectPath, '.agent'),
    join(projectPath, 'AGENTS.md'),
    join(system.homeDir, '.claude'),
  ]);

  installProjectRuntime(kitPath, projectPath);

  const configuredAgents: string[] = [];
  for (const agent of state.agents) {
    if (agent !== 'claude-code') {
      throw new Error(`Unsupported agent for MVP installer: ${agent}`);
    }

    configureClaudeCode({
      homeDir: system.homeDir,
      kitPath,
      repoRoot,
      includePersona,
      personaName,
      includeEngram: preset.includeEngram,
      includeGGA: preset.includeGGA,
      includeMCP: preset.includeMCP,
    });
    configuredAgents.push(agent);
  }

  configStore.write({
    version: '4.0.0',
    installedAt: new Date().toISOString(),
    agents: configuredAgents,
    preset: preset.name,
    persona: includePersona ? personaName : undefined,
    mcp: preset.includeMCP ? MCP_SERVERS.map((server) => server.name) : [],
    gga: preset.includeGGA,
    kitPath,
  });

  return {
    backupId: backup.id,
    preset: preset.name,
    projectPath,
    configuredAgents,
  };
}

function resolveRepoRoot(): string {
  const cwd = process.cwd();
  if (existsSync(join(cwd, 'kit')) && existsSync(join(cwd, 'packages'))) {
    return cwd;
  }

  const fromSource = resolve(import.meta.dir, '..', '..', '..');
  if (existsSync(join(fromSource, 'kit')) && existsSync(join(fromSource, 'packages'))) {
    return fromSource;
  }

  return cwd;
}
