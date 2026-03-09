#!/usr/bin/env bash

set -e

echo "🔄 Syncing workspace..."

DEVKIT_DIR=".devkit"
KIT_DIR="${KIT_DIR:-$(dirname "$0")/..}"
MANIFEST="$DEVKIT_DIR/workspace.manifest.json"

if [ ! -d "$DEVKIT_DIR" ]; then
    echo "❌ Error: .devkit folder not found. Run bootstrap-workspace.sh first."
    exit 1
fi

# Sync files logic (update non-customizable files)
for module in ai_rules skills workflows; do
    if [ -d "$KIT_DIR/$module" ]; then
        for file in "$KIT_DIR/$module"/*.md; do
            filename=$(basename "$file")
            target="$DEVKIT_DIR/$module/$filename"
            
            # Check if file is customizable
            is_custom=$(grep "\"$module/$filename\"" "$MANIFEST" >/dev/null 2>&1 && echo "yes" || echo "no")
            
            if [ "$is_custom" = "no" ]; then
                cp -f "$file" "$target"
                echo "♻️ Updated $target"
            else
                echo "⏭️ Skipped customized file $target"
            fi
        done
    fi
done

echo "✅ Workspace synced successfully."
