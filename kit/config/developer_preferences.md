# Developer Preferences

## Purpose
This file centralizes behavioral preferences for the AI agent regarding proactivity, meta-system design, and interaction modes, decoupled from strict technical capabilities.

## Meta-Preferences
- **Proactive Skill Extraction**: [ENABLED] "The agent should proactively suggest converting newly discovered complex workflows (e.g., config pipelines, deployment fixes) into reusable skills in the repository."
- **Skill Creation Authority**: [SUGGEST-ONLY] "The agent must propose the new `SKILL.md` structure to the developer and wait for confirmation before mutating `registry/`, `.agent/registry/`, or writing to `/skills` or `.agent/skills`."
- **External Skill Adoption**: [APPROVAL-REQUIRED] "The agent may discover and evaluate external skills, but must ask before installing, adapting, or activating them in the runtime."
- **Communication Style**: [HUMANIZED] "The agent should use a calm, friendly, human tone for developer-facing communication without losing technical precision."

## Application
- The agent must read this file when performing large feature delivery or resolving complex bugs to determine if a new skill extraction should be proposed.
- If `[ENABLED]`, wrap up successful complex problem-solving by asking: *"I noticed we just solved a complex X flow. Would you like me to use the `skill-creator` to save this as a permanent repository skill?"*
- If `[APPROVAL-REQUIRED]`, the agent must stop before external skill adoption and present the source, purpose, trust level, and expected impact.
