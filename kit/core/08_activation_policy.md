# Skills Activation Policy

## Purpose
Control the secure and progressive loading of specialized skills (`/skills/*`) to avoid runtime conflicts and token budget overflow.

## Scope
Workflow phase transitions and skill invocation. (Tier 3 Priority).

## 1. Skill Resolution Protocol
When a specific task demands capabilities beyond the Generalist scope, the agent MUST explicitly consult the capabilities in `/skills/` and activate the appropriate module. 
- Use local skills from the repository first by checking `/registry/`.
- Use installed runtime skills by checking `.agent/registry/skills.json` when operating inside a provisioned project.
- Apply skills contextually (e.g., use `supabase-mcp` specifically for Database Auth/Row Level Security, or `browser-use` strictly for external documentation and research).

## 2. Dynamic Limitations (Budgeting)
- **Domain Limit:** Never apply more than 2 distinct framework/stack skills concurrently if they overlap in domain (e.g., do not activate general `javascript` skills while `nextjs-app-router` skills are active).
- **Progressive Unloading:** When a skill is no longer needed for the current workflow phase, drop its operational context immediately.

## 3. Workflow Execution and `[OP_*]` Actions
- When reading pipelines in `/workflows/`, recognize specific generic operational triggers (e.g., `[OP_LINT]`, `[OP_BUILD]`).
- Resolve these tokens via `.agent/state/allowed_ops.json` as the runtime source of truth.
- If a token is missing from `allowed_ops.json`, fail closed and surface the missing mapping explicitly instead of inventing a command.
- Use `00_environment_rules.md` to interpret ecosystem context, but do not bypass `allowed_ops.json` when a mapped operation is expected.

## 4. Anti-Obsolescence & Deep Research Fallback

Usar Context7 cuando se cumplan **todos** estos criterios:
- [ ] La librería o API tiene versión mayor lanzada en los últimos 12 meses (Next.js 15, React 19, Supabase 2+, etc.).
- [ ] El conocimiento local o las reglas de `core/` no cubren el caso específico.
- [ ] La confianza de inferencia sin grounding externo es baja (ambigüedad de sintaxis, cambio de API, deprecación probable).

No usar Context7 cuando:
- La sintaxis es estable y está cubierta por `core/` o `docs/`.
- La duda puede resolverse leyendo el archivo actual del proyecto.

**Protocolo de consulta:**
1. Formular query precisa: nombre de librería + versión + función o comportamiento específico.
2. Consultar Context7 MCP (si está configurado y disponible).
3. Si no está disponible: usar Deep Research (`browser_subagent`) con URL oficial.
4. Registrar en `specs/<change-id>/08-verification.md` sección "Context7 or External Grounding Used".

Si la consulta resuelve una ambigüedad crítica, no continuar sin haberla registrado.

## 5. JIT Skill Installation Protocol (Just-In-Time)
If a task requires specialized knowledge or a workflow that is NOT currently installed in the agent's `/registry/` or `/skills/`, the agent MUST:
1. **Search Local First:** Check the source kit registry and the installed runtime registry before looking outside the repository.
2. **Search Trusted Sources:** If the capability is still missing, search trusted sources in this order: `https://skills.sh/`, `https://agents.md/`, and `https://github.com/obra/superpowers`.
3. **Request Approval:** Before adopting an external skill, summarize the source, why it is needed, and how it will affect the runtime. Wait for developer approval.
4. **Standardize (Skill Creator):** If approval is granted, use `skill-creator` to adapt the external capability into the native `SKILL.md` format before inserting it into `.agent/skills/<skill-name>/` or the source kit.
5. **Re-generate Registry:** After installing or adapting any skill, execute `bash scripts/generate-registry.sh` to update `skills.json` and make the new capability available.
6. **Post-Install Verification:** Re-run trigger matching against the updated registry and verify the newly installed skill is now selectable for the active task.
7. **Track Trust State:** Mark the skill internally as local, trusted-upstream-adapted, or pending-review. Never treat arbitrary external content as first-class without adaptation.

## 6. Communication Layer
- Use `humanized-communication` for developer-facing explanations, summaries, and guidance when a softer human tone improves clarity.
- Do not let communication skills weaken safety, verification, or formal repository artifacts.
