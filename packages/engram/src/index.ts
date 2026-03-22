// @pedrito/engram — SQLite + Hono memory server
export const VERSION = '5.0.0';

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
export { mcpRoutes, handleMcpRequest } from './mcp/server.js';
export { SessionStore } from './mcp/sessions.js';
export {
  OpenCodeEngramPlugin,
  createOpenCodeEngramPlugin,
} from './plugins/opencode/engram.js';
export type {
  EngramObservation as OpenCodeEngramObservation,
  EngramSession as OpenCodeEngramSession,
  OpenCodeObservation,
  OpenCodeProject,
  OpenCodeSessionSummary,
} from './plugins/opencode/engram.js';
