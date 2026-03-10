#!/usr/bin/env bash
set -e

# Setup directories
WORKSPACE_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
DEVKIT_DIR="$WORKSPACE_ROOT/.devkit"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
MANIFEST_FILE="$SCRIPT_DIR/../skills_registry/profiles/profiles_manifest.json"
ACTIVE_CONTEXT_FILE="$DEVKIT_DIR/active_workspace_capabilities.md"

mkdir -p "$DEVKIT_DIR"

# Validate manifest exists
if [ ! -f "$MANIFEST_FILE" ]; then
    echo "❌ Error: profiles_manifest.json not found at $MANIFEST_FILE"
    exit 1
fi

# Input processing
INPUT_ARG="${1:-default}"
INPUT_ARG=$(echo "$INPUT_ARG" | tr '[:upper:]' '[:lower:]')

# Use Node.js to safely parse JSON and resolve tiers
PARSED_DATA=$(node -e "
  try {
    const fs = require('fs');
    const input = process.argv[1];
    const manifestPath = process.argv[2];
    const rawData = fs.readFileSync(manifestPath, 'utf8');
    const data = JSON.parse(rawData);
    
    // Cleanup any lingering carriage returns in values (since it's windows)
    const cleanStr = str => typeof str === 'string' ? str.replace(/\r/g, '') : str;

    
    const resolvedProfile = data.aliases[input] || input;
    
    if (!data.profiles[resolvedProfile]) {
      console.error('ERROR_NOT_FOUND');
      process.exit(1);
    }
    
    const tiers = data.profiles[resolvedProfile];
    console.log(cleanStr(resolvedProfile) + '|' + tiers.map(cleanStr).join(', '));
  } catch (err) {
    console.error('ERROR_PARSING', err.message);
    process.exit(2);
  }
" "$INPUT_ARG" "$MANIFEST_FILE" || true)

if [ "$PARSED_DATA" == "ERROR_NOT_FOUND" ]; then
    echo "❌ Error: Unknown profile or tier '$INPUT_ARG'."
    echo "Valid profiles: default, quality, multi-agent, release."
    echo "Valid aliases: tier1, tier2, tier3, tier4."
    exit 1
fi

if [[ "$PARSED_DATA" == ERROR_PARSING* ]]; then
    echo "❌ System Error: failed to parse profiles_manifest.json: $PARSED_DATA"
    exit 1
fi

PARSED_DATA="${PARSED_DATA//$'\r'/}"

RESOLVED_PROFILE="${PARSED_DATA%%|*}"
TIERS_FORMATTED="${PARSED_DATA##*|}"

if [ "$INPUT_ARG" != "$RESOLVED_PROFILE" ]; then
    echo "🔄 Resolved alias '$INPUT_ARG' to profile '$RESOLVED_PROFILE'"
fi

echo "✅ [SYSTEM] Profile '$RESOLVED_PROFILE' activated. Loaded settings: $TIERS_FORMATTED."

cat > "$ACTIVE_CONTEXT_FILE" <<EOF
# Active Context: $RESOLVED_PROFILE

This file dictates the active skills and parameters for the current AI engineering session.
This context ensures token-efficient execution by only loading what is necessary.

## Active Capability Tiers
- $TIERS_FORMATTED

> **Note to AI Agent**: You are operating under the '$RESOLVED_PROFILE' profile. 
> Only use capabilities and workflows from the tiers explicitly listed above.
> The Tier 1 Baseline is always active.
EOF

echo "📁 Context exported to: $ACTIVE_CONTEXT_FILE (AI Agents should read this file)"
