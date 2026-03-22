import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { Database } from 'bun:sqlite';
import { runMigrations } from './db/migrations.js';
import {
  createSession,
  updateSession,
  listSessions,
  upsertObservation,
  searchObservations,
  getProjectContext,
  deleteObservation,
  getObservationByKey,
} from './db/queries.js';
import { createApp } from './api/routes.js';
import { handleMcpRequest } from './mcp/server.js';
import { SessionStore } from './mcp/sessions.js';

let db: Database;

beforeEach(() => {
  db = new Database(':memory:');
  runMigrations(db);
});

afterEach(() => {
  db.close();
});

// ── Sessions ─────────────────────────────────────────────────────────────────

describe('sessions', () => {
  test('creates session with id and timestamps', () => {
    const s = createSession(db, { project: 'my-project', agent: 'claude-code', goal: 'Build auth' });
    expect(s.id).toBeTruthy();
    expect(s.project).toBe('my-project');
    expect(s.agent).toBe('claude-code');
    expect(s.started_at).toBeGreaterThan(0);
  });

  test('updates session summary and ended_at', () => {
    const s = createSession(db, { project: 'p', agent: 'claude', goal: null });
    const endedAt = Date.now();
    updateSession(db, s.id, { summary: 'Completed auth feature', ended_at: endedAt });
    const row = db
      .query(`SELECT summary, ended_at FROM sessions WHERE id = ?`)
      .get(s.id) as { summary: string; ended_at: number };
    expect(row.summary).toBe('Completed auth feature');
    expect(row.ended_at).toBe(endedAt);
  });

  test('lists sessions for a project', () => {
    createSession(db, { project: 'proj', agent: 'claude', goal: null });
    createSession(db, { project: 'proj', agent: 'opencode', goal: null });
    createSession(db, { project: 'other', agent: 'claude', goal: null });
    const sessions = listSessions(db, 'proj');
    expect(sessions.length).toBe(2);
  });
});

// ── Observations ─────────────────────────────────────────────────────────────

describe('observations', () => {
  test('upserts and retrieves by topic_key', () => {
    upsertObservation(db, {
      project: 'proj',
      type: 'decision',
      topic_key: 'auth-strategy',
      content: 'Use JWT with refresh tokens',
      tags: '["auth", "jwt"]',
    });
    const obs = getObservationByKey(db, 'proj', 'auth-strategy');
    expect(obs).toBeTruthy();
    expect(obs?.content).toBe('Use JWT with refresh tokens');
    expect(obs?.type).toBe('decision');
  });

  test('upsert deduplicates — same topic_key updates content', () => {
    upsertObservation(db, { project: 'p', type: 'pattern', topic_key: 'same', content: 'v1', tags: '[]' });
    upsertObservation(db, { project: 'p', type: 'pattern', topic_key: 'same', content: 'v2 updated', tags: '[]' });
    const ctx = getProjectContext(db, 'p');
    expect(ctx.length).toBe(1);
    expect(ctx[0]?.content).toBe('v2 updated');
  });

  test('different projects can have same topic_key', () => {
    upsertObservation(db, { project: 'proj-a', type: 'lesson', topic_key: 'k', content: 'a', tags: '[]' });
    upsertObservation(db, { project: 'proj-b', type: 'lesson', topic_key: 'k', content: 'b', tags: '[]' });
    expect(getProjectContext(db, 'proj-a').length).toBe(1);
    expect(getProjectContext(db, 'proj-b').length).toBe(1);
  });

  test('FTS5 search returns relevant results', () => {
    upsertObservation(db, { project: 'p', type: 'decision', topic_key: 'auth', content: 'Use JWT for authentication tokens', tags: '["auth"]' });
    upsertObservation(db, { project: 'p', type: 'pattern', topic_key: 'db', content: 'Use connection pooling for database access', tags: '["db"]' });
    const results = searchObservations(db, 'JWT', 'p');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.topic_key).toBe('auth');
  });

  test('search with type filter', () => {
    upsertObservation(db, { project: 'p', type: 'decision', topic_key: 'k1', content: 'Auth decision', tags: '[]' });
    upsertObservation(db, { project: 'p', type: 'lesson', topic_key: 'k2', content: 'Auth lesson learned', tags: '[]' });
    const results = searchObservations(db, 'Auth', 'p', 'decision');
    expect(results.every((r) => r.type === 'decision')).toBe(true);
  });

  test('deleteObservation removes record', () => {
    const obs = upsertObservation(db, { project: 'p', type: 'bug', topic_key: 'bug-1', content: 'Found a bug', tags: '[]' });
    deleteObservation(db, obs.id);
    expect(getObservationByKey(db, 'p', 'bug-1')).toBeNull();
  });

  test('getProjectContext returns all obs ordered by updated_at desc', () => {
    upsertObservation(db, { project: 'proj', type: 'pattern', topic_key: 'k1', content: 'c1', tags: '[]' });
    upsertObservation(db, { project: 'proj', type: 'lesson', topic_key: 'k2', content: 'c2', tags: '[]' });
    upsertObservation(db, { project: 'proj', type: 'convention', topic_key: 'k3', content: 'c3', tags: '[]' });
    const ctx = getProjectContext(db, 'proj');
    expect(ctx.length).toBe(3);
  });
});

// ── HTTP API ─────────────────────────────────────────────────────────────────

describe('HTTP API', () => {
  test('GET /health returns ok', async () => {
    const app = createApp(db);
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string };
    expect(body.status).toBe('ok');
  });

  test('GET /health/db returns observation count', async () => {
    const app = createApp(db);
    const res = await app.request('/health/db');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { observations: number };
    expect(typeof body.observations).toBe('number');
  });

  test('POST /sessions creates session', async () => {
    const app = createApp(db);
    const res = await app.request('/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project: 'test', agent: 'claude-code' }),
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as { id: string; project: string };
    expect(body.id).toBeTruthy();
    expect(body.project).toBe('test');
  });

  test('POST /observations creates observation', async () => {
    const app = createApp(db);
    const res = await app.request('/observations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project: 'test',
        type: 'decision',
        topic_key: 'arch',
        content: 'Use microservices',
        tags: ['arch'],
      }),
    });
    expect(res.status).toBe(201);
  });

  test('GET /observations/search requires q param', async () => {
    const app = createApp(db);
    const res = await app.request('/observations/search');
    expect(res.status).toBe(400);
  });

  test('GET /observations/context returns project observations', async () => {
    upsertObservation(db, { project: 'myproj', type: 'pattern', topic_key: 'p1', content: 'test pattern', tags: '[]' });
    const app = createApp(db);
    const res = await app.request('/observations/context?project=myproj');
    expect(res.status).toBe(200);
    const body = (await res.json()) as unknown[];
    expect(body.length).toBe(1);
  });
});

describe('MCP', () => {
  test('initialize handshake returns capabilities and server info', () => {
    const response = handleMcpRequest(db, {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
    });
    expect(response.result).toBeTruthy();
    expect((response.result as { serverInfo: { name: string } }).serverInfo.name).toBe('engram');
  });

  test('tools/list returns the 4 MCP tools', () => {
    const response = handleMcpRequest(db, {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
    });
    expect(((response.result as { tools: unknown[] }).tools)).toHaveLength(4);
  });

  test('tools/call save, search, context and delete work end-to-end', () => {
    const saveResponse = handleMcpRequest(db, {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'save_observation',
        arguments: {
          project: 'mcp-proj',
          type: 'decision',
          topic_key: 'cache-strategy',
          content: 'Use a write-through cache.',
          tags: ['cache'],
        },
      },
    });

    const savedText = ((saveResponse.result as { content: Array<{ text: string }> }).content[0]?.text) ?? '{}';
    const saved = JSON.parse(savedText) as { id: string };

    const searchResponse = handleMcpRequest(db, {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'search_memory',
        arguments: { q: 'write', project: 'mcp-proj' },
      },
    });
    expect(searchResponse.error).toBeUndefined();
    expect(((searchResponse.result as { content: Array<{ text: string }> }).content[0]?.text ?? '')).toContain('cache-strategy');

    const contextResponse = handleMcpRequest(db, {
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: {
        name: 'get_context',
        arguments: { project: 'mcp-proj' },
      },
    });
    expect(((contextResponse.result as { content: Array<{ text: string }> }).content[0]?.text ?? '')).toContain('write-through');

    const deleteResponse = handleMcpRequest(db, {
      jsonrpc: '2.0',
      id: 6,
      method: 'tools/call',
      params: {
        name: 'delete_observation',
        arguments: { id: saved.id },
      },
    });
    expect(((deleteResponse.result as { content: Array<{ text: string }> }).content[0]?.text ?? '')).toContain('"ok": true');
  });

  test('session store creates sessions and prunes stale ones', () => {
    const store = new SessionStore();
    const session = store.createSession();
    expect(store.get(session.id)).toBeTruthy();
    session.lastSeenAt = Date.now() - 10_000;
    expect(store.prune(1_000)).toBe(1);
    expect(store.get(session.id)).toBeUndefined();
  });
});
