import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import type { PedritoProfile } from './profile.schema.js';

export class ProfileStore {
  private readonly rootDir: string;

  constructor(rootDir = join(process.env.HOME ?? homedir(), '.pedrito', 'profiles')) {
    this.rootDir = rootDir;
  }

  save(name: string, profile: PedritoProfile): string {
    mkdirSync(this.rootDir, { recursive: true });
    const filePath = join(this.rootDir, `${sanitizeName(name)}.json`);
    writeFileSync(filePath, JSON.stringify(profile, null, 2), 'utf8');
    return filePath;
  }

  load(name: string): PedritoProfile | null {
    const filePath = join(this.rootDir, `${sanitizeName(name)}.json`);
    if (!existsSync(filePath)) {
      return null;
    }
    return JSON.parse(readFileSync(filePath, 'utf8')) as PedritoProfile;
  }

  list(): string[] {
    if (!existsSync(this.rootDir)) {
      return [];
    }
    return readdirSync(this.rootDir)
      .filter((entry) => entry.endsWith('.json'))
      .map((entry) => entry.replace(/\.json$/, ''))
      .sort();
  }

  delete(name: string): void {
    rmSync(join(this.rootDir, `${sanitizeName(name)}.json`), { force: true });
  }
}

function sanitizeName(name: string): string {
  return name.replaceAll(/[^\w.-]/g, '-');
}
