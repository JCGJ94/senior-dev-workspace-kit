export interface MCPServerDefinition {
  name: string;
  transport: 'sse' | 'stdio' | 'http';
  url?: string;
  command?: string;
  args?: string[];
}

export const MCP_SERVERS: MCPServerDefinition[] = [
  {
    name: 'engram',
    transport: 'sse',
    url: 'http://127.0.0.1:7437/mcp/sse',
  },
  {
    name: 'context7',
    transport: 'stdio',
    command: 'npx',
    args: ['@upstash/context7-mcp@latest'],
  },
  {
    name: 'notion',
    transport: 'http',
  },
  {
    name: 'jira',
    transport: 'http',
  },
];
