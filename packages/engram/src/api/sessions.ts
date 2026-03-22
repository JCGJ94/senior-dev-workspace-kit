import { Hono } from 'hono';
import type { Database } from 'bun:sqlite';
import { createSession, updateSession, listSessions } from '../db/queries.js';

export function sessionsRoutes(db: Database): Hono {
  const app = new Hono();

  app.post('/', async (c) => {
    const body = await c.req.json<{ project: string; agent?: string; goal?: string }>();
    const session = createSession(db, {
      project: body.project,
      agent: body.agent ?? 'unknown',
      goal: body.goal,
    });
    return c.json(session, 201);
  });

  app.patch('/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json<{ ended_at?: number; goal?: string; summary?: string }>();
    updateSession(db, id, {
      ended_at: body.ended_at,
      goal: body.goal,
      summary: body.summary,
    });
    return c.json({ ok: true });
  });

  app.get('/', (c) => {
    const project = c.req.query('project') ?? '';
    const limit = Number(c.req.query('limit') ?? 5);
    return c.json(listSessions(db, project, limit));
  });

  return app;
}
