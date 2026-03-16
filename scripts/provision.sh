#!/bin/bash

# ==============================================================================
# AI Engineering Workspace Kit - Project Provisioner v3.0 (Complete)
# ==============================================================================

set -euo pipefail

VERSION="3.0.0"
AGENT_DIR=".agent"
KIT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "       ___  ____   _  ____"
echo "      / _ \/  _/  | |/_/ /"
echo "     / __ _/ /   _>  < / / "
echo "    /_/ |_/___/ /_/|_/_/  "
echo "                          "
echo "   A G E N T   K I T   V 3"
echo -e "${NC}"

echo -e "${BLUE}🚀 Initializing AI Engineering Runtime v${VERSION}...${NC}"
echo -e "${BLUE}--------------------------------------------------${NC}"

# Initialize parts
STACKS=()
INTERACTIVE=true

# Parse flags
for arg in "$@"; do
    if [ "$arg" == "--non-interactive" ]; then
        INTERACTIVE=false
    fi
done

# 1. Detect Environment and Build Command Map
detect_and_map() {
    echo -e "${BLUE}🔍 Detecting stack...${NC}"
    # Node detection
    if [ -f "package.json" ]; then
        STACKS+=("node")
        NODE_INSTALL="npm install"; [[ -f "bun.lockb" ]] && NODE_INSTALL="bun install"
        NODE_TEST="npm test"; [[ -f "bun.lockb" ]] && NODE_TEST="bun test"
        NODE_LINT="npm run lint"; [[ -f "package.json" ]] && grep -q '"lint"' package.json || NODE_LINT="eslint ."
        NODE_TYPECHECK="npm run typecheck"; [[ -f "package.json" ]] && grep -q '"typecheck"' package.json || NODE_TYPECHECK="tsc --noEmit"
    fi

    # Python detection
    if [ -f "pyproject.toml" ] || [ -f "requirements.txt" ]; then
        STACKS+=("python")
        PY_INSTALL="pip install -r requirements.txt"; [[ -f "poetry.lock" ]] && PY_INSTALL="poetry install"
        PY_TEST="pytest"; [[ -f "poetry.lock" ]] && PY_TEST="poetry run pytest"
        PY_LINT="ruff check ."; [[ -f "poetry.lock" ]] && PY_LINT="poetry run ruff check ."
        PY_TYPECHECK="mypy ."; [[ -f "poetry.lock" ]] && PY_TYPECHECK="poetry run mypy ."
    fi

    # Resolution Logic
    if [[ " ${STACKS[*]} " =~ " node " && " ${STACKS[*]} " =~ " python " ]]; then
        PROJECT_TYPE="hybrid"
        OP_INSTALL="$NODE_INSTALL && $PY_INSTALL"
        OP_TEST="echo 'Hybrid: Use specific test commands'"
        OP_TYPECHECK="$NODE_TYPECHECK && $PY_TYPECHECK"
        OP_LINT="$NODE_LINT && $PY_LINT"
    elif [[ " ${STACKS[*]} " =~ " node " ]]; then
        PROJECT_TYPE="node"
        OP_INSTALL="$NODE_INSTALL"
        OP_TEST="$NODE_TEST"
        OP_TYPECHECK="$NODE_TYPECHECK"
        OP_LINT="$NODE_LINT"
    elif [[ " ${STACKS[*]} " =~ " python " ]]; then
        PROJECT_TYPE="python"
        OP_INSTALL="$PY_INSTALL"
        OP_TEST="$PY_TEST"
        OP_TYPECHECK="$PY_TYPECHECK"
        OP_LINT="$PY_LINT"
    else
        PROJECT_TYPE="generic"
        OP_INSTALL="echo 'No install'"
        OP_TEST="echo 'No test'"
        OP_TYPECHECK="echo 'No typecheck'"
        OP_LINT="echo 'No lint'"
    fi
}

# 2. Build Directory Structure
build_structure() {
    echo -e "${BLUE}📁 Building structure...${NC}"
    mkdir -p "${AGENT_DIR}"/{core,registry,skills,workflows,state}
    mkdir -p docs/engram/{decisions,patterns,incidents,lessons,domains}
    mkdir -p specs/_template
}

# 3. Provision Core and Registry
provision_base() {
    echo -e "${BLUE}🧠 Injecting V3 Core and Registry...${NC}"
    cp -r "${KIT_ROOT}/core/"* "${AGENT_DIR}/core/"
    cp -r "${KIT_ROOT}/registry/"* "${AGENT_DIR}/registry/"
    cp -r "${KIT_ROOT}/workflows/"* "${AGENT_DIR}/workflows/"
    
    # Provision Engram and Spec Templates to the project if they don't exist
    if [ ! -f "docs/engram/index.md" ]; then
        cp -r "${KIT_ROOT}/docs/engram/"* "docs/engram/"
    fi
    if [ ! -f "specs/README.md" ]; then
        mkdir -p specs
        cp -r "${KIT_ROOT}/specs/"* "specs/"
    fi
}

# 4. Provision Skills
provision_skills() {
    echo -e "${BLUE}📦 Provisioning V3 Orchestration Skills...${NC}"
    
    provision_skill() {
        local skill_name="$1"
        if [ -d "${KIT_ROOT}/skills/${skill_name}" ]; then
            mkdir -p "${AGENT_DIR}/skills/${skill_name}"
            cp "${KIT_ROOT}/skills/${skill_name}/SKILL.md" "${AGENT_DIR}/skills/${skill_name}/"
            echo -e "   ✅ Loaded: ${skill_name}"
        fi
    }

    # Mandatory V3 Skills
    provision_skill "architect-orchestrator-v3"
    provision_skill "engram-manager"
    provision_skill "sdd-manager"
    provision_skill "skill-governor"
    provision_skill "security-reviewer"
    provision_skill "test-verifier"
    provision_skill "deploy-orchestrator"
    provision_skill "context-keeper"
    provision_skill "context-optimization"
    provision_skill "humanized-communication"
    provision_skill "verification-before-completion"

    if [ "$INTERACTIVE" = "true" ]; then
        echo -e "\n${BLUE}🦸 Choose additional skills? (y/n, default n): ${NC}"
        read -r ADD_SKILLS
        if [[ "$ADD_SKILLS" =~ ^[Yy]$ ]]; then
            echo -e "Available skills: $(ls "${KIT_ROOT}/skills" | xargs)"
            echo -e "Enter skill names separated by space: "
            read -r SKILLS_TO_LOAD
            for s in ${SKILLS_TO_LOAD}; do
                provision_skill "$s"
            done
        fi
    fi
}

# 5. Generate V3 State Files
generate_v3_state() {
    echo -e "${BLUE}⚙️ Generating V3 state files...${NC}"
    
    # env_state.json
    cat <<EOF > "${AGENT_DIR}/state/env_state.json"
{
  "version": "$VERSION",
  "project_type": "$PROJECT_TYPE",
  "detected_stacks": [$(printf '"%s",' "${STACKS[@]}" | sed 's/,$//')],
  "last_provision": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

    # allowed_ops.json (Replacing commands.json)
    cat <<EOF > "${AGENT_DIR}/state/allowed_ops.json"
{
  "OP_INSTALL": "${OP_INSTALL//\"/\\\"}",
  "OP_TEST": "${OP_TEST//\"/\\\"}",
  "OP_TYPECHECK": "${OP_TYPECHECK//\"/\\\"}",
  "OP_LINT": "${OP_LINT//\"/\\\"}",
  "OP_BUILD": "echo 'Define [OP_BUILD] in project config'",
  "OP_DEPLOY": "echo 'Define [OP_DEPLOY] in project config'"
}
EOF

    # Remove legacy commands.json if exists
    rm -f "${AGENT_DIR}/state/commands.json"
}

# 6. Finalize Registry
finalize_registry() {
    if [ -f "scripts/generate-registry.sh" ]; then
        bash "scripts/generate-registry.sh"
    fi
}

# 7. Generate Gateway (AGENTS.md)
generate_gateway() {
    # We use the template we just wrote or the one in KIT_ROOT
    if [ -f "${KIT_ROOT}/AGENTS.md" ]; then
        cp "${KIT_ROOT}/AGENTS.md" "AGENTS.md"
    fi
}

# Execution
detect_and_map
build_structure
provision_base
provision_skills
generate_v3_state
finalize_registry
generate_gateway

echo -e "\n${GREEN}✨ V3 Runtime Provisioned Successfully!${NC}"
echo -e "${BLUE}Next: The agent should read AGENTS.md to begin the V3 workflow.${NC}"
