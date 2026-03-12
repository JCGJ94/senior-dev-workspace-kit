#!/bin/bash

# ==============================================================================
# AI Engineering Workspace Kit - Project Provisioner v2.1 (Hardened)
# ==============================================================================

set -e

VERSION="2.1.0"
AGENT_DIR=".agent"
KIT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
echo "       ___  ____"
echo "      / _ \/  _/"
echo "     / __ _/ /  "
echo "    /_/ |_/___/ "
echo "                "
echo "   A G E N T   K I T"
echo -e "${NC}"

echo -e "${BLUE}🚀 Initializing AI Engineering Runtime v${VERSION}...${NC}"
echo -e "${BLUE}--------------------------------------------------${NC}"

# 1. Detect Environment and Build Command Map
detect_and_map() {
    echo -e "${BLUE}🔍 Detecting stack and mapping commands...${NC}"
    
    # Initialize JSON parts
    STACKS=()
    
    # Node detection
    if [ -f "package.json" ]; then
        STACKS+=("node")
        NODE_INSTALL="npm install"; [[ -f "bun.lockb" ]] && NODE_INSTALL="bun install"
        NODE_TEST="npm test"; [[ -f "bun.lockb" ]] && NODE_TEST="bun test"
    fi

    # Python detection
    if [ -f "pyproject.toml" ] || [ -f "requirements.txt" ]; then
        STACKS+=("python")
        PY_INSTALL="pip install -r requirements.txt"; [[ -f "poetry.lock" ]] && PY_INSTALL="poetry install"
        PY_TEST="pytest"; [[ -f "poetry.lock" ]] && PY_TEST="poetry run pytest"
    fi

    # Resolution Logic (Priority or Hybrid)
    if [[ " ${STACKS[*]} " =~ " node " && " ${STACKS[*]} " =~ " python " ]]; then
        PROJECT_TYPE="hybrid"
        OP_INSTALL="$NODE_INSTALL && $PY_INSTALL"
        OP_TEST="echo 'Hybrid: Use specific test commands for Node or Python'"
        OP_TYPECHECK="npx tsc --noEmit && mypy ."
        OP_LINT="npx eslint . && ruff check ."
    elif [[ " ${STACKS[*]} " =~ " node " ]]; then
        PROJECT_TYPE="brownfield"
        OP_INSTALL="$NODE_INSTALL"
        OP_TEST="$NODE_TEST"
        OP_TYPECHECK="npx tsc --noEmit"
        OP_LINT="npx eslint ."
    elif [[ " ${STACKS[*]} " =~ " python " ]]; then
        PROJECT_TYPE="brownfield"
        OP_INSTALL="$PY_INSTALL"
        OP_TEST="$PY_TEST"
        OP_TYPECHECK="mypy ."
        OP_LINT="ruff check ."
    else
        PROJECT_TYPE="greenfield"
        OP_INSTALL="echo 'No install'"
        OP_TEST="echo 'No test'"
        OP_TYPECHECK="echo 'No typecheck'"
        OP_LINT="echo 'No lint'"
    fi
}

# 2. Build Directory Structure
build_structure() {
    mkdir -p "${AGENT_DIR}"/{core,registry,skills,workflows,config,custom,state}
}

# 3. Provision actual files (CRITICAL for registry)
provision_files() {
    echo -e "${BLUE}📦 Provisioning Tier 1 Skills...${NC}"
    
    provision_skill() {
        mkdir -p "${AGENT_DIR}/skills/$1"
        cp "${KIT_ROOT}/skills/$1/SKILL.md" "${AGENT_DIR}/skills/$1/"
    }

    provision_skill "writing-plans"
    provision_skill "verification-before-completion"
    provision_skill "context-optimization"
    
    # Provision Workflows
    cp -r "${KIT_ROOT}/workflows/"* "${AGENT_DIR}/workflows/"
}

# 4. Secure JSON Generation
generate_json_files() {
    # Generate env_state.json
    cat <<EOF > "${AGENT_DIR}/state/env_state.json"
{
  "version": "$VERSION",
  "project_type": "$PROJECT_TYPE",
  "detected_stacks": [$(printf '"%s",' "${STACKS[@]}" | sed 's/,$//')],
  "last_provision": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

    # Generate commands.json (The [OP_*] Resolver)
    # Using a technique to escape quotes if present (though here we control them)
    cat <<EOF > "${AGENT_DIR}/state/commands.json"
{
  "OP_INSTALL": "${OP_INSTALL//\"/\\\"}",
  "OP_TEST": "${OP_TEST//\"/\\\"}",
  "OP_TYPECHECK": "${OP_TYPECHECK//\"/\\\"}",
  "OP_LINT": "${OP_LINT//\"/\\\"}",
  "OP_RUN": "echo 'Define [OP_RUN] in local_overrides.json'"
}
EOF
}


# 5. Core Injection
inject_core() {
    cp "${KIT_ROOT}/core/00_environment_rules.md" "${AGENT_DIR}/core/"
    cp "${KIT_ROOT}/core/01_core_rules.md" "${AGENT_DIR}/core/"
}

# 6. Registry Provisioning
provision_registry() {
    echo -e "${BLUE}📋 Provisioning Registry...${NC}"
    cp -r "${KIT_ROOT}/registry/"* "${AGENT_DIR}/registry/"
}

# Main Execution
detect_and_map
build_structure
provision_files
generate_json_files
inject_core
provision_registry


echo -e "\n${GREEN}✅ Runtime initialization complete.${NC}"
echo -e "${BLUE}--------------------------------------------------${NC}"
echo -e "📂 Structure: Created .agent/ hierarchy"
echo -e "🧠 Content:   Injected Core Rules & Tier 1 Skills"
echo -e "🎯 Context:   $PROJECT_TYPE project detected"
echo -e "🛠️  Stacks:    ${STACKS[*]:-None (Greenfield)}"
echo -e "${BLUE}--------------------------------------------------${NC}"
echo -e "${YELLOW}👉 Next step: Run 'bash scripts/agent doctor' to verify documentation ground truths.${NC}\n"


