#!/usr/bin/env bash
# Engram session-start hook for Claude Code
# Configure in ~/.claude/settings.json as a PostToolUse or UserPromptSubmit hook

set -euo pipefail

PROJECT=$(basename "$PWD")
BASE="http://127.0.0.1:7437"

# Check if Engram is running — skip silently if not
if ! curl -sf --max-time 1 "$BASE/health" > /dev/null 2>&1; then
  exit 0
fi

# Start a new session
SESSION_JSON=$(curl -sf -X POST "$BASE/sessions" \
  -H "Content-Type: application/json" \
  -d "{\"project\": \"$PROJECT\", \"agent\": \"claude-code\"}" 2>/dev/null || echo '{}')

SESSION_ID=$(echo "$SESSION_JSON" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -n "$SESSION_ID" ]; then
  echo "$SESSION_ID" > "/tmp/.engram-session-${$}"
fi

# Load and display project context
CONTEXT=$(curl -sf --max-time 2 "$BASE/observations/context?project=$PROJECT" 2>/dev/null || echo '[]')
if [ "$CONTEXT" != "[]" ] && [ -n "$CONTEXT" ]; then
  echo "=== Engram Memory: $PROJECT ==="
  echo "$CONTEXT" | python3 -c "
import json, sys
try:
    obs = json.load(sys.stdin)
    for o in obs[:10]:
        content_preview = o['content'][:100].replace('\n', ' ')
        print(f\"  [{o['type']}] {o['topic_key']}: {content_preview}...\")
except Exception:
    pass
" 2>/dev/null || true
  echo "==========================="
fi
