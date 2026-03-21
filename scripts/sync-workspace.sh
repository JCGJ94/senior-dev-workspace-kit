#!/usr/bin/env bash

set -euo pipefail

AGENT_DIR=".agent"
KIT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🔄 Synchronizing AI Workspace Kit V3..."

if [ ! -d "$AGENT_DIR" ]; then
    echo "❌ .agent/ directory not found. Run provision.sh first."
    exit 1
fi

mkdir -p "$AGENT_DIR"/{core,registry,skills,workflows,state}

echo "🧠 Updating core, registry, and workflows..."
cp -r "${KIT_ROOT}/core/"* "${AGENT_DIR}/core/"
cp -r "${KIT_ROOT}/registry/"* "${AGENT_DIR}/registry/"
cp -r "${KIT_ROOT}/workflows/"* "${AGENT_DIR}/workflows/"

copy_skill() {
    local skill_name="$1"
    if [ -f "${KIT_ROOT}/skills/${skill_name}/SKILL.md" ]; then
        mkdir -p "${AGENT_DIR}/skills/${skill_name}"
        cp "${KIT_ROOT}/skills/${skill_name}/SKILL.md" "${AGENT_DIR}/skills/${skill_name}/"
    fi
}

# Sync all skills currently installed in the runtime (not just the mandatory baseline).
# This preserves extra skills added via add-skill or skill-manager after initial provisioning.
echo "📦 Refreshing all installed runtime skills..."
if [ -d "${AGENT_DIR}/skills" ]; then
    for skill_dir in "${AGENT_DIR}/skills"/*/; do
        skill_name="$(basename "$skill_dir")"
        copy_skill "$skill_name"
    done
else
    echo "⚠️  No runtime skills directory found. Run 'init' first."
fi

echo "⚙️ Regenerating runtime state and registry..."
bash "${KIT_ROOT}/scripts/generate-registry.sh" > /dev/null

if [ -f "${KIT_ROOT}/AGENTS.md" ]; then
    cp "${KIT_ROOT}/AGENTS.md" "AGENTS.md"
fi

echo "✅ Synchronization complete."
echo "   Updated: .agent/core/*"
echo "   Updated: .agent/registry/*"
echo "   Updated: .agent/workflows/*"
echo "   Refreshed: all installed runtime skills"
