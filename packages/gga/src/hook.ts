import type { GGAConfig } from './config.js';
import { checkCache, writeCache } from './cache.js';
import { getProvider } from './providers/index.js';
import { buildPrompt, parseResponse } from './review.js';
import { extractRules } from './rules.js';
import { getStagedFiles } from './staged.js';

export interface HookRunResult {
  exitCode: number;
  stdout: string[];
}

export async function runHook(cwd: string, config: GGAConfig, strict: boolean): Promise<HookRunResult> {
  const stagedFiles = getStagedFiles(cwd, config);
  if (stagedFiles.length === 0) {
    return { exitCode: 0, stdout: ['gga: no staged changes to review'] };
  }

  const project = cwd.split('/').filter(Boolean).at(-1) ?? 'project';
  const pendingFiles = stagedFiles.filter((file) => {
    const cached = checkCache(config.cache_dir, project, file.sha256);
    return cached?.result !== 'PASSED';
  });

  if (pendingFiles.length === 0) {
    return { exitCode: 0, stdout: ['gga: all staged files already passed review'] };
  }

  const rules = extractRules(config.rules_file, cwd);
  const provider = getProvider(config.provider);
  const prompt = buildPrompt(pendingFiles, rules);

  try {
    const raw = await provider.call(prompt, config.timeout);
    const review = parseResponse(raw);

    if (review.verdict === 'PASSED') {
      for (const file of pendingFiles) {
        writeCache(config.cache_dir, project, {
          sha256: file.sha256,
          provider: provider.name,
          result: 'PASSED',
          timestamp: Date.now(),
        });
      }

      return { exitCode: 0, stdout: [`gga: review passed via ${provider.name}`] };
    }

    const lines = ['gga: review failed'];
    for (const issue of review.issues) {
      lines.push(`- ${issue.file} [${issue.severity}] ${issue.message}`);
    }

    if (!strict && config.fail_open) {
      lines.push('gga: fail-open enabled, allowing commit');
      return { exitCode: 0, stdout: lines };
    }

    return { exitCode: 1, stdout: lines };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const lines = [`gga: provider error: ${message}`];
    if (config.fail_open && !strict) {
      lines.push('gga: fail-open enabled, allowing commit');
      return { exitCode: 0, stdout: lines };
    }
    return { exitCode: 1, stdout: lines };
  }
}
