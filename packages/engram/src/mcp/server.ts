import { Hono } from 'hono';
import type { Database } from 'bun:sqlite';
import {
  searchObservations,
  getProjectContext,
  upsertObservation,
} from '../db/queries.js';
import type { ObservationType } from '../db/queries.js';

const TOOLS = [
  {
    name: 'search_memory',
    description: 'Search Engram memory observations by full-text query',
    inputSchema: {
      type: 'object',
      properties: {
        q: { type: 'string', description: 'Search query' },
        project: { type: 'string', description: 'Filter by project name' },
        type: { type: 'string', description: 'Filter by type: decision|bug|pattern|convention|lesson' },
      },
      required: ['q'],
    },
  },
  {
    name: 'get_context',
    description: 'Get all memory observations for a project',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'Project name' },
      },
      required: ['project'],
    },
  },
  {
    name: 'save_observation',
    description: 'Save a new memory observation (upsert by topic_key)',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string' },
        type: { type: 'string', enum: ['decision', 'bug', 'pattern', 'convention', 'lesson'] },
        topic_key: { type: 'string', description: 'Unique key for deduplication' },
        content: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
      },
      required: ['project', 'type', 'topic_key', 'content'],
    },
  },
];

interface McpRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

export function mcpRoutes(db: Database): Hono {
  const app = new Hono();

  // Discovery endpoint
  app.get('/mcp', (c) =>
    c.json({ name: 'engram', version: '4.0.0', tools: TOOLS }),
  );

  // JSON-RPC 2.0 handler
  app.post('/mcp', async (c) => {
    const req = await c.req.json<McpRequest>();
    const { method, params, id } = req;

    if (method === 'tools/list') {
      return c.json({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
    }

    if (method === 'tools/call') {
      const { name, arguments: args = {} } = params as {
        name: string;
        arguments?: Record<string, unknown>;
      };

      let result: unknown;
      try {
        if (name === 'search_memory') {
          result = searchObservations(
            db,
            args['q'] as string,
            args['project'] as string | undefined,
            args['type'] as string | undefined,
          );
        } else if (name === 'get_context') {
          result = getProjectContext(db, args['project'] as string);
        } else if (name === 'save_observation') {
          result = upsertObservation(db, {
            project: args['project'] as string,
            type: args['type'] as ObservationType,
            topic_key: args['topic_key'] as string,
            content: args['content'] as string,
            tags: JSON.stringify(args['tags'] ?? []),
          });
        } else {
          return c.json({
            jsonrpc: '2.0',
            id,
            error: { code: -32601, message: `Unknown tool: ${name}` },
          });
        }
      } catch (err) {
        return c.json({
          jsonrpc: '2.0',
          id,
          error: { code: -32603, message: String(err) },
        });
      }

      return c.json({
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        },
      });
    }

    return c.json({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Method not found: ${method}` },
    });
  });

  return app;
}
