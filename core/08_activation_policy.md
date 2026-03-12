# Skills Activation Policy

## Purpose
Control the secure and progressive loading of specialized skills (`/skills/*`) to avoid runtime conflicts and token budget overflow.

## Scope
Workflow phase transitions and skill invocation. (Tier 3 Priority).

## 1. Skill Resolution Protocol
When a specific task demands capabilities beyond the Generalist scope, the agent MUST explicitly consult the capabilities in `/skills/` and activate the appropriate module. 
- Use local skills from the repository first by checking `/registry/`.
- Apply skills contextually (e.g., use `supabase-mcp` specifically for Database Auth/Row Level Security, or `browser-use` strictly for external documentation and research).

## 2. Dynamic Limitations (Budgeting)
- **Domain Limit:** Never apply more than 2 distinct framework/stack skills concurrently if they overlap in domain (e.g., do not activate general `javascript` skills while `nextjs-app-router` skills are active).
- **Progressive Unloading:** When a skill is no longer needed for the current workflow phase, drop its operational context immediately.

## 3. Workflow Execution and `[OP_*]` Actions
- When reading pipelines in `/workflows/`, recognize specific generic operational triggers (e.g., `[OP_LINT]`, `[OP_BUILD]`).
- Resolve these tokens by mapping them dynamically to the current ecosystem detected by `00_environment_rules.md` (e.g., `[OP_LINT]` in a Node project maps to `npm run lint` or `bun lint`).

## 4. Anti-Obsolescence & Deep Research Fallback
As per Elite Core context, if local knowledge or standard skills are insufficient to solve modern API issues (e.g., React 19 / Next 16 errors), the agent MUST explicitly fallback to:
1. Context7 MCP (if configured and available for code snippets).
2. Deep Research (`browser_subagent`) to fetch the exact 2026 real-time documentation.

## 5. JIT Skill Installation Protocol (Just-In-Time)
If a task requires specialized knowledge or a workflow that is NOT currently installed in the agent's `/registry/` or `/skills/`, the agent MUST:
1. **Search Upstream (Mother Repo):** Check the AI Engineering Workspace Kit's global repository for the required skill. If found, pull it into `.agent/skills/`.
2. **Search External Integrations (Fallback):** If the skill does not exist in the mother repo, search open community catalogs like `https://skills.sh/` or `superpowers`.
3. **Standardize (Skill Creator):** If a skill is fetched from an external source (like `skills.sh`), the agent MUST use the `skill-creator` to refactor and adapt the external skill to comply with the project's native standard (`SKILL.md` format, specific YAML frontmatter) before inserting it into the local ecosystem.
4. **Re-generate Registry:** After installing or adapting any skill, execute `bash scripts/generate-registry.sh` to update `skills.json` and make the new capability globally available.
