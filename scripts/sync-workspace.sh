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

echo "📦 Refreshing mandatory V3 runtime skills..."
copy_skill "architect-orchestrator-v3"
copy_skill "engram-manager"
copy_skill "sdd-manager"
copy_skill "skill-governor"
copy_skill "security-reviewer"
copy_skill "test-verifier"
copy_skill "deploy-orchestrator"
copy_skill "context-keeper"
copy_skill "context-optimization"
copy_skill "humanized-communication"
copy_skill "verification-before-completion"

echo "⚙️ Regenerating runtime state and registry..."
bash "${KIT_ROOT}/scripts/generate-registry.sh" > /dev/null

if [ -f "${KIT_ROOT}/AGENTS.md" ]; then
    cp "${KIT_ROOT}/AGENTS.md" "AGENTS.md"
fi

echo "✅ Synchronization complete."
echo "   Updated: .agent/core/*"
echo "   Updated: .agent/registry/*"
echo "   Updated: .agent/workflows/*"
echo "   Refreshed: mandatory runtime skills"
