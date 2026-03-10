#!/usr/bin/env bash

set -e

echo "🚀 Bootstrapping AI Engineering Workspace..."

# Detect workspace root
if [ ! -d ".git" ]; then
    echo "❌ Error: Please run this script from the root of your git project."
    exit 1
fi

# Create .devkit folder
DEVKIT_DIR=".devkit"
mkdir -p "$DEVKIT_DIR"

# Source KIT Directory (assuming it's installed or cloned nearby, here we use a placeholder or relative path)
KIT_DIR="${KIT_DIR:-$(dirname "$0")/..}"

# Copy without overwriting existing files
echo "📂 Copying AI Rules..."
cp -R -n "$KIT_DIR/ai_rules" "$DEVKIT_DIR/" 2>/dev/null || true

echo "📂 Copying Skills..."
cp -R -n "$KIT_DIR/skills" "$DEVKIT_DIR/" 2>/dev/null || true

echo "📂 Copying Workflows..."
cp -R -n "$KIT_DIR/workflows" "$DEVKIT_DIR/" 2>/dev/null || true

echo "📂 Copying Skills Registry..."
cp -R -n "$KIT_DIR/skills_registry" "$DEVKIT_DIR/" 2>/dev/null || true

# Generate default manifest
MANIFEST="$DEVKIT_DIR/workspace.manifest.json"
if [ ! -f "$MANIFEST" ]; then
    echo "📄 Generating workspace.manifest.json..."
    cp "$KIT_DIR/config/workspace.manifest.json" "$MANIFEST" 2>/dev/null || cat > "$MANIFEST" <<EOF
{
  "kitVersion": "0.1.0",
  "installedModules": [
    "ai_rules",
    "skills",
    "workflows",
    "skills_registry"
  ],
  "customizableFiles": [
    "ai_rules/05_project_rules.md",
    "ai_rules/06_memory_rules.md"
  ]
}
EOF
fi

echo "✅ Workspace correctly bootstrapped in $DEVKIT_DIR"
