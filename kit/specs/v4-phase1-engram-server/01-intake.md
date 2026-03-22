# Phase 1 Intake — Engram Real (Memory Server)

## Objective
Replace the Markdown-based Engram memory system (`kit/docs/engram/`) with a real SQLite-backed REST server running on `localhost:7437`, providing persistent cross-session, cross-agent memory with FTS5 full-text search.

## Motivation
The markdown-based Engram is manual, brittle, and not queryable. Two agents cannot share memory, search is impossible without reading all files, and there is no automatic session lifecycle tracking.

## Scope
- SQLite database with FTS5 (sessions + observations tables)
- REST API via Hono: 8 endpoints (sessions CRUD + observations CRUD + health)
- CLI binary: `engram serve|search|migrate|status`
- Migration tool: import existing `kit/docs/engram/` markdown files
- Claude Code plugin: session-start/end hooks
- MCP server: JSON-RPC endpoint at `/mcp` for Cursor, Gemini CLI, etc.

## Out of Scope (future phases)
- Vector/semantic embeddings (Phase 1 uses FTS5 text search only)
- Auto-launch as launchd/systemd service
- OpenCode TypeScript plugin

## Status
In Progress — started 2026-03-21
