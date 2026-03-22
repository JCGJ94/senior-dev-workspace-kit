#!/usr/bin/env bun
// @pedrito/gga — Guardian Angel pre-commit hook CLI

declare const PEDRITO_VERSION: string;
const VERSION = typeof PEDRITO_VERSION !== 'undefined' ? PEDRITO_VERSION : '4.0.0-dev';

const [, , cmd, ...args] = process.argv;

switch (cmd) {
  case 'version':
    console.log(VERSION);
    process.exit(0);
    break;

  case 'run':
    // Phase 2 full implementation — pre-commit review logic
    await cmdRun(args);
    break;

  case 'install':
    // Install GGA as a pre-commit hook in the current git repo
    await cmdInstall();
    break;

  case 'uninstall':
    await cmdUninstall();
    break;

  default:
    console.log(`gga v${VERSION}

Usage: gga <command>

Commands:
  run [--strict]     Run Guardian Angel review on staged changes
  install            Install gga as a pre-commit hook in the current git repo
  uninstall          Remove the gga pre-commit hook
  version            Show version

Environment:
  GGA_STRICT=1       Treat warnings as errors (same as --strict)
  GGA_SKIP=1         Skip review entirely (use sparingly)
`);
    process.exit(0);
}

async function cmdRun(_args: string[]): Promise<void> {
  const strict = _args.includes('--strict') || process.env.GGA_STRICT === '1';

  if (process.env.GGA_SKIP === '1') {
    console.log('gga: skipped (GGA_SKIP=1)');
    process.exit(0);
  }

  // Placeholder for Phase 2 AI review logic
  // Full implementation: read staged diff, call LLM, parse blockers vs warnings
  console.log(`gga v${VERSION}: review passed (Phase 2 implementation pending)`);
  if (strict) {
    console.log('gga: strict mode enabled');
  }
  process.exit(0);
}

async function cmdInstall(): Promise<void> {
  const { join } = await import('path');
  const { writeFileSync, chmodSync, existsSync, mkdirSync } = await import('fs');

  const hookDir = join(process.cwd(), '.git', 'hooks');
  const hookPath = join(hookDir, 'pre-commit');

  if (!existsSync(join(process.cwd(), '.git'))) {
    console.error('gga install: not a git repository');
    process.exit(1);
  }

  mkdirSync(hookDir, { recursive: true });

  const hook = `#!/bin/sh
# Installed by gga v${VERSION}
exec gga run
`;
  writeFileSync(hookPath, hook, 'utf8');
  chmodSync(hookPath, 0o755);
  console.log(`gga: pre-commit hook installed at ${hookPath}`);
}

async function cmdUninstall(): Promise<void> {
  const { join } = await import('path');
  const { unlinkSync, existsSync } = await import('fs');

  const hookPath = join(process.cwd(), '.git', 'hooks', 'pre-commit');

  if (!existsSync(hookPath)) {
    console.log('gga: no pre-commit hook found');
    process.exit(0);
  }

  unlinkSync(hookPath);
  console.log('gga: pre-commit hook removed');
}
