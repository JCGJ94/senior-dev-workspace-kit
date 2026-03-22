import { Hono } from 'hono';
import type { Database } from 'bun:sqlite';
import { sessionsRoutes } from './sessions.js';
import { observationsRoutes } from './observations.js';

export function createApp(db: Database): Hono {
  const app = new Hono();

  app.route('/sessions', sessionsRoutes(db));
  app.route('/observations', observationsRoutes(db));

  app.get('/health', (c) => c.json({ status: 'ok', ts: Date.now() }));

  app.get('/health/db', (c) => {
    const row = db
      .query(`SELECT count(*) as obs FROM observations`)
      .get() as { obs: number };
    return c.json({ status: 'ok', observations: row.obs });
  });

  return app;
}
