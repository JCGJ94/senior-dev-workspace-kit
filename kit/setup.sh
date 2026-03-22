#!/usr/bin/env bash

# ==============================================================================
# Pedrito — AI Engineering Workspace Kit V3
# Bootstrap: installs the kit globally and provisions a target project.
#
# Usage:
#   bash setup.sh                  # provisions current directory
#   bash setup.sh /path/to/project # provisions a specific project
# ==============================================================================

set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

KIT_SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT_STABLE="$HOME/.pedrito-kit"
TARGET="${1:-$(pwd)}"

# ── Banner ────────────────────────────────────────────────────────────────────
echo -e "${BLUE}"
echo "  ____          _     _ __         "
echo " / __ \\___ ____| |   (_) /______  "
echo "/ /_/ / -_) __/ / __/ / __/ __/ _ \\"
echo "\\____/\\__/_/ /_/____/_/\\__/_/  \\___/"
echo -e "${NC}"
echo -e "${BLUE}Pedrito — AI Engineering Workspace Kit V3${NC}"
echo -e "Target: ${GREEN}${TARGET}${NC}\n"

# ── Step 1: Install kit to stable location ───────────────────────────────────
echo -e "${BLUE}[1/4] Installing kit...${NC}"

if [ "$KIT_SOURCE" = "$KIT_STABLE" ]; then
    echo -e "  Kit already at stable location: $KIT_STABLE"
elif [ -d "$KIT_STABLE/.git" ]; then
    echo -e "  Updating existing git installation..."
    git -C "$KIT_STABLE" pull --quiet
    echo -e "  Updated."
elif [ -d "$KIT_STABLE" ]; then
    echo -e "  Refreshing existing installation..."
    cp -r "$KIT_SOURCE/." "$KIT_STABLE/"
    echo -e "  Done."
else
    echo -e "  Installing to $KIT_STABLE..."
    cp -r "$KIT_SOURCE" "$KIT_STABLE"
    echo -e "  Done."
fi

# ── Step 2: Register 'pedrito' command in shell profile ──────────────────────
echo -e "\n${BLUE}[2/4] Registering 'pedrito' command...${NC}"

PEDRITO_MARKER="# pedrito-kit"
PEDRITO_SNIPPET="${PEDRITO_MARKER}
pedrito() { bash \"\$HOME/.pedrito-kit/scripts/agent\" \"\$@\"; }
"

REGISTERED=false
for rc in "$HOME/.bashrc" "$HOME/.zshrc" "$HOME/.bash_profile" "$HOME/.profile"; do
    if [ -f "$rc" ]; then
        if grep -q "pedrito-kit" "$rc" 2>/dev/null; then
            echo -e "  Already registered in $rc"
            REGISTERED=true
        else
            printf '\n%s\n' "$PEDRITO_SNIPPET" >> "$rc"
            echo -e "  ${GREEN}Registered in $rc${NC}"
            REGISTERED=true
        fi
        break
    fi
done

if [ "$REGISTERED" = "false" ]; then
    # No rc file found — create .bashrc
    printf '%s\n' "$PEDRITO_SNIPPET" > "$HOME/.bashrc"
    echo -e "  ${GREEN}Created ~/.bashrc with pedrito command${NC}"
fi

# Make pedrito available in this session without requiring restart
pedrito() { bash "$HOME/.pedrito-kit/scripts/agent" "$@"; }
export -f pedrito 2>/dev/null || true

# ── Step 3: Provision the target project ─────────────────────────────────────
echo -e "\n${BLUE}[3/4] Provisioning workspace...${NC}"

if [ ! -d "$TARGET" ]; then
    echo -e "  ${RED}❌ Target directory not found: $TARGET${NC}"
    exit 1
fi

cd "$TARGET"
bash "$KIT_STABLE/scripts/agent" init

# ── Step 4: Health check ─────────────────────────────────────────────────────
echo -e "\n${BLUE}[4/4] Running health check...${NC}"
bash "$KIT_STABLE/scripts/agent" doctor

# ── Done ─────────────────────────────────────────────────────────────────────
echo -e "\n${GREEN}✨ Pedrito is ready in: ${TARGET}${NC}"
echo -e ""
echo -e "Available commands (after reloading your shell):"
echo -e "  ${GREEN}pedrito init${NC}      — provision a new project"
echo -e "  ${GREEN}pedrito sync${NC}      — sync runtime from latest kit"
echo -e "  ${GREEN}pedrito doctor${NC}    — health check: SDD · Engram · Context7 · MCP"
echo -e "  ${GREEN}pedrito validate${NC}  — audit skills and kit structure"
echo -e "  ${GREEN}pedrito status${NC}    — show installed runtime state"
echo -e "  ${GREEN}pedrito update${NC}    — update the kit itself"
echo -e "  ${GREEN}pedrito help${NC}      — full command reference"
echo -e ""
echo -e "${YELLOW}Reload your shell or run:${NC}"
echo -e "  source ~/.bashrc   (bash)"
echo -e "  source ~/.zshrc    (zsh)"
