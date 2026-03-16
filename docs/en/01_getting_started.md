# Getting started

## Installation

Clone the repository and initialize a target project from its root:

```bash
git clone <repo> ai-engineering-workspace-kit
cd /path/to/target-project
bash ../ai-engineering-workspace-kit/scripts/agent init
```

This creates `.agent/` in the target project.
The `init` command is non-interactive by default.

## Main scripts

- `scripts/agent` - unified V3 entrypoint
- `scripts/provision.sh` - installs the runtime into a target project
- `scripts/sync-workspace.sh` - refreshes an existing runtime
- `scripts/generate-registry.sh` - regenerates `.agent/registry/skills.json`
- `scripts/skill-manager.sh` - installs trusted upstream skills into the runtime
- `scripts/validate-kit.sh` - validates the source kit
- `scripts/validate-skills.sh` - validates the local skill structure
