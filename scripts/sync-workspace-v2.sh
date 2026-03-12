#!/bin/bash

# ==============================================================================
# AI Engineering Workspace Kit - Safe Sync/Update
# Purpose: Synchronize the local .agent directory with the kit source while 
#          protecting user customizations.
# ==============================================================================

set -e

AGENT_DIR=".agent"
KIT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🔄 Synchronizing AI Workspace (Safe Mode)..."

# 1. Check if .agent exists
if [ ! -d "$AGENT_DIR" ]; then
    echo "❌ .agent/ directory not found. Run provision.sh first."
    exit 1
fi

# 2. Update Core Protocol (OVERWRITE)
echo "🛡️ Updating core protocols..."
cp "${KIT_ROOT}/core/00_environment_rules.md" "${AGENT_DIR}/core/"
cp "${KIT_ROOT}/core/01_core_rules.md" "${AGENT_DIR}/core/"
# Add other core rules if needed

# 3. Update Workflows (OVERWRITE)
echo "🏗️ Updating workflows..."
cp -r "${KIT_ROOT}/workflows/"* "${AGENT_DIR}/workflows/"

# 4. Update Registry (OVERWRITE)
echo "📋 Updating registry..."
cp -r "${KIT_ROOT}/registry/"* "${AGENT_DIR}/registry/"

# 5. Generate Registry (RECONSTRUCT)
bash "${KIT_ROOT}/scripts/generate-registry.sh"

# 6. Summary of preserved áreas
echo "✅ Synchronization complete."
echo "------------------------------------------------"
echo "🛡️ Preserved: .agent/config/local_overrides.json"
echo "🛡️ Preserved: .agent/custom/"
echo "🚀 Updated: .agent/core/*"
echo "🚀 Updated: .agent/workflows/*"
echo "🚀 Updated: .agent/registry/*"
echo "------------------------------------------------"
