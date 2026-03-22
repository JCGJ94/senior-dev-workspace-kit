import { describe, expect, test } from 'bun:test';
import { VERSION } from './version.js';

describe('@pedrito/installer', () => {
  test('exports VERSION', () => {
    expect(VERSION.startsWith('4.0.0')).toBe(true);
  });
});
