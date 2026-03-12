#!/bin/bash

# ==============================================================================
# AI Engineering Workspace Kit - Registry Generator
# Purpose: Scan skills and generate a lightweight skills.json index.
# ==============================================================================

set -e

AGENT_DIR=".agent"
REGISTRY_FILE="${AGENT_DIR}/registry/skills.json"

# Detect skills location (kit root vs provisioned project)
if [ -d "skills" ]; then
    SKILLS_DIR="skills"
elif [ -d "${AGENT_DIR}/skills" ]; then
    SKILLS_DIR="${AGENT_DIR}/skills"
else
    echo "❌ Skills directory not found!"
    exit 1
fi

echo "🔍 Generating light registry scanning: $SKILLS_DIR..."

# Initialize JSON
echo "{" > "$REGISTRY_FILE"
echo "  \"last_updated\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"," >> "$REGISTRY_FILE"
echo "  \"skills\": [" >> "$REGISTRY_FILE"

FIRST=true

# Scan each directory in skills/
for skill_dir in "$SKILLS_DIR"/*/; do
    if [ -f "${skill_dir}SKILL.md" ]; then
        SKILL_FILE="${skill_dir}SKILL.md"
        
        # Robust YAML Field Extraction (Handles spaces and quotes)
        get_yaml_field() {
            local field=$1
            sed -n '/^---$/,/^---$/p' "$SKILL_FILE" | grep "^${field}:" | cut -d':' -f2- | sed 's/^ *//;s/ *$//;s/^["'\'']//;s/["'\'']$//'
        }

        NAME=$(get_yaml_field "name")
        DESC=$(get_yaml_field "description")
        TIER=$(get_yaml_field "tier")
        COST=$(get_yaml_field "context_cost")
        TRIGGERS_RAW=$(get_yaml_field "triggers")

        if [ -n "$NAME" ]; then
            if [ "$FIRST" = true ]; then FIRST=false; else echo "    ," >> "$REGISTRY_FILE"; fi

            # Clean and Format Triggers Array
            T_JSON=$(echo "$TRIGGERS_RAW" | sed 's/[\[\]]//g;s/,/ /g' | xargs -n1 echo | sed 's/.*/"&"/' | paste -sd, -)

            echo "    {" >> "$REGISTRY_FILE"
            echo "      \"name\": \"$NAME\"," >> "$REGISTRY_FILE"
            echo "      \"description\": \"$DESC\"," >> "$REGISTRY_FILE"
            echo "      \"tier\": ${TIER:-2}," >> "$REGISTRY_FILE"
            echo "      \"context_cost\": ${COST:-0}," >> "$REGISTRY_FILE"
            echo "      \"triggers\": [$T_JSON]," >> "$REGISTRY_FILE"
            echo "      \"path\": \"$SKILL_FILE\"" >> "$REGISTRY_FILE"
            echo "    }" >> "$REGISTRY_FILE"
        fi
    fi
done


echo "  ]" >> "$REGISTRY_FILE"
echo "}" >> "$REGISTRY_FILE"

echo "✅ Registry generated at ${REGISTRY_FILE}"
