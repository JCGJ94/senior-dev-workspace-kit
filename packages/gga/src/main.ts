#!/usr/bin/env bun
import { chmodSync, copyFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { clearCache, getCacheStats } from './cache.js';
import { loadConfig } from './config.js';
import { runHook } from './hook.js';

declare const PEDRITO_VERSION: string;
const VERSION = typeof PEDRITO_VERSION !== 'undefined' ? PEDRITO_VERSION : '4.0.0-dev';

const [, , cmd, ...args] = process.argv;

switch (cmd) {
  case 'version':
    console.log(VERSION);
    process.exit(0);
    break;
  case 'run':
    await cmdRun(args);
    break;
  case 'install':
    await cmdInstall();
    break;
  case 'uninstall':
    await cmdUninstall();
    break;
  case 'config':
    console.log(JSON.stringify(loadConfig(process.cwd()), null, 2));
    break;
  case 'cache':
    await cmdCache(args);
    break;
  case 'status':
    await cmdStatus();
    break;
  default:
    showHelp();
    break;
}

async function cmdRun(argv: string[]): Promise<void> {
  const strict = argv.includes('--strict') || process.env.GGA_STRICT === '1';
  if (process.env.GGA_SKIP === '1') {
    console.log('gga: skipped (GGA_SKIP=1)');
    process.exit(0);
  }

  const providerIndex = argv.indexOf('--provider');
  const config = loadConfig(process.cwd());
  if (providerIndex >= 0 && argv[providerIndex + 1]) {
    config.provider = argv[providerIndex + 1]!;
  }

  const result = await runHook(process.cwd(), config, strict);
  for (const line of result.stdout) {
    console.log(line);
  }
  process.exit(result.exitCode);
}

async function cmdInstall(): Promise<void> {
  const hookDir = join(process.cwd(), '.git', 'hooks');
  const hookPath = join(hookDir, 'pre-commit');
  const templatePath = join(import.meta.dir, '..', 'scripts', 'hook-template.sh');

  if (!existsSync(join(process.cwd(), '.git'))) {
    console.error('gga install: not a git repository');
    process.exit(1);
  }

  mkdirSync(hookDir, { recursive: true });
  copyFileSync(templatePath, hookPath);
  chmodSync(hookPath, 0o755);
  console.log(`gga: pre-commit hook installed at ${hookPath}`);
}

async function cmdUninstall(): Promise<void> {
  const hookPath = join(process.cwd(), '.git', 'hooks', 'pre-commit');
  if (!existsSync(hookPath)) {
    console.log('gga: no pre-commit hook found');
    process.exit(0);
  }

  unlinkSync(hookPath);
  console.log('gga: pre-commit hook removed');
}

async function cmdCache(argv: string[]): Promise<void> {
  const subcommand = argv[0];
  const config = loadConfig(process.cwd());
  if (subcommand === 'clear') {
    const project = argv.includes('--all') ? undefined : process.cwd().split('/').filter(Boolean).at(-1);
    clearCache(config.cache_dir, project);
    console.log(project ? `gga: cache cleared for ${project}` : 'gga: cache cleared');
    return;
  }

  if (subcommand === 'stats') {
    console.log(JSON.stringify(getCacheStats(config.cache_dir), null, 2));
    return;
  }

  console.log('Usage: gga cache <clear|stats> [--all]');
}

async function cmdStatus(): Promise<void> {
  const config = loadConfig(process.cwd());
  const stats = getCacheStats(config.cache_dir);
  console.log(`gga v${VERSION}`);
  console.log(`provider: ${config.provider}`);
  console.log(`cache: ${stats.entries} entries across ${stats.projects} projects`);
}

function showHelp(): void {
  console.log(`gga v${VERSION}

Usage: gga <command>

Commands:
  run [--strict] [--provider X]   Run Guardian Angel review on staged changes
  install                         Install gga as a pre-commit hook in the current git repo
  uninstall                       Remove the gga pre-commit hook
  config                          Print merged configuration
  cache clear [--all]             Clear cache for current project or all projects
  cache stats                     Show cache stats
  status                          Show provider and cache status
  version                         Show version

Environment:
  GGA_STRICT=1                    Treat warnings as errors
  GGA_SKIP=1                      Skip review entirely
`);
}
