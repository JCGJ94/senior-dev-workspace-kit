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

# Initialize JSON parts
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
    mkdir -p "${AGENT_DIR}"/{core,registry,skills,workflows,config,custom,state,state/engram}
}

# 3. Provision actual files (CRITICAL for registry)
provision_files() {
    echo -e "${BLUE}📦 Provisioning Tier 1 Skills (Core)...${NC}"
    
    provision_skill() {
        if [ -d "${KIT_ROOT}/skills/$1" ]; then
            mkdir -p "${AGENT_DIR}/skills/$1"
            cp "${KIT_ROOT}/skills/$1/SKILL.md" "${AGENT_DIR}/skills/$1/"
            echo -e "   ✅ Loaded: $1"
        else
            echo -e "   ⚠️ Skill not found: $1"
        fi
    }

    provision_skill "writing-plans"
    provision_skill "verification-before-completion"
    provision_skill "context-optimization"
    
    # Provision Workflows
    cp -r "${KIT_ROOT}/workflows/"* "${AGENT_DIR}/workflows/"
}

# 3.1 Interactive Skill Selection
interactive_skills() {
    if [ "$INTERACTIVE" = false ]; then
        return
    fi

    echo -e "\n${BLUE}🦸 Choose your Agent Superpowers (Tiers 2-4)${NC}"
    echo -e "1) ${GREEN}Core-only${NC} (Keep it lightweight)"
    echo -e "2) ${GREEN}Recommended Pro${NC} (Based on your detected stack: ${STACKS[*]:-General})"
    echo -e "3) ${GREEN}Full Beast Mode${NC} (Load ALL available skills - High Token Cost)"
    echo -e "4) ${GREEN}Manual Selection${NC} (Pick specific categories)"
    
    echo -n -e "\nSelect an option [1-4] (Default: 2): "
    read -r CHOICE
    CHOICE=${CHOICE:-2}

    case "$CHOICE" in
        1)
            echo -e "${YELLOW}Staying with Tier 1 only.${NC}"
            ;;
        2|3|4)
            # Handle categories
            local SKILLS_TO_LOAD=()
            
            if [ "$CHOICE" == "2" ]; then
                # Auto-recommendations
                if [[ " ${STACKS[*]} " =~ " node " ]]; then
                    SKILLS_TO_LOAD+=("typescript-advanced-types" "typescript-ecosystem" "test-driven-development")
                fi
                if [[ " ${STACKS[*]} " =~ " python " ]]; then
                    SKILLS_TO_LOAD+=("python-ecosystem" "python-performance-optimization")
                fi
                SKILLS_TO_LOAD+=("systematic-debugging" "code-review-pro" "ai-agent" "skill-creator")
            elif [ "$CHOICE" == "3" ]; then
                # Load everything (all dirs in KIT_ROOT/skills)
                for d in "${KIT_ROOT}/skills/"*/; do
                    local name=$(basename "$d")
                    if [[ ! " writing-plans verification-before-completion context-optimization " =~ " $name " ]]; then
                        SKILLS_TO_LOAD+=("$name")
                    fi
                done
            elif [ "$CHOICE" == "4" ]; then
                echo -e "\nAvailable Categories:"
                echo -e "A) Frontend & UI Design"
                echo -e "B) Backend & DB (SupaBase, Python, Node)"
                echo -e "C) AI & Orchestration"
                echo -e "D) Advanced Debugging & Quality"
                echo -n -e "\nChoose categories (e.g., AD): "
                read -r CATS
                CATS=${CATS^^} # Uppercase

                [[ "$CATS" =~ "A" ]] && SKILLS_TO_LOAD+=("frontend-design" "ui-ux-pro-max" "frontend-responsive-design-standards" "seo-audit")
                [[ "$CATS" =~ "B" ]] && SKILLS_TO_LOAD+=("supabase-postgres-best-practices" "python-ecosystem" "typescript-ecosystem" "mcp-builder")
                [[ "$CATS" =~ "C" ]] && SKILLS_TO_LOAD+=("ai-agent" "dispatching-parallel-agents" "context-distiller" "skill-creator")
                [[ "$CATS" =~ "D" ]] && SKILLS_TO_LOAD+=("systematic-debugging" "code-review-pro" "test-driven-development" "commit-sentinel")
            fi

            echo -e "\n${BLUE}📦 Loading additional skills...${NC}"
            for skill in "${SKILLS_TO_LOAD[@]}"; do
                provision_skill "$skill"
            done
            ;;
    esac
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


# 5. Core Injection (Non-Negotiable)
inject_core() {
    echo -e "${BLUE}🧠 Injecting Architectural Core Rules...${NC}"
    cp "${KIT_ROOT}/core/"* "${AGENT_DIR}/core/"
}

# 6. Registry Provisioning
provision_registry() {
    echo -e "${BLUE}📋 Provisioning Registry...${NC}"
    cp -r "${KIT_ROOT}/registry/"* "${AGENT_DIR}/registry/"
}

# 7. Gateway Generation (AGENTS.md)
generate_agents_md() {
    echo -e "${BLUE}🚪 Generating Universal Agent Gateway (AGENTS.md)...${NC}"
    cat <<EOF > "AGENTS.md"
# 🤖 Project Agent Gateway

This project is managed by the **Senior Dev Workspace Kit v2**. 
You, the AI Assistant, MUST adhere to the following architecture and context constraints before executing tasks.

## 🗺️ Project Navigation
- **Core Rules (MANDATORY):** Read \`.agent/core/\` to understand the architecture, restrictions, and memory handling. Your primary directive is found in \`.agent/core/01_core_rules.md\`.
- **Active Capabilities:** Check \`.agent/registry/skills.json\` to see what specific skills and workflows are authorized for this session.
- **State & Tokens:** Read \`.agent/state/env_state.json\` and \`.agent/state/commands.json\` to understand the stack and resolve \`[OP_*]\` operational tokens.

## 🧠 Memory & Context Protocol (Engram)
- This project utilizes local persistent memory. 
- Look for historical facts, architecture decisions, and preferences in the \`.agent/state/engram/\` directory (if populated). 
- Do NOT hallucinate rules; check the Context first.

## 💡 JIT Capabilities & Anti-Obsolescence
1. If you require current API documentation (e.g., Next.js 15, React 19), you MUST use **Context7** (if available) or the \`browser_subagent\` before guessing.
2. If you lack a specific skill required for a task, refer to the **JIT Skill Installation Protocol** in \`08_activation_policy.md\`.

> **Note:** Do not modify this file directly. It is auto-generated by the provisioning system.
EOF
}

# Main Execution
detect_and_map
build_structure
provision_files
interactive_skills
generate_json_files
inject_core
provision_registry
generate_agents_md

echo -e "\n${GREEN}✅ Runtime initialization complete.${NC}"
echo -e "${BLUE}--------------------------------------------------${NC}"
echo -e "📂 Structure: Created .agent/ hierarchy"
echo -e "🧠 Content:   Injected Core Rules & Tier 1 Skills"
echo -e "🎯 Context:   $PROJECT_TYPE project detected"
echo -e "🛠️  Stacks:    ${STACKS[*]:-None (Greenfield)}"
echo -e "${BLUE}--------------------------------------------------${NC}"
echo -e "${YELLOW}👉 Next step: Run 'bash scripts/agent doctor' to verify documentation ground truths.${NC}\n"


