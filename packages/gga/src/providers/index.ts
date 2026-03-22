import type { AIProvider } from './provider.interface.js';
import { createClaudeProvider } from './claude.js';
import { createGeminiProvider } from './gemini.js';
import { createGitHubModelsProvider } from './github.js';
import { createLMStudioProvider } from './lmstudio.js';
import { createOllamaProvider } from './ollama.js';
import { createOpenCodeProvider } from './opencode.js';

export function getProvider(providerString: string): AIProvider {
  const [name, model] = providerString.split(':', 2);

  switch (name) {
    case 'claude':
      return createClaudeProvider();
    case 'gemini':
      return createGeminiProvider();
    case 'opencode':
      return createOpenCodeProvider();
    case 'ollama':
      return createOllamaProvider(model || 'llama3');
    case 'lmstudio':
      return createLMStudioProvider(model || 'local-model');
    case 'github':
      return createGitHubModelsProvider(model || 'gpt-4o-mini');
    default:
      throw new Error(`Unsupported provider: ${providerString}`);
  }
}
