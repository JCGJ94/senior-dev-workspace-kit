import { afterAll, afterEach, describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { BackupManager } from './backup/backup.js';
import { ConfigStore } from './config/config-store.js';
import { checkMCPStatus } from './mcp/status.js';
import { runInstall } from './orchestrator.js';
import { exportProfile } from './profiles/exporter.js';
import { fetchProfile, normalizeGitHubUrl } from './profiles/fetcher.js';
import { importProfile } from './profiles/importer.js';
import { ProfileStore } from './profiles/store.js';
import { runSync } from './sync/sync.js';
import { downloadBinary, ChecksumError } from './updater/downloader.js';
import { applyPendingUpdate, replaceBinary } from './updater/replacer.js';
import { currentTarget } from './updater/release.js';
import { syncSkills } from './updater/skills-sync.js';
import { detectDeps } from './system/deps.js';
import { detectSystem } from './system/detect.js';

const tmpRoot = join(process.cwd(), '.tmp-installer-tests');
const originalHome = process.env.HOME;

afterEach(() => {
  if (originalHome) {
    process.env.HOME = originalHome;
  }
});

afterAll(() => {
  rmSync(tmpRoot, { recursive: true, force: true });
});

describe('@pedrito/installer', () => {
  test('detectSystem returns current process info', () => {
    const system = detectSystem();
    expect(system.os).toBe(process.platform);
    expect(system.arch).toBe(process.arch);
  });

  test('currentTarget returns a supported target string', () => {
    expect(currentTarget()).toMatch(/^(macos|linux|windows)-/);
  });

  test('detectDeps reports known dependencies', () => {
    const deps = detectDeps();
    expect(deps.some((dep) => dep.name === 'git')).toBe(true);
  });

  test('BackupManager creates a manifest', () => {
    const manager = new BackupManager(join(createTestDir('backups'), 'store'));
    const manifest = manager.create('test', []);
    expect(manifest.id).toContain('test');
    expect(manager.list()).toHaveLength(1);
  });

  test('BackupManager restores and prunes backups', async () => {
    const root = createTestDir('restore');
    const project = join(root, 'restore-project');
    mkdirSync(project, { recursive: true });
    await Bun.write(join(project, 'config.txt'), 'v1');

    const manager = new BackupManager(join(root, 'backups-restore'));
    const backup = manager.create('restore', [join(project, 'config.txt')]);
    await Bun.write(join(project, 'config.txt'), 'v2');
    manager.restore(backup.id);

    expect(Bun.file(join(project, 'config.txt')).text()).resolves.toBe('v1');
    expect(manager.get(backup.id)?.id).toBe(backup.id);
    expect(manager.prune(0)).toBe(1);
  });

  test('runInstall provisions project runtime and Claude config', async () => {
    const root = createTestDir('install');
    const home = join(root, 'home');
    const project = join(root, 'project');
    mkdirSync(home, { recursive: true });
    mkdirSync(project, { recursive: true });
    process.env.HOME = home;

    const report = await runInstall({
      projectPath: project,
      presetName: 'minimal',
      agents: ['claude-code'],
    });

    expect(report.configuredAgents).toEqual(['claude-code']);
    expect(existsSync(join(project, '.agent', 'core'))).toBe(true);
    expect(existsSync(join(project, '.agent', 'personas', 'pedrito-mode.md'))).toBe(true);
    expect(existsSync(join(project, '.agent', 'personas', 'neutral-mode.md'))).toBe(true);
    expect(existsSync(join(project, 'docs', 'engram'))).toBe(true);
    expect(existsSync(join(project, 'specs'))).toBe(true);
    expect(existsSync(join(home, '.claude', 'skills'))).toBe(true);
    expect(existsSync(join(home, '.claude', 'CLAUDE_ENGRAM.md'))).toBe(true);
    expect(new ConfigStore(join(home, '.pedrito', 'config.json')).read()?.agents).toEqual(['claude-code']);
  });

  test('runInstall supports explicit persona override', async () => {
    const root = createTestDir('persona');
    const home = join(root, 'persona-home');
    const project = join(root, 'persona-project');
    mkdirSync(home, { recursive: true });
    mkdirSync(project, { recursive: true });
    process.env.HOME = home;

    await runInstall({
      projectPath: project,
      presetName: 'minimal',
      agents: ['claude-code'],
      persona: 'neutral-mode',
    });

    expect(existsSync(join(home, '.claude', 'pedrito-persona.md'))).toBe(true);
    await expect(Bun.file(join(home, '.claude', 'pedrito-persona.md')).text()).resolves.toContain(
      'name: neutral-mode',
    );
    expect(new ConfigStore(join(home, '.pedrito', 'config.json')).read()?.persona).toBe('neutral-mode');
  });

  test('checkMCPStatus returns known servers', async () => {
    const statuses = await checkMCPStatus();
    expect(statuses.some((status) => status.server === 'engram')).toBe(true);
  });

  test('exportProfile requires installed config and sanitizes mcp entries', async () => {
    const root = createTestDir('profile');
    const home = join(root, 'profile-home');
    const project = join(root, 'profile-project');
    mkdirSync(home, { recursive: true });
    mkdirSync(project, { recursive: true });
    process.env.HOME = home;

    await runInstall({
      projectPath: project,
      presetName: 'full-pedrito',
      agents: ['claude-code'],
    });

    const store = new ConfigStore(join(home, '.pedrito', 'config.json'));
    store.update({ mcp: ['engram', 'api-token-secret'] });
    const profile = exportProfile('team-profile', 'demo', store);
    expect(profile.name).toBe('team-profile');
    expect(profile.config.mcp).toContain('redacted');
  });

  test('fetchProfile loads local file and normalizes GitHub blob URLs', async () => {
    const profilePath = join(createTestDir('fetch-profile'), 'local-profile.json');
    await Bun.write(
      profilePath,
      JSON.stringify({
        version: '1',
        name: 'local',
        description: '',
        exportedAt: new Date().toISOString(),
        config: { preset: 'minimal', agents: ['claude-code'], mcp: [], gga: false },
      }),
    );

    const profile = await fetchProfile(profilePath);
    expect(profile.name).toBe('local');
    expect(normalizeGitHubUrl('https://github.com/acme/repo/blob/main/team/profile.json')).toBe(
      'https://raw.githubusercontent.com/acme/repo/main/team/profile.json',
    );
  });

  test('ProfileStore saves, loads, lists and deletes profiles', () => {
    const store = new ProfileStore(join(createTestDir('profiles'), 'profiles'));
    store.save('alpha', {
      version: '1',
      name: 'alpha',
      description: '',
      exportedAt: new Date().toISOString(),
      config: { preset: 'minimal', agents: ['claude-code'], mcp: [], gga: false },
    });

    expect(store.list()).toEqual(['alpha']);
    expect(store.load('alpha')?.name).toBe('alpha');
    store.delete('alpha');
    expect(store.load('alpha')).toBeNull();
  });

  test('importProfile delegates to orchestrator and provisions target', async () => {
    const root = createTestDir('import');
    const home = join(root, 'import-home');
    const project = join(root, 'import-project');
    mkdirSync(home, { recursive: true });
    mkdirSync(project, { recursive: true });
    process.env.HOME = home;

    const report = await importProfile(
      {
        version: '1',
        name: 'imported',
        description: '',
        exportedAt: new Date().toISOString(),
        config: { preset: 'minimal', agents: ['claude-code'], mcp: [], gga: false },
      },
      { projectPath: project },
    );

    expect(report.configuredAgents).toEqual(['claude-code']);
    expect(existsSync(join(project, '.agent'))).toBe(true);
  });

  test('downloadBinary verifies checksum and rejects corrupt content', async () => {
    const goodContent = new TextEncoder().encode('pedrito-binary');
    const hasher = new Bun.CryptoHasher('sha256');
    hasher.update(goodContent);
    const hash = hasher.digest('hex');

    const fetchOk = (async (input: string | Request | URL) =>
      new Response(
        String(input).endsWith('.sha256') ? `${hash}  pedrito-macos-arm64` : goodContent,
      )) as typeof fetch;

    const download = await downloadBinary(
      { name: 'pedrito-macos-arm64', downloadUrl: 'https://example.com/bin', size: 1 },
      { name: 'pedrito-macos-arm64.sha256', downloadUrl: 'https://example.com/bin.sha256', size: 1 },
      fetchOk,
    );
    expect(download.verified).toBe(true);
    expect(existsSync(download.tempPath)).toBe(true);

    const fetchBad = (async (input: string | Request | URL) =>
      new Response(
        String(input).endsWith('.sha256') ? `deadbeef  pedrito-macos-arm64` : goodContent,
      )) as typeof fetch;

    await expect(
      downloadBinary(
        { name: 'pedrito-macos-arm64', downloadUrl: 'https://example.com/bin', size: 1 },
        { name: 'pedrito-macos-arm64.sha256', downloadUrl: 'https://example.com/bin.sha256', size: 1 },
        fetchBad,
      ),
    ).rejects.toBeInstanceOf(ChecksumError);
  });

  test('replaceBinary replaces file on unix-like platforms', async () => {
    const dir = createTestDir('replace');
    mkdirSync(dir, { recursive: true });
    const current = join(dir, 'pedrito');
    const temp = join(dir, 'pedrito.new');
    await Bun.write(current, 'old');
    await Bun.write(temp, 'new');

    const result = await replaceBinary({
      binaryName: 'pedrito',
      tempPath: temp,
      currentPath: current,
      platform: 'darwin',
    });

    expect(result.strategy).toBe('atomic');
    await expect(Bun.file(current).text()).resolves.toBe('new');
  });

  test('replaceBinary on windows leaves pending exe', async () => {
    const dir = createTestDir('replace-win');
    mkdirSync(dir, { recursive: true });
    const current = join(dir, 'pedrito.exe');
    const temp = join(dir, 'pedrito.tmp.exe');
    await Bun.write(current, 'old');
    await Bun.write(temp, 'new');

    const result = await replaceBinary({
      binaryName: 'pedrito',
      tempPath: temp,
      currentPath: current,
      platform: 'win32',
    });

    expect(result.strategy).toBe('pending-restart');
    expect(existsSync(join(dir, 'pedrito.new.exe'))).toBe(true);
  });

  test('applyPendingUpdate returns false when no pending exe exists', async () => {
    expect(await applyPendingUpdate(join(createTestDir('pending'), 'missing.exe'), 'win32')).toBe(false);
  });

  test('syncSkills dry-run reports differences without writing', async () => {
    const root = createTestDir('skills-dry');
    const home = join(root, 'skills-home');
    const kit = join(root, 'kit');
    mkdirSync(join(home, '.claude', 'skills'), { recursive: true });
    mkdirSync(join(kit, 'skills', 'alpha-skill'), { recursive: true });
    await Bun.write(join(kit, 'skills', 'alpha-skill', 'SKILL.md'), '# alpha');
    process.env.HOME = home;

    const store = new ConfigStore(join(home, '.pedrito', 'config.json'));
    store.write({
      version: '5.0.0',
      installedAt: new Date().toISOString(),
      agents: ['claude-code'],
      preset: 'minimal',
      mcp: [],
      gga: false,
      kitPath: kit,
    });

    const result = await syncSkills(kit, store, true);
    expect(result[0]?.added).toContain('alpha-skill');
    expect(existsSync(join(home, '.claude', 'skills', 'alpha-skill'))).toBe(false);
  });

  test('syncSkills copies new skills and runSync exports/imports files', async () => {
    const root = createTestDir('sync');
    const home = join(root, 'sync-home');
    const kit = join(root, 'sync-kit');
    const project = join(root, 'sync-project');
    const output = join(root, 'profile.json');
    mkdirSync(join(home, '.claude', 'skills'), { recursive: true });
    mkdirSync(join(kit, 'skills', 'beta-skill'), { recursive: true });
    mkdirSync(project, { recursive: true });
    await Bun.write(join(kit, 'skills', 'beta-skill', 'SKILL.md'), '# beta');
    process.env.HOME = home;

    const store = new ConfigStore(join(home, '.pedrito', 'config.json'));
    store.write({
      version: '5.0.0',
      installedAt: new Date().toISOString(),
      agents: ['claude-code'],
      preset: 'minimal',
      mcp: [],
      gga: false,
      kitPath: kit,
    });

    const syncResult = await syncSkills(kit, store, false);
    expect(syncResult[0]?.added).toContain('beta-skill');
    expect(existsSync(join(home, '.claude', 'skills', 'beta-skill', 'SKILL.md'))).toBe(true);

    const originalCwd = process.cwd();
    process.chdir(project);
    try {
      await runSync({ direction: 'to', target: output });
      expect(existsSync(output)).toBe(true);
      await runSync({ direction: 'from', target: output });
      expect(existsSync(join(project, '.agent'))).toBe(true);
    } finally {
      process.chdir(originalCwd);
    }
  });
});

function createTestDir(name: string): string {
  const dir = join(tmpRoot, `${name}-${randomUUID()}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}
