#!/usr/bin/env bash

set -euo pipefail

echo "🔎 Validating V3 kit structure..."

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

if [ -f "${REPO_ROOT}/kit/AGENTS.md" ] && [ -d "${REPO_ROOT}/kit/core" ]; then
  KIT_ROOT="${REPO_ROOT}/kit"
elif [ -f "${REPO_ROOT}/AGENTS.md" ] && [ -d "${REPO_ROOT}/core" ]; then
  KIT_ROOT="${REPO_ROOT}"
else
  echo "❌ Could not locate kit root from ${REPO_ROOT}"
  exit 1
fi

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
  "${KIT_ROOT}/AGENTS.md"
  "${KIT_ROOT}/core"
  "${KIT_ROOT}/scripts/sync-workspace.sh"
  "${KIT_ROOT}/registry/skill_manifest.json"
  "${KIT_ROOT}/registry/skill_activation_rules.md"
  "${KIT_ROOT}/docs/engram/index.md"
  "${KIT_ROOT}/specs/README.md"
  "${KIT_ROOT}/skills/architect-orchestrator-v3/SKILL.md"
  "${KIT_ROOT}/skills/humanized-communication/SKILL.md"
)

for path in "${required_paths[@]}"; do
  if [ ! -e "$path" ]; then
    echo "❌ Missing required path: $path"
    exit 1
  fi
done

bash "${SCRIPT_DIR}/validate-skills.sh"
REPO_ROOT="$REPO_ROOT" KIT_ROOT="$KIT_ROOT" "$PYTHON_BIN" - <<'PY'
import json
import os

kit_root = os.environ['KIT_ROOT']

for path in [
    os.path.join(kit_root, 'registry/skill_manifest.json'),
    os.path.join(kit_root, 'registry/activation_policy.json'),
    os.path.join(kit_root, 'registry/profiles/profiles_manifest.json'),
]:
    with open(path, encoding='utf-8') as f:
        json.load(f)
print('Core JSON files are valid.')
PY

# Drift check: every skill in registry must exist in both skills/ and runtime .agent/skills/
# Supports both layouts:
# 1) Standalone kit repo: .agent/skills
# 2) Monorepo (kit/ subdir): ../.agent/skills
REPO_ROOT="$REPO_ROOT" KIT_ROOT="$KIT_ROOT" "$PYTHON_BIN" - <<'PY'
import json, sys, os

repo_root = os.environ['REPO_ROOT']
kit_root = os.environ['KIT_ROOT']

manifest = json.load(open(os.path.join(kit_root, 'registry/skill_manifest.json')))
registered = set(manifest['skills'].keys())

source = set(os.listdir(os.path.join(kit_root, 'skills')))
runtime_path = None
for candidate in (
    os.path.join(repo_root, '.agent', 'skills'),
    os.path.join(os.path.dirname(kit_root), '.agent', 'skills'),
    '.agent/skills',
    '../.agent/skills',
):
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
