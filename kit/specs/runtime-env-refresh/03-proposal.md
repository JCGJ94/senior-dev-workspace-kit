# Proposal

## Recommended Approach
1. Manually update `allowed_ops.json` and `env_state.json` to reflect the real stack
2. Add `agent-kit` type to `provision.sh` with its detection branch
3. Document refresh procedure

## Alternatives Considered
- **Re-execute `provision.sh`**: discarded because automatic detection has no branch for `agent-kit` — it must be added first
- **Only update state files without touching provision.sh**: discarded because future re-provisions would revert manual changes

## Tradeoffs
- Adding a new project type to `provision.sh` increases its complexity, but is the correct long-term solution
- Detecting `agent-kit` (presence of `AGENTS.md` + `core/` + `skills/`) is simple and doesn't interfere with existing detections
