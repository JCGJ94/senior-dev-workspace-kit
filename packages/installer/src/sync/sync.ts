import { writeFileSync } from 'fs';
import { ConfigStore } from '../config/config-store.js';
import { exportProfile } from '../profiles/exporter.js';
import { fetchProfile } from '../profiles/fetcher.js';
import { importProfile } from '../profiles/importer.js';

export interface SyncOptions {
  direction?: 'to' | 'from';
  target?: string;
  githubGist?: boolean;
  pull?: boolean;
}

export async function runSync(opts: SyncOptions): Promise<void> {
  const configStore = new ConfigStore();

  if (opts.direction === 'to' && opts.target) {
    const profile = exportProfile('pedrito-sync', '', configStore);
    writeFileSync(opts.target, JSON.stringify(profile, null, 2), 'utf8');
    return;
  }

  if (opts.direction === 'from' && opts.target) {
    const profile = await fetchProfile(opts.target);
    await importProfile(profile, { projectPath: process.cwd() });
    return;
  }

  if (opts.githubGist) {
    await syncViaGist(Boolean(opts.pull), configStore);
    return;
  }

  throw new Error('Unsupported sync options');
}

async function syncViaGist(pull: boolean, configStore: ConfigStore): Promise<void> {
  const config = configStore.read();
  if (!Bun.which('gh')) {
    throw new Error('gh CLI is required. Run `gh auth login` first.');
  }

  if (pull) {
    const gistId = config?.sync?.gistId;
    if (!gistId) {
      throw new Error('No gistId configured for sync pull');
    }
    const result = Bun.spawnSync(['gh', 'gist', 'view', gistId, '--raw'], {
      stdout: 'pipe',
      stderr: 'pipe',
    });
    if (result.exitCode !== 0) {
      throw new Error(new TextDecoder().decode(result.stderr));
    }
    const profile = JSON.parse(new TextDecoder().decode(result.stdout)) as Awaited<
      ReturnType<typeof fetchProfile>
    >;
    await importProfile(profile, { projectPath: process.cwd() });
    configStore.update({
      sync: { gistId, lastSyncAt: new Date().toISOString() },
    });
    return;
  }

  const profile = exportProfile('pedrito-sync', '', configStore);
  const tempPath = `/tmp/pedrito-profile-${crypto.randomUUID()}.json`;
  await Bun.write(tempPath, JSON.stringify(profile, null, 2));

  const gistId = config?.sync?.gistId;
  let resolvedGistId = gistId;
  if (!gistId) {
    const result = Bun.spawnSync(
      ['gh', 'gist', 'create', '--secret', tempPath, '--filename', 'pedrito-profile.json'],
      {
        stdout: 'pipe',
        stderr: 'pipe',
      },
    );
    if (result.exitCode !== 0) {
      throw new Error(new TextDecoder().decode(result.stderr));
    }
    const output = new TextDecoder().decode(result.stdout).trim();
    const parsedGistId = output.split('/').at(-1);
    if (!parsedGistId) {
      throw new Error('Could not parse gist id from gh output');
    }
    resolvedGistId = parsedGistId;
  } else {
    const result = Bun.spawnSync(['gh', 'gist', 'edit', gistId, tempPath], {
      stdout: 'pipe',
      stderr: 'pipe',
    });
    if (result.exitCode !== 0) {
      throw new Error(new TextDecoder().decode(result.stderr));
    }
  }

  if (!resolvedGistId) {
    throw new Error('No gist id available after sync');
  }

  configStore.update({
    sync: { gistId: resolvedGistId, lastSyncAt: new Date().toISOString() },
  });
}
