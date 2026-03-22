import { cpSync, existsSync, readdirSync, statSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import type { ConfigStore } from '../config/config-store.js';

export interface SkillSyncResult {
  agent: string;
  added: string[];
  updated: string[];
  removed: string[];
}

export class KitNotFoundError extends Error {
  constructor() {
    super('Pedrito kit path could not be resolved');
  }
}

export function resolveKitPath(configStore: ConfigStore): string {
  const config = configStore.read();
  const candidates = [
    process.env.PEDRITO_KIT_PATH,
    config?.kitPath,
    join(process.cwd(), 'kit'),
    join(process.env.HOME ?? homedir(), '.pedrito', 'kit'),
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    if (existsSync(join(candidate, 'skills'))) {
      return candidate;
    }
  }

  throw new KitNotFoundError();
}

export async function syncSkills(
  kitPath: string,
  configStore: ConfigStore,
  dryRun = false,
): Promise<SkillSyncResult[]> {
  const config = configStore.read();
  if (!config) {
    return [];
  }

  const kitSkillsDir = join(kitPath, 'skills');
  const kitSkills = listSkillDirs(kitSkillsDir);
  const results: SkillSyncResult[] = [];

  for (const agent of config.agents) {
    const destination = resolveSkillsDir(agent);
    if (!destination) {
      results.push({ agent, added: [], updated: [], removed: [] });
      continue;
    }

    const existingSkills = existsSync(destination) ? listSkillDirs(destination) : [];
    const added: string[] = [];
    const updated: string[] = [];

    for (const skill of kitSkills) {
      const sourceSkillDir = join(kitSkillsDir, skill);
      const destSkillDir = join(destination, skill);

      if (!existingSkills.includes(skill)) {
        added.push(skill);
        if (!dryRun) {
          cpSync(sourceSkillDir, destSkillDir, { recursive: true });
        }
        continue;
      }

      const sourceMTime = statSync(join(sourceSkillDir, 'SKILL.md')).mtimeMs;
      const destMTime = statSync(join(destSkillDir, 'SKILL.md')).mtimeMs;
      if (sourceMTime > destMTime) {
        updated.push(skill);
        if (!dryRun) {
          cpSync(sourceSkillDir, destSkillDir, { recursive: true });
        }
      }
    }

    results.push({ agent, added, updated, removed: [] });
  }

  return results;
}

function resolveSkillsDir(agent: string): string | null {
  const home = process.env.HOME ?? homedir();
  switch (agent) {
    case 'claude-code':
      return join(home, '.claude', 'skills');
    case 'opencode':
      return join(home, '.config', 'opencode', 'skill');
    case 'cursor':
      return join(home, '.cursor', 'skills');
    default:
      return null;
  }
}

function listSkillDirs(root: string): string[] {
  if (!existsSync(root)) {
    return [];
  }

  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(root, entry.name, 'SKILL.md')))
    .map((entry) => entry.name)
    .sort();
}
