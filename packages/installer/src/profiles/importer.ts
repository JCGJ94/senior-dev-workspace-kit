import type { InstallReport } from '../orchestrator.js';
import { runInstall } from '../orchestrator.js';
import type { PedritoProfile } from './profile.schema.js';

export interface ImportProfileOptions {
  projectPath: string;
}

export async function importProfile(
  profile: PedritoProfile,
  options: ImportProfileOptions,
): Promise<InstallReport> {
  return runInstall({
    projectPath: options.projectPath,
    presetName: profile.config.preset,
    agents: profile.config.agents,
  });
}
