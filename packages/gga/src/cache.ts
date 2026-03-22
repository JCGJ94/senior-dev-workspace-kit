import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface CacheEntry {
  sha256: string;
  result: 'PASSED' | 'FAILED';
  timestamp: number;
  provider: string;
}

export interface CacheStats {
  projects: number;
  entries: number;
  size_bytes: number;
}

export function checkCache(cacheDir: string, project: string, sha256: string): CacheEntry | null {
  const filePath = getCachePath(cacheDir, project, sha256);
  if (!existsSync(filePath)) {
    return null;
  }

  return JSON.parse(readFileSync(filePath, 'utf8')) as CacheEntry;
}

export function writeCache(cacheDir: string, project: string, entry: CacheEntry): void {
  const dir = join(cacheDir, sanitizeProject(project));
  mkdirSync(dir, { recursive: true });
  writeFileSync(getCachePath(cacheDir, project, entry.sha256), JSON.stringify(entry, null, 2), 'utf8');
}

export function clearCache(cacheDir: string, project?: string): void {
  const target = project ? join(cacheDir, sanitizeProject(project)) : cacheDir;
  rmSync(target, { recursive: true, force: true });
}

export function getCacheStats(cacheDir: string): CacheStats {
  if (!existsSync(cacheDir)) {
    return { projects: 0, entries: 0, size_bytes: 0 };
  }

  let projects = 0;
  let entries = 0;
  let sizeBytes = 0;

  for (const projectEntry of readdirSync(cacheDir, { withFileTypes: true })) {
    if (!projectEntry.isDirectory()) {
      continue;
    }

    projects += 1;
    const projectDir = join(cacheDir, projectEntry.name);
    for (const entry of readdirSync(projectDir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith('.json')) {
        continue;
      }

      entries += 1;
      sizeBytes += statSync(join(projectDir, entry.name)).size;
    }
  }

  return { projects, entries, size_bytes: sizeBytes };
}

function getCachePath(cacheDir: string, project: string, sha256: string): string {
  return join(cacheDir, sanitizeProject(project), `${sha256}.json`);
}

function sanitizeProject(project: string): string {
  return project.replaceAll(/[^\w.-]/g, '_');
}
