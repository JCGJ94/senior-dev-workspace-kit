import { describe, expect, test } from 'bun:test';
import { VERSION } from './index.js';

describe('@pedrito/gga', () => {
  test('exports VERSION', () => {
    expect(VERSION).toBe('4.0.0');
  });
});
