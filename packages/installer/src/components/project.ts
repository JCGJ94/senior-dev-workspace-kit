import { copyFileSync, cpSync, mkdirSync } from 'fs';
import { join } from 'path';

export function installProjectRuntime(kitPath: string, targetPath: string): void {
  const runtimeRoot = join(targetPath, '.agent');
  mkdirSync(runtimeRoot, { recursive: true });
  cpSync(join(kitPath, 'core'), join(runtimeRoot, 'core'), { recursive: true });
  cpSync(join(kitPath, 'registry'), join(runtimeRoot, 'registry'), { recursive: true });
  cpSync(join(kitPath, 'skills'), join(runtimeRoot, 'skills'), { recursive: true });
  cpSync(join(kitPath, 'workflows'), join(runtimeRoot, 'workflows'), { recursive: true });
  cpSync(join(kitPath, 'config', 'personas'), join(runtimeRoot, 'personas'), { recursive: true });
  mkdirSync(join(runtimeRoot, 'state'), { recursive: true });
  mkdirSync(join(targetPath, 'docs', 'engram'), { recursive: true });
  mkdirSync(join(targetPath, 'specs'), { recursive: true });
  copyFileSync(join(kitPath, 'AGENTS.md'), join(targetPath, 'AGENTS.md'));
}
