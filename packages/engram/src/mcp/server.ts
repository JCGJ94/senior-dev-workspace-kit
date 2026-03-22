import { Hono } from 'hono';
import type { Database } from 'bun:sqlite';
import {
  searchObservations,
  getProjectContext,
  upsertObservation,
  deleteObservation,
} from '../db/queries.js';
import type { ObservationType } from '../db/queries.js';
import { SessionStore } from './sessions.js';

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
  {
    name: 'delete_observation',
    description: 'Delete a saved observation by id',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Observation id' },
      },
      required: ['id'],
    },
  },
];

interface McpRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

interface McpResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string };
}

const SERVER_INFO = {
  protocolVersion: '2024-11-05',
  capabilities: { tools: { listChanged: false } },
  serverInfo: { name: 'engram', version: '4.0.0' },
};

export function handleMcpRequest(db: Database, req: McpRequest): McpResponse {
  const { method, params, id } = req;

  if (method === 'initialize') {
    return { jsonrpc: '2.0', id, result: SERVER_INFO };
  }

  if (method === 'notifications/initialized') {
    return { jsonrpc: '2.0', id: id ?? null, result: { ok: true } };
  }

  if (method === 'tools/list') {
    return { jsonrpc: '2.0', id, result: { tools: TOOLS } };
  }

  if (method === 'tools/call') {
    const { name, arguments: args = {} } = (params ?? {}) as {
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
      } else if (name === 'delete_observation') {
        deleteObservation(db, args['id'] as string);
        result = { ok: true, id: args['id'] };
      } else {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Unknown tool: ${name}` },
        };
      }
    } catch (err) {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32603, message: String(err) },
      };
    }

    return {
      jsonrpc: '2.0',
      id,
      result: {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      },
    };
  }

  return {
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  };
}

export function mcpRoutes(db: Database, sessionStore = new SessionStore()): Hono {
  const app = new Hono();
  const pruneIntervalMs = 5 * 60 * 1000;

  // Discovery endpoint
  app.get('/mcp', (c) =>
    c.json({ name: 'engram', version: '4.0.0', tools: TOOLS }),
  );

  app.get('/mcp/sse', (c) => {
    const session = sessionStore.createSession();
    session.send({
      event: 'endpoint',
      data: JSON.stringify({
        sessionId: session.id,
        endpoint: `/mcp/message?sessionId=${session.id}`,
      }),
    });

    sessionStore.prune(pruneIntervalMs);

    return new Response(session.stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  });

  // JSON-RPC 2.0 handler
  app.post('/mcp', async (c) => {
    const req = await c.req.json<McpRequest>();
    return c.json(handleMcpRequest(db, req));
  });

  app.post('/mcp/message', async (c) => {
    const sessionId = c.req.query('sessionId');
    if (!sessionId) {
      return c.json({ error: 'sessionId is required' }, 400);
    }

    const session = sessionStore.get(sessionId);
    if (!session) {
      return c.json({ error: 'unknown sessionId' }, 404);
    }

    const req = await c.req.json<McpRequest>();
    const response = handleMcpRequest(db, req);
    session.send({ event: 'message', data: JSON.stringify(response) });
    return c.body(null, 202);
  });

  return app;
}
