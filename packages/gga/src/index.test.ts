import { afterEach, describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import {
  VERSION,
  buildPrompt,
  checkCache,
  clearCache,
  extractRules,
  getDefaultConfig,
  getProvider,
  loadConfig,
  parseResponse,
  writeCache,
} from './index.js';

const tmpRoot = join(process.cwd(), '.tmp-gga-tests');

afterEach(() => {
  rmSync(tmpRoot, { recursive: true, force: true });
});

describe('@pedrito/gga', () => {
  test('exports VERSION', () => {
    expect(VERSION).toBe('5.0.0');
  });

  test('parseResponse handles passed result', () => {
    const parsed = parseResponse('VERDICT: PASSED');
    expect(parsed.verdict).toBe('PASSED');
    expect(parsed.issues).toHaveLength(0);
  });

  test('parseResponse handles failed result', () => {
    const parsed = parseResponse(`VERDICT: FAILED\nISSUE: src/main.ts | error | Missing null check`);
    expect(parsed.verdict).toBe('FAILED');
    expect(parsed.issues[0]).toEqual({
      file: 'src/main.ts',
      severity: 'error',
      message: 'Missing null check',
    });
  });

  test('parseResponse marks malformed response as failed', () => {
    const parsed = parseResponse('hello world');
    expect(parsed.verdict).toBe('FAILED');
    expect(parsed.issues[0]?.message).toContain('malformed');
  });

  test('extractRules prefers AGENTS.md', () => {
    const cwd = setupDir('rules-agents');
    writeFileSync(
      join(cwd, 'AGENTS.md'),
      '# Project\n\n# Rules\nAlways validate inputs.\n\n# Notes\nIgnore this.',
      'utf8',
    );
    const rules = extractRules(undefined, cwd);
    expect(rules).toContain('Always validate inputs');
    expect(rules).not.toContain('Ignore this');
  });

  test('extractRules falls back to CLAUDE.md', () => {
    const cwd = setupDir('rules-claude');
    writeFileSync(join(cwd, 'CLAUDE.md'), '# Guidelines\nWrite tests for bug fixes.', 'utf8');
    expect(extractRules(undefined, cwd)).toContain('Write tests');
  });

  test('extractRules falls back to generic rules', () => {
    const cwd = setupDir('rules-default');
    expect(extractRules(undefined, cwd)).toContain('Review staged code');
  });

  test('cache read and write roundtrip', () => {
    const cacheDir = join(setupDir('cache'), 'cache');
    writeCache(cacheDir, 'demo', {
      sha256: 'abc',
      provider: 'claude',
      result: 'PASSED',
      timestamp: 123,
    });
    expect(checkCache(cacheDir, 'demo', 'abc')?.provider).toBe('claude');
  });

  test('clearCache removes project entries', () => {
    const cacheDir = join(setupDir('cache-clear'), 'cache');
    writeCache(cacheDir, 'demo', {
      sha256: 'abc',
      provider: 'claude',
      result: 'PASSED',
      timestamp: 123,
    });
    clearCache(cacheDir, 'demo');
    expect(checkCache(cacheDir, 'demo', 'abc')).toBeNull();
  });

  test('buildPrompt includes rules and files', () => {
    const prompt = buildPrompt(
      [{ path: 'src/index.ts', content: 'const x = 1;', sha256: 'hash', status: 'M' }],
      'Validate inputs.',
    );
    expect(prompt).toContain('Validate inputs');
    expect(prompt).toContain('src/index.ts');
    expect(prompt).toContain('const x = 1;');
  });

  test('loadConfig merges defaults with .gga', () => {
    const cwd = setupDir('config');
    writeFileSync(
      join(cwd, '.gga'),
      'provider = "ollama:llama3"\nfail_open = true\nexclude = ["vendor/**"]',
      'utf8',
    );
    const config = loadConfig(cwd);
    expect(config.provider).toBe('ollama:llama3');
    expect(config.fail_open).toBe(true);
    expect(config.exclude).toEqual(['vendor/**']);
  });

  test('default config contains cache dir and provider', () => {
    const config = getDefaultConfig();
    expect(config.provider).toBe('claude');
    expect(config.cache_dir.length).toBeGreaterThan(0);
  });

  test('getProvider resolves provider aliases', () => {
    expect(getProvider('claude').name).toBe('claude');
    expect(getProvider('ollama:llama3').name).toBe('ollama:llama3');
    expect(getProvider('github:gpt-4o').name).toBe('github:gpt-4o');
  });
});

function setupDir(name: string): string {
  const dir = join(tmpRoot, name);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
}
