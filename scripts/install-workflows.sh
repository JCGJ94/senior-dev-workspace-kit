#!/usr/bin/env bash

set -e

echo "📦 Installing Workflows..."

DEVKIT_DIR=".devkit"
KIT_DIR="${KIT_DIR:-$(dirname "$0")/..}"

mkdir -p "$DEVKIT_DIR/workflows"
cp -R -n "$KIT_DIR/workflows/"* "$DEVKIT_DIR/workflows/" 2>/dev/null || true

echo "✅ Workflows installed."
