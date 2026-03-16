# AI Engineering Workspace Kit usage guide

## Lifecycle

### 1. Install the runtime

```bash
bash /path/to/ai-engineering-workspace-kit/scripts/agent init
```

This provisions `.agent/`, `docs/engram/`, and `specs/` into the target repository.

### 2. Sync the runtime

```bash
bash /path/to/ai-engineering-workspace-kit/scripts/agent sync
```

This refreshes the runtime from the source kit while keeping the V3 model intact.

### 3. Validate the source kit

```bash
bash /path/to/ai-engineering-workspace-kit/scripts/validate-kit.sh
```

## Operating rules

- The agent reads `.agent/core/` for installed rules.
- `AGENTS.md` is the runtime contract.
- `docs/engram/` stores durable memory.
- `specs/` stores non-trivial work artifacts.
- The agent keeps context lean and activates the minimum useful skill set.

## Approval model

The agent may analyze, plan, summarize, and prepare low-risk reversible changes autonomously.

The agent must ask before architecture changes, external skill adoption, dependency changes, destructive file actions, or security/deploy/data actions.

## JIT skills

When a skill is missing, the trusted lookup order is:

1. local kit or runtime skills
2. `https://skills.sh/`
3. `https://agents.md/`
4. `https://github.com/obra/superpowers`

External skills require approval and V3 adaptation before activation.
