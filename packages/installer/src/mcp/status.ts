import { MCP_SERVERS } from './catalog.js';

export interface MCPStatus {
  server: string;
  configured: boolean;
  reachable?: boolean;
}

export async function checkMCPStatus(): Promise<MCPStatus[]> {
  const statuses: MCPStatus[] = [];

  for (const server of MCP_SERVERS) {
    if (server.name === 'engram' && server.url) {
      let reachable = false;
      try {
        const response = await fetch('http://127.0.0.1:7437/health', {
          signal: AbortSignal.timeout(1500),
        });
        reachable = response.ok;
      } catch {
        reachable = false;
      }

      statuses.push({ server: server.name, configured: true, reachable });
      continue;
    }

    statuses.push({ server: server.name, configured: true });
  }

  return statuses;
}
