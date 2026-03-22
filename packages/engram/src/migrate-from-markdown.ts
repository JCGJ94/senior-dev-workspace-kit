import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Database } from 'bun:sqlite';
import { upsertObservation } from './db/queries.js';
import type { ObservationType } from './db/queries.js';

const DIR_TO_TYPE: Record<string, ObservationType> = {
  decisions: 'decision',
  patterns: 'pattern',
  lessons: 'lesson',
  incidents: 'bug',
  domains: 'convention',
};

export async function migrateFromMarkdown(
  db: Database,
  kitPath: string,
): Promise<void> {
  const engramPath = join(kitPath, 'docs', 'engram');
  if (!existsSync(engramPath)) {
    console.log(`No engram directory found at ${engramPath}`);
    return;
  }

  let imported = 0;
  for (const [dir, type] of Object.entries(DIR_TO_TYPE)) {
    const dirPath = join(engramPath, dir);
    if (!existsSync(dirPath)) continue;

    const files = readdirSync(dirPath).filter(
      (f) => f.endsWith('.md') && f !== 'README.md',
    );

    for (const file of files) {
      const raw = readFileSync(join(dirPath, file), 'utf-8');
      const { title, tags, content } = parseFrontmatter(raw);
      const topic_key = `${dir}/${file.replace('.md', '')}`;

      upsertObservation(db, {
        project: 'pedrito-kit',
        type,
        topic_key,
        content: `# ${title}\n\n${content}`,
        tags: JSON.stringify(tags),
      });

      imported++;
      console.log(`  ✓ [${type}] ${title}`);
    }
  }

  console.log(`\nMigration complete: ${imported} observations imported.`);
}

interface ParsedFrontmatter {
  title: string;
  tags: string[];
  content: string;
}

function parseFrontmatter(raw: string): ParsedFrontmatter {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    const h1 = raw.match(/^#\s+(.+)/m);
    return { title: h1?.[1] ?? 'Untitled', tags: [], content: raw.trim() };
  }

  const fm = fmMatch[1] ?? '';
  const body = (fmMatch[2] ?? '').trim();

  const titleMatch = fm.match(/^title:\s*(.+)$/m);
  const tagsMatch = fm.match(/^tags:\s*\[(.+)\]$/m);

  const tags = tagsMatch?.[1]
    ? tagsMatch[1]
        .split(',')
        .map((t) => t.trim().replace(/['"]/g, ''))
        .filter(Boolean)
    : [];

  return {
    title: (titleMatch?.[1] ?? '').trim() || 'Untitled',
    tags,
    content: body,
  };
}
