#!/usr/bin/env bash

set -euo pipefail

AGENT_DIR=".agent"
REGISTRY_FILE="${AGENT_DIR}/registry/skills.json"

# Runtime registry always reflects the installed runtime (.agent/skills/), not the source library.
# Source library (skills/) may contain unregistered/experimental skills that should not appear in the runtime registry.
if [ -d "${AGENT_DIR}/skills" ]; then
    SKILLS_DIR="${AGENT_DIR}/skills"
elif [ -d "skills" ]; then
    SKILLS_DIR="skills"
else
    echo "❌ Skills directory not found!"
    exit 1
fi

mkdir -p "${AGENT_DIR}/registry"

echo "🔍 Generating light registry scanning: ${SKILLS_DIR}..."

python - "${SKILLS_DIR}" "${REGISTRY_FILE}" <<'PY'
import json
import sys
from pathlib import Path

skills_dir = Path(sys.argv[1])
registry_file = Path(sys.argv[2])

def parse_frontmatter(text: str):
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None

    data = {}
    in_triggers = False
    for line in lines[1:]:
        stripped = line.strip()
        if stripped == "---":
            return data
        if not stripped:
            continue
        if in_triggers and stripped.startswith("- "):
            data.setdefault("triggers", []).append(stripped[2:].strip().strip('"'))
            continue
        in_triggers = False
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if key == "triggers":
            in_triggers = True
            data.setdefault("triggers", [])
            if value.startswith("[") and value.endswith("]"):
                inner = value[1:-1].strip()
                if inner:
                    data["triggers"] = [item.strip().strip('"') for item in inner.split(",") if item.strip()]
                in_triggers = False
            continue
        data[key] = value.strip('"')
    return None

skills = []
for skill_file in sorted(skills_dir.glob("*/SKILL.md")):
    meta = parse_frontmatter(skill_file.read_text(encoding="utf-8"))
    if not meta or not meta.get("name"):
        continue
    try:
        tier = int(meta.get("tier", "2"))
    except ValueError:
        tier = 2
    try:
        context_cost = int(meta.get("context_cost", "0"))
    except ValueError:
        context_cost = 0
    skills.append(
        {
            "name": meta["name"],
            "description": meta.get("description", ""),
            "tier": tier,
            "context_cost": context_cost,
            "triggers": meta.get("triggers", []),
            "path": str(skill_file).replace("\\", "/"),
        }
    )

registry = {"last_updated": __import__("datetime").datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"), "skills": skills}
registry_file.write_text(json.dumps(registry, indent=2) + "\n", encoding="utf-8")
print(f"Registry generated at {registry_file}")
PY
