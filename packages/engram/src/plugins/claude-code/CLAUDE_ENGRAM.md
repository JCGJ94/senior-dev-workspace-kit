# Engram Memory Protocol

Engram is a persistent memory server running on `http://127.0.0.1:7437`.
Use it to store and retrieve cross-session knowledge.

## When to Read Memory

At the start of any work session, load project context:

```
GET http://127.0.0.1:7437/observations/context?project=<project-name>
GET http://127.0.0.1:7437/observations/search?q=<topic>&project=<project-name>
```

## When to Save Memory

Save observations for anything worth remembering across sessions:

```
POST http://127.0.0.1:7437/observations
{
  "project": "<project-name>",
  "type": "decision" | "pattern" | "bug" | "convention" | "lesson",
  "topic_key": "<unique-slug>",
  "content": "<full description>",
  "tags": ["tag1", "tag2"]
}
```

**Types:**
- `decision` — Architecture choices and their rationale
- `pattern` — Reusable code or design patterns discovered
- `bug` — Bugs found and how they were fixed
- `convention` — Project-specific conventions to follow
- `lesson` — Lessons learned from incidents or mistakes

**topic_key** is the deduplication key. Same project + topic_key = upsert, not duplicate.

## When to Close a Session

At the end of work, summarize what was done:

```
PATCH http://127.0.0.1:7437/sessions/<session-id>
{
  "ended_at": <timestamp-ms>,
  "summary": "What was accomplished in this session"
}
```

## Health Check

```
GET http://127.0.0.1:7437/health
GET http://127.0.0.1:7437/health/db
```

## Starting the Server

```bash
engram serve
# or
bun run packages/engram/src/main.ts serve
```
