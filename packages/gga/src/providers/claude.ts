import { createProvider, spawnProvider } from './shared.js';

export function createClaudeProvider() {
  return createProvider('claude', (prompt, timeout) =>
    spawnProvider('claude', ['claude', '--print'], prompt, timeout),
  );
}
