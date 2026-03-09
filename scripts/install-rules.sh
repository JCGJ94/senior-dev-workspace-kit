#!/usr/bin/env bash

set -e

echo "📦 Installing AI Rules..."

DEVKIT_DIR=".devkit"
KIT_DIR="${KIT_DIR:-$(dirname "$0")/..}"

mkdir -p "$DEVKIT_DIR/ai_rules"
cp -R -n "$KIT_DIR/ai_rules/"* "$DEVKIT_DIR/ai_rules/" 2>/dev/null || true

echo "✅ AI Rules installed."
