import { createProvider } from './shared.js';

export function createGitHubModelsProvider(model = 'gpt-4o-mini') {
  return createProvider(`github:${model}`, async (prompt, timeout) => {
    const tokenProc = Bun.spawn(['gh', 'auth', 'token'], {
      stdout: 'pipe',
      stderr: 'pipe',
    });
    const [token, stderr, exitCode] = await Promise.all([
      new Response(tokenProc.stdout).text(),
      new Response(tokenProc.stderr).text(),
      tokenProc.exited,
    ]);

    if (exitCode !== 0) {
      throw new Error(`github provider failed to obtain auth token: ${stderr}`);
    }

    const response = await fetch('https://models.github.ai/inference/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.trim()}`,
      },
      signal: AbortSignal.timeout(timeout),
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`github provider failed: ${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content?.trim() ?? '';
  });
}
