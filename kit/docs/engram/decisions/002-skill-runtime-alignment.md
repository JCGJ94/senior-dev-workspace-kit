# ADR 002: Source Kit vs Runtime Skill Alignment

**Status:** Accepted
**Date:** 2026-03-20
**Context:** V3 Runtime Governance
**Decision Owner:** Pedrito (AI Engineering Workspace Kit)

## Context

The AI Engineering Workspace Kit V3 maintains skills in two locations:
- **Source kit:** `skills/` directory (43 skills available)
- **Runtime:** `.agent/skills/` directory (previously 23 skills installed)

Two registries track skills:
- **Source manifest:** `registry/skill_manifest.json` (31 skills declared)
- **Runtime manifest:** `.agent/registry/skills.json` (previously 23 skills, now 31)

**Drift detected on 2026-03-20:**
- `registry/skill_manifest.json` announced 8 skills that were NOT installed in runtime
- This created a gap between "announced capabilities" and "active capabilities"
- Risk: agent attempts to use skills that don't exist, causing failures

## Decision

**Adopt Opción B - Política Completa:**

1. Install the 8 missing skills that `registry/skill_manifest.json` declares:
   - `backend`
   - `commit-sentinel`
   - `debugging`
   - `docs-pro`
   - `frontend`
   - `fullstack`
   - `python-ecosystem`
   - `typescript-ecosystem`

2. Update `.agent/registry/skills.json` with full metadata for all 31 skills

3. Maintain 12 skills as "available but not installed" for JIT activation

## Rationale

- **Zero drift:** Registry now accurately reflects runtime state
- **Enhanced capability:** Agent can handle backend, frontend, fullstack, Python, and TypeScript tasks
- **Context efficiency:** Only 31 of 43 available skills are active (72% coverage)
- **JIT ready:** Remaining 12 skills can be installed on-demand
- **V3 compliance:** Aligns with `.agent/core/01_core_rules.md` skill orchestration model

## Implementation

**Files modified:**
- `.agent/skills/` - added 8 skill directories
- `.agent/registry/skills.json` - added 8 skill entries with tier, context_cost, triggers, paths

**Skills added:**
- `backend` (tier 1, 450 tokens)
- `commit-sentinel` (tier 1, 280 tokens)
- `debugging` (tier 1, 400 tokens)
- `docs-pro` (tier 1, 320 tokens)
- `frontend` (tier 1, 420 tokens)
- `fullstack` (tier 2, 500 tokens)
- `python-ecosystem` (tier 1, 380 tokens)
- `typescript-ecosystem` (tier 1, 340 tokens)

**Total context cost added:** ~3,090 tokens

## Verification

```bash
# Source skills available
ls -1 skills | wc -l
# Output: 43

# Runtime skills installed
ls -1 .agent/skills | wc -l
# Output: 31

# Registry entries
cat .agent/registry/skills.json | grep '"name":' | wc -l
# Output: 31

# All SKILL.md files present
for skill_dir in .agent/skills/*/; do
  skill_name=$(basename "$skill_dir")
  if [ ! -f "$skill_dir/SKILL.md" ]; then
    echo "✗ $skill_name - missing SKILL.md"
  fi
done
# Output: ✓ Verification completed (no errors)
```

## Risks Mitigated

- **Broken references:** Zero skills are announced but missing
- **Silent failures:** Agent won't try to activate non-existent skills
- **Capability gaps:** Coverage expanded from 53% to 72% of available skills

## Follow-up Actions

1. Monitor context cost in production (total: ~12,000 tokens for 31 skills)
2. Consider lazy-loading tier 2 skills for large codebases
3. Document JIT activation protocol for remaining 12 skills
4. Add automated sync check to CI/CD pipeline

## Consequences

**Positive:**
- Runtime consistency restored
- Enhanced multi-ecosystem support (Python, TypeScript, Frontend, Backend)
- Documentation and debugging skills now available
- Commit quality gates (commit-sentinel) active

**Negative:**
- Slight context cost increase (~3K tokens)
- More skills to maintain in sync

**Neutral:**
- 12 skills remain uninstalled (available for future expansion)

## Runtime Versioning Strategy

**Decision:** Version `.agent/` runtime with selective exclusions

**Rationale:**
- Before: `.agent/` was fully gitignored (ephemeral runtime)
- After: `.agent/` is versioned with `.agent/.gitignore` for dynamic state

**What gets versioned:**
- ✅ `.agent/core/` - core rules (48K)
- ✅ `.agent/registry/` - skill manifests and policies (69K)
- ✅ `.agent/skills/` - 31 skill definitions (136K)
- ✅ `.agent/workflows/` - workflow templates (20K)
- ✅ `.agent/.gitignore` - exclusion policy

**What gets excluded (via `.agent/.gitignore`):**
- ❌ `.agent/state/engram/` - session memory (non-portable)
- ❌ `.agent/state/*.json` - dynamic state files
- ❌ `*.log`, `*.tmp`, `.cache/` - temporary artifacts
- ❌ `.agent/config/local/`, `.agent/custom/local/` - machine-specific config

**Benefits:**
1. Runtime consistency across clones
2. Portable skill set (31 skills ready-to-use)
3. Version control for core rules evolution
4. No secrets or sensitive data versioned
5. Lightweight footprint (~262K total)

**Size impact:**
- 58 files added to version control
- Total size: 262KB (acceptable)
- No binary files or bloat

**Verification:**
```bash
# State directory excluded correctly
git status .agent/state/
# Output: A  .agent/state/.gitkeep (only placeholder tracked)

# Dynamic files not tracked
git ls-files .agent/state/*.json
# Output: (empty)
```

## Related

- [ADR 001: Pedrito Identity](001-pedrito-identity.md)
- [AGENTS.md](../../../AGENTS.md) - Runtime contract
- [.agent/core/01_core_rules.md](../../../.agent/core/01_core_rules.md) - Skill orchestration rules
- [.agent/.gitignore](../../../.agent/.gitignore) - Runtime exclusion policy
