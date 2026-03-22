import { existsSync, readFileSync } from 'fs';
import { FetchError, PedritoProfileSchema, ProfileVersionError, type PedritoProfile } from './profile.schema.js';

export async function fetchProfile(urlOrPath: string): Promise<PedritoProfile> {
  let raw: string;

  if (isRemote(urlOrPath)) {
    const normalized = normalizeGitHubUrl(urlOrPath);
    const response = await fetch(normalized);
    if (!response.ok) {
      throw new FetchError(urlOrPath);
    }
    raw = await response.text();
  } else {
    if (!existsSync(urlOrPath)) {
      throw new FetchError(urlOrPath);
    }
    raw = readFileSync(urlOrPath, 'utf8');
  }

  const parsed = PedritoProfileSchema.parse(JSON.parse(raw));
  if (parsed.version !== '1') {
    throw new ProfileVersionError(parsed.version);
  }
  return parsed;
}

function isRemote(value: string): boolean {
  return /^https?:\/\//.test(value);
}

export function normalizeGitHubUrl(url: string): string {
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);
  if (!match) {
    return url;
  }

  const [, owner, repo, branch, path] = match;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}
