import { chmodSync, copyFileSync, existsSync, renameSync, rmSync } from 'fs';
import { join } from 'path';

export interface ReplaceOptions {
  binaryName: string;
  tempPath: string;
  currentPath?: string;
  platform?: NodeJS.Platform;
}

export interface ReplaceResult {
  strategy: 'atomic' | 'pending-restart';
  installedPath?: string;
  pendingPath?: string;
}

export class BinaryNotFoundError extends Error {
  constructor(binaryName: string) {
    super(`Binary not found in PATH: ${binaryName}`);
  }
}

export async function replaceBinary(opts: ReplaceOptions): Promise<ReplaceResult> {
  const platform = opts.platform ?? process.platform;
  const currentPath = opts.currentPath ?? Bun.which(opts.binaryName);
  if (!currentPath) {
    throw new BinaryNotFoundError(opts.binaryName);
  }

  if (platform === 'win32') {
    const pendingPath = currentPath.replace(/\.exe$/, '.new.exe');
    renameSync(opts.tempPath, pendingPath);
    return { strategy: 'pending-restart', pendingPath };
  }

  chmodSync(opts.tempPath, 0o755);
  try {
    renameSync(opts.tempPath, currentPath);
  } catch (error) {
    const maybeErr = error as NodeJS.ErrnoException;
    if (maybeErr.code !== 'EXDEV') {
      throw error;
    }
    copyFileSync(opts.tempPath, currentPath);
    rmSync(opts.tempPath, { force: true });
  }

  return { strategy: 'atomic', installedPath: currentPath };
}

export async function applyPendingUpdate(
  currentExe = process.execPath,
  platform: NodeJS.Platform = process.platform,
): Promise<boolean> {
  if (platform !== 'win32') {
    return false;
  }

  const pendingExe = currentExe.replace(/\.exe$/, '.new.exe');
  if (!existsSync(pendingExe)) {
    return false;
  }

  const result = Bun.spawnSync(['cmd', '/c', `move /y "${pendingExe}" "${currentExe}"`], {
    stdout: 'pipe',
    stderr: 'pipe',
  });
  return result.exitCode === 0;
}
