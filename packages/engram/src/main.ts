import { join } from 'path';
import { homedir } from 'os';
import { mkdirSync } from 'fs';
import { openDb } from './db/migrations.js';
import { createApp } from './api/routes.js';
import { mcpRoutes } from './mcp/server.js';
import { searchObservations } from './db/queries.js';
import { migrateFromMarkdown } from './migrate-from-markdown.js';

declare const PEDRITO_VERSION: string;
const VERSION = typeof PEDRITO_VERSION !== 'undefined' ? PEDRITO_VERSION : '5.0.0-dev';

const DB_DIR = join(homedir(), '.pedrito', 'engram');
const DB_PATH = join(DB_DIR, 'engram.db');
const PORT = 7437;
const HOST = '127.0.0.1';

const [, , cmd, ...args] = process.argv;

switch (cmd) {
  case 'version':
    console.log(VERSION);
    process.exit(0);
    break;
  case 'serve':
    await cmdServe();
    break;
  case 'search':
    await cmdSearch(args);
    break;
  case 'migrate':
    await cmdMigrate(args);
    break;
  case 'status':
    await cmdStatus();
    break;
  default:
    console.log(`engram v${VERSION}

Usage: engram <command>

Commands:
  serve              Start the Engram memory server on port ${PORT}
  search <query>     Search memory observations
                     Options: --project <name>, --type <type>
  migrate [kit-path] Import kit/docs/engram/ markdown files into the DB
  status             Check if the server is running
  version            Show version`);
    process.exit(0);
}

async function cmdServe(): Promise<void> {
  mkdirSync(DB_DIR, { recursive: true });
  const db = openDb(DB_PATH);
  const app = createApp(db);
  app.route('/', mcpRoutes(db));

  const server = Bun.serve({
    fetch: app.fetch,
    port: PORT,
    hostname: HOST,
  });

  console.log(`Engram running on http://${HOST}:${PORT}`);
  console.log(`DB: ${DB_PATH}`);

  process.on('SIGINT', () => {
    server.stop();
    db.close();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    server.stop();
    db.close();
    process.exit(0);
  });
}

async function cmdSearch(argv: string[]): Promise<void> {
  const [q, ...rest] = argv;
  if (!q) {
    console.error('Usage: engram search <query> [--project <name>] [--type <type>]');
    process.exit(1);
  }

  const projectIdx = rest.indexOf('--project');
  const typeIdx = rest.indexOf('--type');
  const project = projectIdx >= 0 ? rest[projectIdx + 1] : undefined;
  const type = typeIdx >= 0 ? rest[typeIdx + 1] : undefined;

  mkdirSync(DB_DIR, { recursive: true });
  const db = openDb(DB_PATH);
  const results = searchObservations(db, q, project, type);
  db.close();

  if (!results.length) {
    console.log('No results found.');
    return;
  }

  console.log(JSON.stringify(results, null, 2));
}

async function cmdMigrate(argv: string[]): Promise<void> {
  const kitPath = argv[0] ?? join(process.cwd(), 'kit');
  mkdirSync(DB_DIR, { recursive: true });
  const db = openDb(DB_PATH);
  await migrateFromMarkdown(db, kitPath);
  db.close();
}

async function cmdStatus(): Promise<void> {
  try {
    const res = await fetch(`http://${HOST}:${PORT}/health`, { signal: AbortSignal.timeout(2000) });
    const data = (await res.json()) as { status: string };
    if (data.status === 'ok') {
      const dbRes = await fetch(`http://${HOST}:${PORT}/health/db`);
      const dbData = (await dbRes.json()) as { observations: number };
      console.log(`Engram: ✓ running on port ${PORT} (${dbData.observations} observations)`);
    } else {
      console.log(`Engram: ✗ unhealthy`);
    }
  } catch {
    console.log(`Engram: ✗ not running (port ${PORT})`);
  }
}
