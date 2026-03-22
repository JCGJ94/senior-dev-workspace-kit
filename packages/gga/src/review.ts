import type { StagedFile } from './staged.js';

export interface ReviewIssue {
  file: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export interface ReviewResult {
  verdict: 'PASSED' | 'FAILED';
  issues: ReviewIssue[];
  raw: string;
}

export function buildPrompt(files: StagedFile[], rules: string): string {
  const fileBlocks = files
    .map(
      (file) =>
        `FILE: ${file.path}\nSTATUS: ${file.status}\nSHA256: ${file.sha256}\nCONTENT:\n${file.content}`,
    )
    .join('\n\n---\n\n');

  return `You are Guardian Angel, a pre-commit reviewer.

Review the staged changes using the project rules below.
Return exactly this format:
VERDICT: PASSED|FAILED
ISSUE: <file> | <severity> | <message>

Only return ISSUE lines when there is a concrete problem worth surfacing.
Rules:
${rules}

Staged files:
${fileBlocks}`;
}

export function parseResponse(raw: string): ReviewResult {
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const verdictLine = lines.find((line) => line.startsWith('VERDICT:'));
  const verdict = verdictLine?.split(':')[1]?.trim();

  if (verdict !== 'PASSED' && verdict !== 'FAILED') {
    return {
      verdict: 'FAILED',
      issues: [
        {
          file: 'unknown',
          severity: 'error',
          message: 'Provider response was malformed and could not be parsed.',
        },
      ],
      raw,
    };
  }

  const issues: ReviewIssue[] = lines
    .filter((line) => line.startsWith('ISSUE:'))
    .map((line) => parseIssue(line))
    .filter((issue): issue is ReviewIssue => issue !== null);

  return { verdict, issues, raw };
}

function parseIssue(line: string): ReviewIssue | null {
  const body = line.replace(/^ISSUE:\s*/, '');
  const [file, severity, ...messageParts] = body.split('|').map((part) => part.trim());
  const message = messageParts.join(' | ').trim();

  if (!file || !severity || !message) {
    return null;
  }

  const normalizedSeverity =
    severity === 'error' || severity === 'warning' || severity === 'info' ? severity : 'warning';

  return {
    file,
    severity: normalizedSeverity,
    message,
  };
}
