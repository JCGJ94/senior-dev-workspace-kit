import type { Database } from 'bun:sqlite';
import { z } from 'zod';
import { randomUUID } from 'crypto';

// ── Zod Schemas ──────────────────────────────────────────────────────────────

export const ObservationTypeSchema = z.enum([
  'decision',
  'bug',
  'pattern',
  'convention',
  'lesson',
]);
export type ObservationType = z.infer<typeof ObservationTypeSchema>;

export const SessionSchema = z.object({
  id: z.string(),
  project: z.string(),
  agent: z.string(),
  started_at: z.number(),
  ended_at: z.number().nullable().optional(),
  goal: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
});
export type Session = z.infer<typeof SessionSchema>;

export const ObservationSchema = z.object({
  id: z.string(),
  session_id: z.string().nullable().optional(),
  project: z.string(),
  type: ObservationTypeSchema,
  topic_key: z.string(),
  content: z.string(),
  tags: z.string().default('[]'),
  created_at: z.number(),
  updated_at: z.number(),
});
export type Observation = z.infer<typeof ObservationSchema>;

// ── Sessions ─────────────────────────────────────────────────────────────────

export function createSession(
  db: Database,
  data: { project: string; agent: string; goal?: string | null },
): Session {
  const id = randomUUID();
  const now = Date.now();
  db.run(
    `INSERT INTO sessions (id, project, agent, started_at, goal) VALUES (?, ?, ?, ?, ?)`,
    [id, data.project, data.agent, now, data.goal ?? null],
  );
  return { id, project: data.project, agent: data.agent, started_at: now, goal: data.goal };
}

export function updateSession(
  db: Database,
  id: string,
  data: { ended_at?: number; goal?: string; summary?: string },
): void {
  const fields = Object.entries(data).filter(([, v]) => v !== undefined);
  if (!fields.length) return;
  const set = fields.map(([k]) => `${k} = ?`).join(', ');
  db.run(`UPDATE sessions SET ${set} WHERE id = ?`, [
    ...fields.map(([, v]) => v),
    id,
  ]);
}

export function listSessions(db: Database, project: string, limit = 5): Session[] {
  return db
    .query(`SELECT * FROM sessions WHERE project = ? ORDER BY started_at DESC LIMIT ?`)
    .all(project, limit) as Session[];
}

// ── Observations ─────────────────────────────────────────────────────────────

export type NewObservation = Omit<Observation, 'id' | 'created_at' | 'updated_at'>;

export function upsertObservation(db: Database, data: NewObservation): Observation {
  const now = Date.now();
  const id = randomUUID();
  db.run(
    `INSERT INTO observations (id, session_id, project, type, topic_key, content, tags, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(project, topic_key) DO UPDATE SET
       content    = excluded.content,
       tags       = excluded.tags,
       type       = excluded.type,
       updated_at = excluded.updated_at`,
    [
      id,
      data.session_id ?? null,
      data.project,
      data.type,
      data.topic_key,
      data.content,
      data.tags ?? '[]',
      now,
      now,
    ],
  );
  return getObservationByKey(db, data.project, data.topic_key)!;
}

export function getObservationByKey(
  db: Database,
  project: string,
  topic_key: string,
): Observation | null {
  return db
    .query(`SELECT * FROM observations WHERE project = ? AND topic_key = ?`)
    .get(project, topic_key) as Observation | null;
}

export function searchObservations(
  db: Database,
  q: string,
  project?: string,
  type?: string,
  limit = 20,
): Observation[] {
  // Build query dynamically based on optional filters
  if (project && type) {
    return db
      .query(
        `SELECT o.* FROM observations o JOIN observations_fts fts ON o.rowid = fts.rowid
         WHERE observations_fts MATCH ? AND o.project = ? AND o.type = ?
         ORDER BY bm25(observations_fts) LIMIT ?`,
      )
      .all(q, project, type, limit) as Observation[];
  } else if (project) {
    return db
      .query(
        `SELECT o.* FROM observations o JOIN observations_fts fts ON o.rowid = fts.rowid
         WHERE observations_fts MATCH ? AND o.project = ?
         ORDER BY bm25(observations_fts) LIMIT ?`,
      )
      .all(q, project, limit) as Observation[];
  } else if (type) {
    return db
      .query(
        `SELECT o.* FROM observations o JOIN observations_fts fts ON o.rowid = fts.rowid
         WHERE observations_fts MATCH ? AND o.type = ?
         ORDER BY bm25(observations_fts) LIMIT ?`,
      )
      .all(q, type, limit) as Observation[];
  } else {
    return db
      .query(
        `SELECT o.* FROM observations o JOIN observations_fts fts ON o.rowid = fts.rowid
         WHERE observations_fts MATCH ?
         ORDER BY bm25(observations_fts) LIMIT ?`,
      )
      .all(q, limit) as Observation[];
  }
}

export function getProjectContext(db: Database, project: string): Observation[] {
  return db
    .query(`SELECT * FROM observations WHERE project = ? ORDER BY updated_at DESC`)
    .all(project) as Observation[];
}

export function deleteObservation(db: Database, id: string): void {
  db.run(`DELETE FROM observations WHERE id = ?`, [id]);
}
