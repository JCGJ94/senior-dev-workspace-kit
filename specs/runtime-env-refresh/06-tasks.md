# Tasks

## Ordered Tasks

1. **Update `allowed_ops.json`** with real commands mapped to the agent-kit stack
2. **Update `env_state.json`** with `project_type: "agent-kit"` and correct stacks
3. **Update `provision.sh`** — add agent-kit detection branch
4. **Add `"agent-kit"` to `config/project-types.json`**
5. **Verify consistency**: validate JSON, execute validate-kit.sh, verify token resolution

## Verification Points
- Post Steps 1-2: files contain real data, not placeholders
- Post Step 3: provision.sh recognizes agent-kit type
- Post Step 5: validate-kit.sh passes without errors
