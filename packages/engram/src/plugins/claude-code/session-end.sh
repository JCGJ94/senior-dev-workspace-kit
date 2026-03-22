#!/usr/bin/env bash
# Engram session-end hook for Claude Code
# Configure in ~/.claude/settings.json as a Stop hook

set -euo pipefail

BASE="http://127.0.0.1:7437"
SESSION_FILE="/tmp/.engram-session-${$}"

if [ ! -f "$SESSION_FILE" ]; then
  exit 0
fi

SESSION_ID=$(cat "$SESSION_FILE")
rm -f "$SESSION_FILE"

if [ -z "$SESSION_ID" ]; then
  exit 0
fi

# Close the session with a timestamp
curl -sf -X PATCH "$BASE/sessions/$SESSION_ID" \
  -H "Content-Type: application/json" \
  -d "{\"ended_at\": $(date +%s)000, \"summary\": \"Session ended\"}" \
  > /dev/null 2>&1 || true
