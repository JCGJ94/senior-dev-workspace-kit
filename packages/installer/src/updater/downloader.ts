import { createWriteStream, existsSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';
import type { ReleaseAsset } from './release.js';

export interface DownloadResult {
  tempPath: string;
  verified: boolean;
}

export class ChecksumError extends Error {
  constructor(assetName: string) {
    super(`Checksum verification failed for ${assetName}`);
  }
}

export async function downloadBinary(
  asset: ReleaseAsset,
  checksumAsset: ReleaseAsset,
  fetchImpl: typeof fetch = fetch,
): Promise<DownloadResult> {
  const tempPath = join(tmpdir(), `pedrito-update-${randomUUID()}`);
  try {
    const response = await fetchImpl(asset.downloadUrl);
    if (!response.ok || !response.body) {
      throw new Error(`Failed to download ${asset.name}`);
    }

    const file = createWriteStream(tempPath);
    for await (const chunk of response.body as unknown as AsyncIterable<Uint8Array>) {
      file.write(chunk);
    }
    file.end();

    await new Promise<void>((resolve, reject) => {
      file.on('finish', () => resolve());
      file.on('error', reject);
    });

    const checksumResponse = await fetchImpl(checksumAsset.downloadUrl);
    if (!checksumResponse.ok) {
      throw new Error(`Failed to download checksum for ${asset.name}`);
    }

    const expectedHash = ((await checksumResponse.text()).trim().split(/\s+/)[0] ?? '').trim();
    const hasher = new Bun.CryptoHasher('sha256');
    hasher.update(await Bun.file(tempPath).arrayBuffer());
    const actualHash = hasher.digest('hex');

    if (expectedHash !== actualHash) {
      throw new ChecksumError(asset.name);
    }

    return { tempPath, verified: true };
  } catch (error) {
    if (existsSync(tempPath)) {
      rmSync(tempPath, { force: true });
    }
    throw error;
  }
}
