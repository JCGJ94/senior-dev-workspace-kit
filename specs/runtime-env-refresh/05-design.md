# Design

## Components
- `.agent/state/allowed_ops.json` — content rewrite
- `.agent/state/env_state.json` — content rewrite
- `scripts/provision.sh` — new detection branch `agent-kit`
- `config/project-types.json` — add type `"agent-kit"`

## Boundaries
- Only stack detection and state file generation are touched
- Provisioning logic for skills, workflows, or registry is not modified

## Data Flow
```
provision.sh detects AGENTS.md + core/ + skills/
  → project_type = "agent-kit"
  → generates allowed_ops.json with real mapping
  → generates env_state.json with real stacks
```

## Key Decisions
1. **`OP_INSTALL` is a no-op**: the kit has no runtime dependencies — it's config-only
2. **`OP_TEST` = validate-kit.sh**: structural validation IS the test suite for this repo
3. **`OP_TYPECHECK` = validate-skills.py**: validates frontmatter, registry consistency
