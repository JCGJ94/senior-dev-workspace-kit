# Archive

## Outcome
Operational runtime. `allowed_ops.json` and `env_state.json` reflect the reality of the repo. `provision.sh` can detect and configure `agent-kit` type projects.

## Engram Promotion Candidates
- **Decision: project_type "agent-kit"**: an agent toolkit repo is not "generic" — it has its own structure and operations
- **Mapping OP_* → real commands**: reusable pattern for any project where the agent needs to resolve operations

## Follow-Up Work
- Consider dedicated `scripts/refresh-state.sh` to regenerate only state without full re-provisioning
- Evaluate if `validate-skills.py` needs an update to validate the new `project_type`
- Implement cross-platform detection (Windows + Mac)
