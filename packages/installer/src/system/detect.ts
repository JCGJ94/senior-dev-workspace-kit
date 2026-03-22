import { homedir } from 'os';

export interface SystemInfo {
  os: NodeJS.Platform;
  arch: string;
  isWSL: boolean;
  isTermux: boolean;
  homeDir: string;
  shell: string;
}

export function detectSystem(): SystemInfo {
  return {
    os: process.platform,
    arch: process.arch,
    isWSL: Boolean(process.env.WSL_DISTRO_NAME),
    isTermux: process.env.PREFIX?.includes('termux') ?? false,
    homeDir: process.env.HOME ?? homedir(),
    shell: process.env.SHELL ?? 'unknown',
  };
}
