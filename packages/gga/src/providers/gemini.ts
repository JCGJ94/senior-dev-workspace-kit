import { createProvider, spawnProvider } from './shared.js';

export function createGeminiProvider() {
  return createProvider('gemini', (prompt, timeout) =>
    spawnProvider('gemini', ['gemini', '-p'], prompt, timeout),
  );
}
