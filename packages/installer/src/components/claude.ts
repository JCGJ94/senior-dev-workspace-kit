import { copyFileSync, cpSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export function configureClaudeCode(options: {
  homeDir: string;
  kitPath: string;
  repoRoot: string;
  includePersona: boolean;
  personaName: string;
  includeEngram: boolean;
  includeGGA: boolean;
  includeMCP: boolean;
}): string[] {
  const claudeRoot = join(options.homeDir, '.claude');
  mkdirSync(claudeRoot, { recursive: true });

  const changes: string[] = [];
  cpSync(join(options.kitPath, 'skills'), join(claudeRoot, 'skills'), { recursive: true });
  changes.push(join(claudeRoot, 'skills'));

  if (options.includePersona) {
    const personaFile = join(options.kitPath, 'config', 'personas', `${options.personaName}.md`);
    const targetPersona = join(claudeRoot, 'pedrito-persona.md');
    copyFileSync(personaFile, targetPersona);
    const personaContent = readFileSync(targetPersona, 'utf8');
    writeFileSync(
      join(claudeRoot, 'CLAUDE.md'),
      `# Pedrito Claude Code Setup\n\n${personaContent}`,
      'utf8',
    );
    changes.push(join(claudeRoot, 'CLAUDE.md'));
  }

  if (options.includeEngram) {
    const engramSource = join(
      options.repoRoot,
      'packages',
      'engram',
      'src',
      'plugins',
      'claude-code',
      'CLAUDE_ENGRAM.md',
    );
    copyFileSync(engramSource, join(claudeRoot, 'CLAUDE_ENGRAM.md'));
    changes.push(join(claudeRoot, 'CLAUDE_ENGRAM.md'));
  }

  if (options.includeMCP) {
    writeFileSync(
      join(claudeRoot, 'mcp-servers.json'),
      JSON.stringify(
        {
          engram: { transport: 'sse', url: 'http://127.0.0.1:7437/mcp/sse' },
          context7: { transport: 'stdio', command: 'npx', args: ['@upstash/context7-mcp@latest'] },
        },
        null,
        2,
      ),
      'utf8',
    );
    changes.push(join(claudeRoot, 'mcp-servers.json'));
  }

  if (options.includeGGA) {
    writeFileSync(join(process.cwd(), '.gga'), 'provider = "claude"\nfail_open = false\n', 'utf8');
    changes.push(join(process.cwd(), '.gga'));
  }

  return changes;
}
