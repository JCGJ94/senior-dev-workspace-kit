import type { ConfigStore } from '../config/config-store.js';
import { NotInstalledError, type PedritoProfile } from './profile.schema.js';

export function exportProfile(
  name: string,
  description: string,
  configStore: ConfigStore,
): PedritoProfile {
  const installed = configStore.read();
  if (!installed) {
    throw new NotInstalledError();
  }

  return {
    version: '1',
    name,
    description,
    exportedAt: new Date().toISOString(),
    config: {
      preset: installed.preset,
      agents: [...installed.agents],
      mcp: sanitizeMcp(installed.mcp),
      gga: installed.gga,
    },
    metadata: {
      source: 'pedrito',
    },
  };
}

function sanitizeMcp(mcp: string[]): string[] {
  return mcp.map((entry) => (/(token|secret|key)/i.test(entry) ? 'redacted' : entry));
}
