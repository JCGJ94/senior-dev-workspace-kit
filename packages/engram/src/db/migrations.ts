import { Database } from 'bun:sqlite';

// Schema embedded as string so it works in compiled binaries (bun --compile)
const SCHEMA = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  project    TEXT NOT NULL,
  agent      TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  ended_at   INTEGER,
  goal       TEXT,
  summary    TEXT
);

CREATE TABLE IF NOT EXISTS observations (
  id         TEXT PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL,
  project    TEXT NOT NULL,
  type       TEXT NOT NULL CHECK(type IN ('decision','bug','pattern','convention','lesson')),
  topic_key  TEXT NOT NULL,
  content    TEXT NOT NULL,
  tags       TEXT DEFAULT '[]',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(project, topic_key)
);

CREATE INDEX IF NOT EXISTS idx_obs_project ON observations(project);
CREATE INDEX IF NOT EXISTS idx_obs_type    ON observations(type);

CREATE VIRTUAL TABLE IF NOT EXISTS observations_fts USING fts5(
  content,
  tags,
  content=observations,
  content_rowid=rowid,
  tokenize='porter unicode61'
);

CREATE TRIGGER IF NOT EXISTS obs_ai AFTER INSERT ON observations BEGIN
  INSERT INTO observations_fts(rowid, content, tags) VALUES (new.rowid, new.content, new.tags);
END;

CREATE TRIGGER IF NOT EXISTS obs_au AFTER UPDATE ON observations BEGIN
  INSERT INTO observations_fts(observations_fts, rowid, content, tags) VALUES ('delete', old.rowid, old.content, old.tags);
  INSERT INTO observations_fts(rowid, content, tags) VALUES (new.rowid, new.content, new.tags);
END;

CREATE TRIGGER IF NOT EXISTS obs_ad AFTER DELETE ON observations BEGIN
  INSERT INTO observations_fts(observations_fts, rowid, content, tags) VALUES ('delete', old.rowid, old.content, old.tags);
END;
`;

export function runMigrations(db: Database): void {
  db.exec(SCHEMA);
}

export function openDb(dbPath: string): Database {
  const db = new Database(dbPath, { create: true });
  runMigrations(db);
  return db;
}
