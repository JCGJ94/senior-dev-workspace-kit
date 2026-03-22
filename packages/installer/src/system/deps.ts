import { existsSync } from 'fs';
import { join } from 'path';

export interface DependencyStatus {
  name: string;
  installed: boolean;
  path?: string;
}

const DEPENDENCIES = ['bun', 'git', 'claude', 'opencode', 'gemini', 'codex', 'ollama', 'gh'];

export function detectDeps(): DependencyStatus[] {
  const pathDirs = (process.env.PATH ?? '').split(':').filter(Boolean);

  return DEPENDENCIES.map((name) => {
    const found = pathDirs
      .map((dir) => join(dir, name))
      .find((candidate) => existsSync(candidate));

    return {
      name,
      installed: Boolean(found),
      path: found,
    };
  });
}
