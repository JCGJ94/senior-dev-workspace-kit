export interface ReleaseAsset {
  name: string;
  downloadUrl: string;
  size: number;
}

export interface ReleaseInfo {
  version: string;
  tag: string;
  publishedAt: string;
  isPrerelease: boolean;
  assets: ReleaseAsset[];
}

export const PEDRITO_REPO = process.env.PEDRITO_REPO ?? 'josec/pedrito';

export async function getLatestRelease(
  repo: string,
  includePrerelease: boolean,
  fetchImpl: typeof fetch = fetch,
): Promise<ReleaseInfo> {
  if (!includePrerelease) {
    const response = await fetchImpl(`https://api.github.com/repos/${repo}/releases/latest`);
    if (!response.ok) {
      throw new Error(`Failed to fetch latest release for ${repo}`);
    }
    return mapRelease(await response.json());
  }

  const response = await fetchImpl(`https://api.github.com/repos/${repo}/releases`);
  if (!response.ok) {
    throw new Error(`Failed to fetch releases for ${repo}`);
  }

  const releases = (await response.json()) as unknown[];
  const first = releases
    .map((entry) => mapRelease(entry))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];

  if (!first) {
    throw new Error(`No releases found for ${repo}`);
  }

  return first;
}

export async function getRelease(
  repo: string,
  version: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ReleaseInfo> {
  const response = await fetchImpl(`https://api.github.com/repos/${repo}/releases/tags/v${version}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch release v${version} for ${repo}`);
  }
  return mapRelease(await response.json());
}

export function currentTarget(): string {
  const platform =
    process.platform === 'darwin'
      ? 'macos'
      : process.platform === 'linux'
        ? 'linux'
        : process.platform === 'win32'
          ? 'windows'
          : process.platform;

  const arch = process.arch === 'arm64' ? 'arm64' : process.arch === 'x64' ? 'x64' : process.arch;

  return `${platform}-${arch}`;
}

function mapRelease(raw: unknown): ReleaseInfo {
  const release = raw as {
    tag_name: string;
    published_at: string;
    prerelease: boolean;
    assets?: Array<{ name: string; browser_download_url: string; size: number }>;
  };

  return {
    version: release.tag_name.replace(/^v/, ''),
    tag: release.tag_name,
    publishedAt: release.published_at,
    isPrerelease: Boolean(release.prerelease),
    assets: (release.assets ?? []).map((asset) => ({
      name: asset.name,
      downloadUrl: asset.browser_download_url,
      size: asset.size,
    })),
  };
}
