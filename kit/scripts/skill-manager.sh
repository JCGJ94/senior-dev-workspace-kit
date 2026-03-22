#!/usr/bin/env bash

set -euo pipefail

KIT_RAW_BASE="https://raw.githubusercontent.com/JCGJ94/senior-dev-workspace-kit/main/ai-engineering-workspace-kit/skills"
AGENT_DIR=".agent"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

usage() {
    echo -e "Usage:"
    echo -e "  bash scripts/skill-manager.sh install <skill-name>"
}

validate_skill_name() {
    case "$1" in
        ''|*[^a-z0-9-]*) return 1 ;;
        *) return 0 ;;
    esac
}

if [ "${1:-}" != "install" ]; then
    usage
    exit 1
fi

SKILL_NAME="${2:-}"
if ! validate_skill_name "$SKILL_NAME"; then
    echo -e "${RED}❌ Error: invalid skill name. Use lowercase letters, numbers, and dashes only.${NC}"
    exit 1
fi

TARGET_DIR="${AGENT_DIR}/skills/${SKILL_NAME}"
TARGET_FILE="${TARGET_DIR}/SKILL.md"

mkdir -p "${AGENT_DIR}/skills"

if [ -d "$TARGET_DIR" ]; then
    echo -e "${GREEN}✅ Skill '${SKILL_NAME}' is already installed in the local runtime.${NC}"
    exit 0
fi

echo -e "${BLUE}🔍 JIT Protocol: searching local trusted upstream for skill '${SKILL_NAME}'...${NC}"
mkdir -p "$TARGET_DIR"

cleanup_target() {
    if [ -d "$TARGET_DIR" ] && [ "$TARGET_DIR" != "${AGENT_DIR}/skills" ]; then
        rm -rf -- "$TARGET_DIR"
    fi
}

trap cleanup_target ERR

HTTP_CODE=$(curl -fsSL -w "%{http_code}" "${KIT_RAW_BASE}/${SKILL_NAME}/SKILL.md" -o "$TARGET_FILE" || true)

if [ "$HTTP_CODE" != "200" ]; then
    echo -e "${YELLOW}⚠️ Skill not found in trusted upstream.${NC}"
    cleanup_target
    echo -e "${BLUE}🤖 [AGENT DIRECTIVE] Fallback triggered:${NC}"
    echo -e "   The requested skill is not present in the trusted upstream set."
    echo -e "   Trusted external discovery order: skills.sh, agents.md, github.com/obra/superpowers."
    echo -e "   Any external skill still requires developer approval and V3 adaptation before activation."
    exit 1
fi

if ! grep -q '^---$' "$TARGET_FILE"; then
    echo -e "${RED}❌ Downloaded skill is missing metadata frontmatter and cannot be activated safely.${NC}"
    cleanup_target
    exit 1
fi

trap - ERR

echo -e "${GREEN}✅ Download successful from trusted upstream. Skill injected into runtime.${NC}"

if [ -f "scripts/generate-registry.sh" ]; then
    bash "scripts/generate-registry.sh" > /dev/null
    echo -e "${GREEN}✅ Agent runtime registry regenerated. The skill is now active.${NC}"
else
    echo -e "${RED}❌ Warning: scripts/generate-registry.sh not found. Manual registry update required.${NC}"
fi
