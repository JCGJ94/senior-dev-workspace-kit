#!/usr/bin/env bash

set -e

echo "📦 Installing Skills..."

DEVKIT_DIR=".devkit"
KIT_DIR="${KIT_DIR:-$(dirname "$0")/..}"

mkdir -p "$DEVKIT_DIR/skills"
cp -R -n "$KIT_DIR/skills/"* "$DEVKIT_DIR/skills/" 2>/dev/null || true

echo "✅ Skills installed."
