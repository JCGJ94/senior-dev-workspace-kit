import type { AIProvider } from './provider.interface.js';

export async function spawnProvider(
  name: string,
  command: string[],
  prompt: string,
  timeout: number,
): Promise<string> {
  const proc = Bun.spawn(command, {
    stdin: new TextEncoder().encode(prompt),
    stdout: 'pipe',
    stderr: 'pipe',
    cwd: process.cwd(),
  });

  const timer = setTimeout(() => {
    proc.kill();
  }, timeout);

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  clearTimeout(timer);

  if (exitCode !== 0) {
    throw new Error(`${name} provider failed: ${stderr || `exit ${exitCode}`}`);
  }

  return stdout.trim();
}

export function createProvider(
  name: string,
  handler: (prompt: string, timeout: number) => Promise<string>,
): AIProvider {
  return {
    name,
    call(prompt: string, timeout: number) {
      return handler(prompt, timeout);
    },
  };
}
