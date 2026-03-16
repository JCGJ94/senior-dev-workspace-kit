#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "⚠️ sync-workspace-v2.sh is deprecated. Forwarding to sync-workspace.sh..."
bash "${SCRIPT_DIR}/sync-workspace.sh" "$@"
