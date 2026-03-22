#!/usr/bin/env bun
import { applyPendingUpdate } from './updater/replacer.js';
import { VERSION } from './version.js';
import { spawnSync } from 'child_process';
import { join } from 'path';
import { BackupManager } from './backup/backup.js';
import { ConfigStore } from './config/config-store.js';
import { MCP_SERVERS } from './mcp/catalog.js';
import { checkMCPStatus } from './mcp/status.js';
import { runInstall } from './orchestrator.js';
import { listPresets } from './presets/index.js';
import { exportProfile } from './profiles/exporter.js';
import { fetchProfile } from './profiles/fetcher.js';
import { importProfile } from './profiles/importer.js';
import { ProfileStore } from './profiles/store.js';
import { runSync } from './sync/sync.js';
import { detectDeps } from './system/deps.js';
import { detectSystem } from './system/detect.js';
import { runUpdate } from './updater/updater.js';
import { writeFileSync } from 'fs';

if (await applyPendingUpdate()) {
  console.log('Pending update applied. Please restart pedrito.');
  process.exit(0);
}

const [, , cmd, ...args] = process.argv;

switch (cmd) {
  case 'version':
    await cmdVersion();
    break;

  case 'install':
    await cmdInstall(args);
    break;

  case 'doctor':
    await cmdDoctor();
    break;

  case 'backup':
    await cmdBackup(args);
    break;

  case 'mcp':
    await cmdMCP(args);
    break;

  case 'profile':
    await cmdProfile(args);
    break;

  case 'update':
    await cmdUpdate(args);
    break;

  case 'sync':
    await cmdSync(args);
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

async function cmdInstall(argv: string[]): Promise<void> {
  const preset = readFlag(argv, '--preset') ?? 'full-pedrito';
  const persona = readFlag(argv, '--persona');
  const agents = (readFlag(argv, '--agents') ?? 'claude-code')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const projectPath = readFlag(argv, '--project') ?? process.cwd();

  const report = await runInstall({
    projectPath,
    presetName: preset,
    agents,
    persona,
  });

  console.log(`pedrito v${VERSION}: installation complete`);
  console.log(`project: ${report.projectPath}`);
  console.log(`preset: ${report.preset}`);
  console.log(`backup: ${report.backupId}`);
  console.log(`agents: ${report.configuredAgents.join(', ')}`);
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

async function cmdDoctor(): Promise<void> {
  const system = detectSystem();
  const deps = detectDeps();

  console.log(`pedrito v${VERSION}`);
  console.log(`system: ${system.os} ${system.arch} shell=${system.shell}`);
  for (const dep of deps) {
    console.log(`${dep.name}: ${dep.installed ? 'installed' : 'missing'}${dep.path ? ` (${dep.path})` : ''}`);
  }
}

async function cmdBackup(argv: string[]): Promise<void> {
  const backupManager = new BackupManager();
  const subcommand = argv[0];

  if (subcommand === 'list') {
    console.log(JSON.stringify(backupManager.list(), null, 2));
    return;
  }

  if (subcommand === 'restore') {
    const id = argv[1] === '--latest' ? backupManager.list()[0]?.id : argv[1];
    if (!id) {
      throw new Error('backup restore requires an id');
    }
    backupManager.restore(id);
    console.log(`backup restored: ${id}`);
    return;
  }

  if (subcommand === 'delete') {
    const id = argv[1];
    if (!id) {
      throw new Error('backup delete requires an id');
    }
    backupManager.delete(id);
    console.log(`backup deleted: ${id}`);
    return;
  }

  if (subcommand === 'prune') {
    const keep = Number(readFlag(argv, '--keep') ?? '5');
    const removed = backupManager.prune(keep);
    console.log(`backups pruned: ${removed}`);
    return;
  }

  console.log('Usage: pedrito backup <list|restore|delete|prune>');
}

async function cmdMCP(argv: string[]): Promise<void> {
  const subcommand = argv[0];
  const configStore = new ConfigStore();

  if (subcommand === 'list') {
    console.log(JSON.stringify(MCP_SERVERS, null, 2));
    return;
  }

  if (subcommand === 'status') {
    console.log(JSON.stringify(await checkMCPStatus(), null, 2));
    return;
  }

  if (subcommand === 'add' || subcommand === 'remove') {
    const name = argv[1];
    if (!name) {
      throw new Error(`pedrito mcp ${subcommand} requires a server name`);
    }

    const current = configStore.read();
    if (!current) {
      throw new Error('Pedrito is not installed yet');
    }

    const backupManager = new BackupManager();
    backupManager.create(`mcp-${subcommand}`, [join(process.env.HOME ?? '', '.claude')]);
    const nextMcp =
      subcommand === 'add'
        ? Array.from(new Set([...current.mcp, name]))
        : current.mcp.filter((entry) => entry !== name);
    configStore.update({ mcp: nextMcp });
    console.log(`mcp ${subcommand}: ${name}`);
    return;
  }

  console.log('Usage: pedrito mcp <list|status|add|remove>');
}

async function cmdProfile(argv: string[]): Promise<void> {
  const subcommand = argv[0];
  const configStore = new ConfigStore();
  const profileStore = new ProfileStore();

  if (subcommand === 'export') {
    const output = readFlag(argv, '--output');
    const name = readFlag(argv, '--name') ?? 'pedrito-profile';
    const description = readFlag(argv, '--description') ?? '';
    const profile = exportProfile(name, description, configStore);
    const serialized = JSON.stringify(profile, null, 2);
    if (output) {
      writeFileSync(output, serialized, 'utf8');
      console.log(`profile exported: ${output}`);
    } else {
      console.log(serialized);
    }
    return;
  }

  if (subcommand === 'import') {
    const source = argv[1];
    if (!source) {
      throw new Error('pedrito profile import requires a path or URL');
    }
    const profile = await fetchProfile(source);
    const report = await importProfile(profile, { projectPath: process.cwd() });
    console.log(`profile imported: ${profile.name}`);
    console.log(`agents: ${report.configuredAgents.join(', ')}`);
    return;
  }

  if (subcommand === 'list') {
    console.log(JSON.stringify(profileStore.list(), null, 2));
    return;
  }

  if (subcommand === 'save') {
    const name = argv[1];
    if (!name) {
      throw new Error('pedrito profile save requires a name');
    }
    const profile = exportProfile(name, '', configStore);
    const path = profileStore.save(name, profile);
    console.log(`profile saved: ${path}`);
    return;
  }

  if (subcommand === 'delete') {
    const name = argv[1];
    if (!name) {
      throw new Error('pedrito profile delete requires a name');
    }
    profileStore.delete(name);
    console.log(`profile deleted: ${name}`);
    return;
  }

  if (subcommand === 'show') {
    const name = argv[1];
    if (!name) {
      throw new Error('pedrito profile show requires a name');
    }
    console.log(JSON.stringify(profileStore.load(name), null, 2));
    return;
  }

  if (subcommand === 'publish' || subcommand === 'search' || subcommand === 'install') {
    console.log('Coming in a future release');
    return;
  }

  console.log('Usage: pedrito profile <export|import|list|save|delete|show>');
}

async function cmdUpdate(argv: string[]): Promise<void> {
  const components: Array<'pedrito' | 'engram' | 'gga' | 'skills'> = argv.includes('--all')
    ? ['pedrito', 'engram', 'gga', 'skills']
    : [
        'pedrito',
        ...(argv.includes('--engram') ? (['engram'] as const) : []),
        ...(argv.includes('--skills') ? (['skills'] as const) : []),
      ];

  const reports = await runUpdate({
    components,
    version: readFlag(argv, '--version'),
    includePrerelease: argv.includes('--include-prerelease'),
    dryRun: argv.includes('--dry-run'),
    yes: argv.includes('--yes'),
  });

  console.log(JSON.stringify(reports, null, 2));
}

async function cmdSync(argv: string[]): Promise<void> {
  if (argv.includes('--to')) {
    await runSync({ direction: 'to', target: readFlag(argv, '--to') });
    console.log(`sync exported to ${readFlag(argv, '--to')}`);
    return;
  }

  if (argv.includes('--from')) {
    await runSync({ direction: 'from', target: readFlag(argv, '--from') });
    console.log(`sync imported from ${readFlag(argv, '--from')}`);
    return;
  }

  if (argv.includes('--github-gist')) {
    await runSync({ githubGist: true, pull: argv.includes('--pull') });
    console.log(`sync gist ${argv.includes('--pull') ? 'pulled' : 'pushed'}`);
    return;
  }

  console.log('Usage: pedrito sync --to <file> | --from <file> | --github-gist [--pull]');
}

function showHelp(): void {
  console.log(`pedrito v${VERSION}

Usage: pedrito <command>

Commands:
  version    Show versions of pedrito, pedrito-engram, and gga
  install    Provision Pedrito in the current project and configure Claude Code
  doctor     Show system and dependency health
  backup     List or restore installer backups
  mcp        Manage known MCP servers and status
  profile    Export, import and manage reproducible team profiles
  update     Update binaries and sync skills
  sync       Sync config to file or GitHub Gist
  help       Show this help

Environment:
  PEDRITO_VERSION    Version baked in at compile time via --define

Presets:
${listPresets()
  .map((preset) => `  ${preset.name.padEnd(16)} ${preset.description}`)
  .join('\n')}

Personas:
  pedrito-cubano            Cuban Caribbean mentor (default)
  pedrito-colombiano        Colombian mentor
  pedrito-neutral-latam     Neutral Latin American mentor
  neutral-mode              No personality overlay
`);
}

function readFlag(argv: string[], name: string): string | undefined {
  const index = argv.indexOf(name);
  if (index < 0) {
    return undefined;
  }
  return argv[index + 1];
}
