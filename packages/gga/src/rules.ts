import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const SECTION_KEYWORDS = ['rules', 'standards', 'conventions', 'guidelines'];

const GENERIC_RULES = `Review staged code for correctness, regressions, security issues, missing validation, and missing tests. Prefer actionable, file-specific findings.`;

export function extractRules(rulesFile: string | undefined, cwd: string): string {
  const candidates = [
    rulesFile ? join(cwd, rulesFile) : undefined,
    join(cwd, 'AGENTS.md'),
    join(cwd, 'CLAUDE.md'),
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    if (!existsSync(candidate)) {
      continue;
    }

    const extracted = pickRelevantSections(readFileSync(candidate, 'utf8'));
    if (extracted.trim()) {
      return extracted.slice(0, 4000);
    }
  }

  return GENERIC_RULES;
}

function pickRelevantSections(content: string): string {
  const lines = content.split(/\r?\n/);
  const chunks: string[] = [];
  let current: string[] = [];
  let active = false;

  for (const line of lines) {
    if (line.startsWith('#')) {
      if (active && current.length > 0) {
        chunks.push(current.join('\n').trim());
      }
      current = [line];
      active = SECTION_KEYWORDS.some((keyword) => line.toLowerCase().includes(keyword));
      continue;
    }

    if (active) {
      current.push(line);
    }
  }

  if (active && current.length > 0) {
    chunks.push(current.join('\n').trim());
  }

  if (chunks.length === 0) {
    return content.slice(0, 4000);
  }

  return chunks.join('\n\n');
}
