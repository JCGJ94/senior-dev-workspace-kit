import { createProvider, spawnProvider } from './shared.js';

export function createOpenCodeProvider() {
  return createProvider('opencode', (prompt, timeout) =>
    spawnProvider('opencode', ['opencode', 'run'], prompt, timeout),
  );
}
