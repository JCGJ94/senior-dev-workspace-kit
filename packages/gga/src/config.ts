import { existsSync, readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export interface GGAConfig {
  provider: string;
  timeout: number;
  cache_dir: string;
  rules_file?: string;
  fail_open: boolean;
  exclude: string[];
  max_file_size: number;
}

const DEFAULT_CONFIG: GGAConfig = {
  provider: 'claude',
  timeout: 30_000,
  cache_dir: join(homedir(), '.cache', 'gga'),
  fail_open: false,
  exclude: ['node_modules/**', 'dist/**', '.git/**'],
  max_file_size: 256 * 1024,
};

export function loadConfig(cwd: string): GGAConfig {
  const configPaths = [
    join(homedir(), '.config', 'gga', 'config'),
    join(cwd, '.gga'),
  ];

  let merged: GGAConfig = { ...DEFAULT_CONFIG };
  for (const configPath of configPaths) {
    if (!existsSync(configPath)) {
      continue;
    }

    const parsed = parseSimpleToml(readFileSync(configPath, 'utf8'));
    merged = mergeConfig(merged, parsed);
  }

  return merged;
}

function mergeConfig(current: GGAConfig, parsed: Partial<GGAConfig>): GGAConfig {
  return {
    ...current,
    ...parsed,
    exclude: parsed.exclude ?? current.exclude,
  };
}

function parseSimpleToml(raw: string): Partial<GGAConfig> {
  const result: Partial<GGAConfig> = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const idx = trimmed.indexOf('=');
    if (idx < 0) {
      continue;
    }

    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    assignTomlValue(result, key, value);
  }

  return result;
}

function assignTomlValue(config: Partial<GGAConfig>, key: string, rawValue: string): void {
  const value = parseValue(rawValue);

  switch (key) {
    case 'provider':
    case 'cache_dir':
    case 'rules_file':
      if (typeof value === 'string') {
        Object.assign(config, { [key]: value });
      }
      break;
    case 'timeout':
    case 'max_file_size':
      if (typeof value === 'number') {
        Object.assign(config, { [key]: value });
      }
      break;
    case 'fail_open':
      if (typeof value === 'boolean') {
        config.fail_open = value;
      }
      break;
    case 'exclude':
      if (Array.isArray(value) && value.every((entry) => typeof entry === 'string')) {
        config.exclude = value;
      }
      break;
    default:
      break;
  }
}

function parseValue(rawValue: string): string | number | boolean | string[] {
  if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
    const body = rawValue.slice(1, -1).trim();
    if (!body) {
      return [];
    }

    return body
      .split(',')
      .map((item) => stripQuotes(item.trim()))
      .filter(Boolean);
  }

  if (rawValue === 'true') {
    return true;
  }
  if (rawValue === 'false') {
    return false;
  }

  if (/^-?\d+$/.test(rawValue)) {
    return Number(rawValue);
  }

  return stripQuotes(rawValue);
}

function stripQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

export function getDefaultConfig(): GGAConfig {
  return { ...DEFAULT_CONFIG, exclude: [...DEFAULT_CONFIG.exclude] };
}
