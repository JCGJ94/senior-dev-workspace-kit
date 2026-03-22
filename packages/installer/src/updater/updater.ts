import { VERSION } from '../version.js';
import { ConfigStore } from '../config/config-store.js';
import { downloadBinary } from './downloader.js';
import { getLatestRelease, getRelease, currentTarget, PEDRITO_REPO, type ReleaseAsset } from './release.js';
import { replaceBinary } from './replacer.js';
import { resolveKitPath, syncSkills } from './skills-sync.js';

export interface UpdateOptions {
  components: Array<'pedrito' | 'engram' | 'gga' | 'skills'>;
  version?: string;
  includePrerelease?: boolean;
  dryRun?: boolean;
  yes?: boolean;
}

export interface UpdateReport {
  component: string;
  previousVersion: string;
  newVersion: string;
  status: 'updated' | 'already-latest' | 'skipped' | 'error';
  error?: string;
}

export async function runUpdate(opts: UpdateOptions): Promise<UpdateReport[]> {
  const configStore = new ConfigStore();
  const reports: UpdateReport[] = [];

  if (opts.components.includes('skills')) {
    try {
      const kitPath = resolveKitPath(configStore);
      const results = await syncSkills(kitPath, configStore, Boolean(opts.dryRun));
      reports.push({
        component: 'skills',
        previousVersion: VERSION,
        newVersion: VERSION,
        status: opts.dryRun ? 'skipped' : 'updated',
        error: JSON.stringify(results),
      });
    } catch (error) {
      reports.push(reportError('skills', VERSION, VERSION, error));
    }
  }

  const binaryComponents = opts.components.filter((component) => component !== 'skills');
  if (binaryComponents.length === 0) {
    return reports;
  }

  let release;
  try {
    release = opts.version
      ? await getRelease(PEDRITO_REPO, opts.version)
      : await getLatestRelease(PEDRITO_REPO, Boolean(opts.includePrerelease));
  } catch (error) {
    if (opts.dryRun) {
      for (const component of binaryComponents) {
        reports.push({
          component,
          previousVersion: VERSION,
          newVersion: VERSION,
          status: 'skipped',
          error: `dry-run without release metadata: ${
            error instanceof Error ? error.message : String(error)
          }`,
        });
      }
      return reports;
    }
    throw error;
  }
  const target = currentTarget();

  for (const component of binaryComponents) {
    try {
      if (release.version === VERSION) {
        reports.push({
          component,
          previousVersion: VERSION,
          newVersion: release.version,
          status: 'already-latest',
        });
        continue;
      }

      if (opts.dryRun) {
        reports.push({
          component,
          previousVersion: VERSION,
          newVersion: release.version,
          status: 'skipped',
        });
        continue;
      }

      const { asset, checksumAsset } = findAssets(release.assets, component, target);
      const download = await downloadBinary(asset, checksumAsset);
      await replaceBinary({ binaryName: toBinaryName(component), tempPath: download.tempPath });
      configStore.update({ version: release.version });
      reports.push({
        component,
        previousVersion: VERSION,
        newVersion: release.version,
        status: 'updated',
      });
    } catch (error) {
      reports.push(reportError(component, VERSION, release.version, error));
    }
  }

  return reports;
}

function findAssets(
  assets: ReleaseAsset[],
  component: 'pedrito' | 'engram' | 'gga',
  target: string,
): { asset: ReleaseAsset; checksumAsset: ReleaseAsset } {
  const baseName =
    component === 'pedrito'
      ? `pedrito-${target}`
      : component === 'engram'
        ? `pedrito-engram-${target}`
        : `gga-${target}`;

  const ext = target === 'windows-x64' ? '.exe' : '';
  const asset = assets.find((entry) => entry.name === `${baseName}${ext}`);
  const checksumAsset = assets.find((entry) => entry.name === `${baseName}${ext}.sha256`);
  if (!asset || !checksumAsset) {
    throw new Error(`Missing release assets for ${component} on ${target}`);
  }
  return { asset, checksumAsset };
}

function toBinaryName(component: 'pedrito' | 'engram' | 'gga'): string {
  return component === 'engram' ? 'pedrito-engram' : component;
}

function reportError(
  component: string,
  previousVersion: string,
  newVersion: string,
  error: unknown,
): UpdateReport {
  return {
    component,
    previousVersion,
    newVersion,
    status: 'error',
    error: error instanceof Error ? error.message : String(error),
  };
}
