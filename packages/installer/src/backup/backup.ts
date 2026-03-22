import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { dirname, join } from 'path';

export interface BackupManifest {
  id: string;
  label: string;
  createdAt: string;
  paths: string[];
  totalSize: number;
}

export class BackupManager {
  private readonly rootDir: string;

  constructor(rootDir = join(process.env.HOME ?? homedir(), '.pedrito', 'backups')) {
    this.rootDir = rootDir;
  }

  create(label: string, paths: string[]): BackupManifest {
    mkdirSync(this.rootDir, { recursive: true });

    const id = `${new Date().toISOString().replaceAll(':', '-')}-${label}`;
    const backupDir = join(this.rootDir, id);
    mkdirSync(backupDir, { recursive: true });

    const copiedPaths: string[] = [];
    let totalSize = 0;
    for (const path of paths) {
      if (!existsSync(path)) {
        continue;
      }

      const destination = join(backupDir, toRelativeBackupPath(path));
      mkdirSync(dirname(destination), { recursive: true });
      cpSync(path, destination, { recursive: true });
      copiedPaths.push(path);
      totalSize += getPathSize(path);
    }

    const manifest: BackupManifest = {
      id,
      label,
      createdAt: new Date().toISOString(),
      paths: copiedPaths,
      totalSize,
    };

    writeFileSync(join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
    return manifest;
  }

  list(): BackupManifest[] {
    if (!existsSync(this.rootDir)) {
      return [];
    }

    return readdirSync(this.rootDir)
      .map((entry) => join(this.rootDir, entry, 'manifest.json'))
      .filter((manifestPath) => existsSync(manifestPath))
      .map((manifestPath) => JSON.parse(readFileSync(manifestPath, 'utf8')) as BackupManifest)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  restore(id: string): void {
    const backupDir = join(this.rootDir, id);
    const manifestPath = join(backupDir, 'manifest.json');
    if (!existsSync(manifestPath)) {
      throw new Error(`Backup not found: ${id}`);
    }

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as BackupManifest;
    const staging = join(this.rootDir, `${id}.staging`);
    rmSync(staging, { recursive: true, force: true });
    mkdirSync(staging, { recursive: true });

    for (const originalPath of manifest.paths) {
      if (existsSync(originalPath)) {
        const currentSnapshot = join(staging, toRelativeBackupPath(originalPath));
        mkdirSync(dirname(currentSnapshot), { recursive: true });
        cpSync(originalPath, currentSnapshot, { recursive: true });
      }
    }

    try {
      for (const originalPath of manifest.paths) {
        const source = join(backupDir, toRelativeBackupPath(originalPath));
        rmSync(originalPath, { recursive: true, force: true });
        mkdirSync(dirname(originalPath), { recursive: true });
        cpSync(source, originalPath, { recursive: true });
      }
    } catch (error) {
      for (const originalPath of manifest.paths) {
        const currentSnapshot = join(staging, toRelativeBackupPath(originalPath));
        if (!existsSync(currentSnapshot)) {
          continue;
        }
        rmSync(originalPath, { recursive: true, force: true });
        mkdirSync(dirname(originalPath), { recursive: true });
        cpSync(currentSnapshot, originalPath, { recursive: true });
      }
      throw error;
    } finally {
      rmSync(staging, { recursive: true, force: true });
    }
  }

  get(id: string): BackupManifest | null {
    const manifestPath = join(this.rootDir, id, 'manifest.json');
    if (!existsSync(manifestPath)) {
      return null;
    }
    return JSON.parse(readFileSync(manifestPath, 'utf8')) as BackupManifest;
  }

  delete(id: string): void {
    rmSync(join(this.rootDir, id), { recursive: true, force: true });
  }

  prune(keepLast: number): number {
    const backups = this.list();
    const removals = backups.slice(keepLast);
    for (const backup of removals) {
      this.delete(backup.id);
    }
    return removals.length;
  }
}

function toRelativeBackupPath(path: string): string {
  return path.replace(/^\/+/, '');
}

function getPathSize(path: string): number {
  const stats = statSync(path);
  if (stats.isFile()) {
    return stats.size;
  }

  if (stats.isDirectory()) {
    return readdirSync(path).reduce((total, entry) => total + getPathSize(join(path, entry)), 0);
  }

  return 0;
}
