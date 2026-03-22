#!/usr/bin/env bun
import { VERSION } from './version.js';
import { spawnSync } from 'child_process';

const [, , cmd, ...args] = process.argv;

switch (cmd) {
  case 'version':
    await cmdVersion();
    break;

  case 'install':
    // Phase 3 full TUI implementation — provision .agent/ in a project
    console.log(`pedrito v${VERSION}: project install (Phase 3 TUI coming soon)`);
    break;

  case 'help':
  case '--help':
  case '-h':
  case undefined:
    showHelp();
    break;

  default:
    console.error(`pedrito: unknown command '${cmd}'`);
    console.error(`Run 'pedrito --help' for usage.`);
    process.exit(1);
}

async function cmdVersion(): Promise<void> {
  console.log(`pedrito v${VERSION}`);

  // Try pedrito-engram version
  const engram = spawnSync('pedrito-engram', ['version'], {
    encoding: 'utf8',
    timeout: 2000,
  });
  if (engram.status === 0 && engram.stdout) {
    console.log(`pedrito-engram v${engram.stdout.trim()}`);
  } else {
    console.log('pedrito-engram: not installed');
  }

  // Try gga version
  const gga = spawnSync('gga', ['version'], {
    encoding: 'utf8',
    timeout: 2000,
  });
  if (gga.status === 0 && gga.stdout) {
    console.log(`gga v${gga.stdout.trim()}`);
  } else {
    console.log('gga: not installed');
  }
}

function showHelp(): void {
  console.log(`pedrito v${VERSION}

Usage: pedrito <command>

Commands:
  version    Show versions of pedrito, pedrito-engram, and gga
  install    Provision Pedrito in the current project (.agent/ setup)
  help       Show this help

Environment:
  PEDRITO_VERSION    Version baked in at compile time via --define
`);
}
