// @pedrito/engram — SQLite + Hono memory server
export const VERSION = '4.0.0';

export { openDb, runMigrations } from './db/migrations.js';
export {
  createSession,
  updateSession,
  listSessions,
  upsertObservation,
  searchObservations,
  getProjectContext,
  deleteObservation,
} from './db/queries.js';
export type { Session, Observation, ObservationType, NewObservation } from './db/queries.js';
export { createApp } from './api/routes.js';
export { mcpRoutes } from './mcp/server.js';
