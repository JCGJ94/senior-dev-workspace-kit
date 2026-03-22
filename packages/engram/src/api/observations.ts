import { Hono } from 'hono';
import type { Database } from 'bun:sqlite';
import {
  upsertObservation,
  searchObservations,
  getProjectContext,
  deleteObservation,
} from '../db/queries.js';
import type { ObservationType } from '../db/queries.js';

export function observationsRoutes(db: Database): Hono {
  const app = new Hono();

  app.post('/', async (c) => {
    const body = await c.req.json<{
      session_id?: string;
      project: string;
      type: ObservationType;
      topic_key: string;
      content: string;
      tags?: string[];
    }>();
    const obs = upsertObservation(db, {
      session_id: body.session_id,
      project: body.project,
      type: body.type,
      topic_key: body.topic_key,
      content: body.content,
      tags: body.tags ? JSON.stringify(body.tags) : '[]',
    });
    return c.json(obs, 201);
  });

  app.get('/search', (c) => {
    const q = c.req.query('q') ?? '';
    if (!q) return c.json({ error: 'q is required' }, 400);
    const project = c.req.query('project');
    const type = c.req.query('type');
    const limit = Number(c.req.query('limit') ?? 20);
    return c.json(searchObservations(db, q, project, type, limit));
  });

  app.get('/context', (c) => {
    const project = c.req.query('project') ?? '';
    return c.json(getProjectContext(db, project));
  });

  app.delete('/:id', (c) => {
    deleteObservation(db, c.req.param('id'));
    return c.json({ ok: true });
  });

  return app;
}
