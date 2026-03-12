#!/bin/bash

# ==============================================================================
# JIT Skill Manager - Dynamic Upstream Importer
# ==============================================================================
# Resolves capabilities dynamically fetching missing SKILL.md files from
# the Mother Repo (Upstream) or standard web sources without blocking workflows.

set -e

KIT_RAW_BASE="https://raw.githubusercontent.com/JCGJ94/senior-dev-workspace-kit/main/ai-engineering-workspace-kit/skills"
AGENT_DIR=".agent"
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ "$1" == "install" ]; then
    SKILL_NAME=$2
    if [ -z "$SKILL_NAME" ]; then
        echo -e "${RED}❌ Error: Please provide a skill name.${NC} Example: bash scripts/skill-manager.sh install supabase-postgres-best-practices"
        exit 1
    fi

    # Check local status
    if [ -d "${AGENT_DIR}/skills/${SKILL_NAME}" ]; then
        echo -e "${GREEN}✅ Skill '${SKILL_NAME}' is already installed in the local runtime.${NC}"
        exit 0
    fi

    echo -e "${BLUE}🔍 JIT Protocol: Searching for skill '${SKILL_NAME}' in Upstream Mother Repo...${NC}"
    mkdir -p "${AGENT_DIR}/skills/${SKILL_NAME}"
    
    # Try fetching from Upstream Kit Repo
    HTTP_CODE=$(curl -sL -w "%{http_code}" "${KIT_RAW_BASE}/${SKILL_NAME}/SKILL.md" -o "${AGENT_DIR}/skills/${SKILL_NAME}/SKILL.md")
    
    if [ "$HTTP_CODE" == "200" ]; then
        echo -e "${GREEN}✅ Download successful. Skill injected into runtime.${NC}"
    else
        echo -e "${YELLOW}⚠️ Skill not found in Upstream Repo.${NC}"
        echo -e "   Cleaning up missing folder..."
        rm -rf "${AGENT_DIR}/skills/${SKILL_NAME}"

        echo -e "${BLUE}🤖 [AGENT DIRECTIVE] Fallback triggered:${NC}"
        echo -e "   The requested skill is not native. If you fetched syntax from ${ YELLOW}skills.sh${NC} or similar,"
        echo -e "   use the 'skill-creator' to standardize and forge it locally."
        exit 1
    fi

    # Update global skills.json registry to notify the agent
    if [ -f "scripts/generate-registry.sh" ]; then
        bash "scripts/generate-registry.sh" > /dev/null
        echo -e "${GREEN}✅ Agent Runtime Registry Regenerated. The skill is now active.${NC}"
    else
        echo -e "${RED}❌ Warning: Could not find scripts/generate-registry.sh. The agent may not recognize the new skill until manually updated.${NC}"
    fi
    exit 0
fi

echo -e "Usage:"
echo -e "  bash scripts/skill-manager.sh install <skill-name>"
exit 1
