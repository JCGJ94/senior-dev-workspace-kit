#!/usr/bin/env bash

set -euo pipefail

echo "🔎 Validating V3 kit structure..."

PYTHON_BIN="${PYTHON_BIN:-python3}"
if ! command -v "$PYTHON_BIN" >/dev/null 2>&1; then
  if command -v python >/dev/null 2>&1; then
    PYTHON_BIN="python"
  else
    echo "❌ Python interpreter not found (tried: python3, python)"
    exit 1
  fi
fi

required_paths=(
  "AGENTS.md"
  "core"
  "scripts/sync-workspace.sh"
  "registry/skill_manifest.json"
  "registry/skill_activation_rules.md"
  "docs/engram/index.md"
  "specs/README.md"
  "skills/architect-orchestrator-v3/SKILL.md"
  "skills/humanized-communication/SKILL.md"
)

for path in "${required_paths[@]}"; do
  if [ ! -e "$path" ]; then
    echo "❌ Missing required path: $path"
    exit 1
  fi
done

bash "$(dirname "$0")/validate-skills.sh"
"$PYTHON_BIN" - <<'PY'
import json
for path in [
    'registry/skill_manifest.json',
    'registry/activation_policy.json',
    'registry/profiles/profiles_manifest.json',
]:
    with open(path, encoding='utf-8') as f:
        json.load(f)
print('Core JSON files are valid.')
PY

# Drift check: every skill in registry must exist in both skills/ and runtime .agent/skills/
# Supports both layouts:
# 1) Standalone kit repo: .agent/skills
# 2) Monorepo (kit/ subdir): ../.agent/skills
"$PYTHON_BIN" - <<'PY'
import json, sys, os

manifest = json.load(open('registry/skill_manifest.json'))
registered = set(manifest['skills'].keys())

source = set(os.listdir('skills'))
runtime_path = None
for candidate in ('.agent/skills', '../.agent/skills'):
    if os.path.isdir(candidate):
        runtime_path = candidate
        break

runtime = set(os.listdir(runtime_path)) if runtime_path else set()

missing_source  = registered - source
missing_runtime = (registered & source) - runtime

errors = []
if missing_source:
    errors.append(f"  Registered but missing from skills/: {sorted(missing_source)}")
if missing_runtime:
    runtime_label = runtime_path if runtime_path else '.agent/skills (not found)'
    errors.append(f"  In registry+source but missing from {runtime_label}: {sorted(missing_runtime)}")

if errors:
    print("❌ Skill drift detected:")
    for e in errors: print(e)
    sys.exit(1)

print(f"Skill drift check passed ({len(registered)} registered, {len(runtime)} in runtime at {runtime_path}).")
PY

echo "V3 kit validation complete."
