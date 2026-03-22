import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { dirname, join } from 'path';

export interface PedritoInstalledConfig {
  version: string;
  installedAt: string;
  agents: string[];
  preset: string;
  persona?: string;
  mcp: string[];
  gga: boolean;
  kitPath?: string;
  sync?: {
    gistId?: string;
    lastSyncAt?: string;
  };
}

export class ConfigStore {
  private readonly filePath: string;

  constructor(filePath = join(process.env.HOME ?? homedir(), '.pedrito', 'config.json')) {
    this.filePath = filePath;
  }

  read(): PedritoInstalledConfig | null {
    if (!existsSync(this.filePath)) {
      return null;
    }
    return JSON.parse(readFileSync(this.filePath, 'utf8')) as PedritoInstalledConfig;
  }

  write(config: PedritoInstalledConfig): void {
    mkdirSync(dirname(this.filePath), { recursive: true });
    writeFileSync(this.filePath, JSON.stringify(config, null, 2), 'utf8');
  }

  update(patch: Partial<PedritoInstalledConfig>): PedritoInstalledConfig {
    const current = this.read();
    if (!current) {
      throw new Error('No installed config exists yet');
    }

    const next = { ...current, ...patch };
    this.write(next);
    return next;
  }

  clear(): void {
    rmSync(this.filePath, { force: true });
  }
}
