import { createProvider } from './shared.js';

export function createOllamaProvider(model = 'llama3') {
  return createProvider(`ollama:${model}`, async (prompt, timeout) => {
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(timeout),
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`ollama provider failed: ${response.status}`);
    }

    const data = (await response.json()) as { response?: string };
    return data.response?.trim() ?? '';
  });
}
