import { execFileSync } from 'child_process';
import { relative } from 'path';
import type { GGAConfig } from './config.js';
import { createHash } from 'crypto';

export interface StagedFile {
  path: string;
  content: string;
  sha256: string;
  status: string;
}

export function getStagedFiles(cwd: string, config: GGAConfig): StagedFile[] {
  const output = execGit(cwd, ['diff', '--cached', '--name-status', '--no-renames']);
  if (!output.trim()) {
    return [];
  }

  const files: StagedFile[] = [];
  for (const line of output.split(/\r?\n/)) {
    if (!line.trim()) {
      continue;
    }

    const [status, ...rest] = line.split('\t');
    const filePath = rest.join('\t');
    if (!status || !filePath || status === 'D') {
      continue;
    }
    if (isExcluded(filePath, config.exclude)) {
      continue;
    }

    const content = execGit(cwd, ['show', `:${filePath}`], true);
    if (!content || content.includes('\u0000')) {
      continue;
    }

    const normalized = content.length > config.max_file_size ? content.slice(0, config.max_file_size) : content;
    files.push({
      path: relative(cwd, `${cwd}/${filePath}`).replace(/^\.\//, '') || filePath,
      content: normalized,
      sha256: createHash('sha256').update(normalized).digest('hex'),
      status,
    });
  }

  return files;
}

function execGit(cwd: string, args: string[], allowEmpty = false): string {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch (error) {
    if (allowEmpty) {
      return '';
    }

    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`gga failed to inspect staged changes: ${message}`);
  }
}

function isExcluded(path: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    const prefix = pattern.replace('/**', '').replace('*', '');
    return prefix ? path.startsWith(prefix) : false;
  });
}
