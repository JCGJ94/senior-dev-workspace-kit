# Skills Activation Protocol (v2.1)

## 🎯 Objective
Ensure efficient context usage through selective loading of skills based on the lightweight registry.

## ⚖️ Context Budget & Progressive Unloading (Descarga Progresiva)
- **Total Limit**: Do not load more than 5,000 tokens of skills simultaneously.
- **Domain Limit**: Maximum of 2 active stack skills (e.g., do not load both Python and Node skills if not necessary).
- **Context Purge**: When transitioning between task phases (e.g., from UI implementation to Backend testing), the agent MUST explicitly close/forget non-relevant files from its context window, keeping the workspace lean and preventing hallucination loops.

## 🔄 Resolution Process
1. **Consult Registry**: Read `.agent/registry/skills.json`.
2. **Trigger Match**: If the trigger matches the current task or file extension, mark the skill as a "Candidate".
3. **Budget Validation**: Sum the `context_cost` of the candidates. If it exceeds the limit, prioritize Tier 1 and Tier 2.
4. **Dynamic Loading**: Read the file at `path` only for the selected skills.

## ⚙️ Command Resolution [OP_*]
Whenever a workflow or skill mentions an `[OP_TYPE]` token, the agent MUST:
1. Read `.agent/state/commands.json`.
2. Extract the actual command mapped to the token.
3. Execute the mapped command.
4. If the token does not exist, propose a resolution based on the stack detected in `env_state.json`.

