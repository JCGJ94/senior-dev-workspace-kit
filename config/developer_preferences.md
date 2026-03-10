# Developer Preferences

## Purpose
This file centralizes behavioral preferences for the AI agent regarding proactivity, meta-system design, and interaction modes, decoupled from strict technical capabilities.

## Meta-Preferences
- **Proactive Skill Extraction**: [ENABLED] "The agent should proactively suggest converting newly discovered complex workflows (e.g., config pipelines, deployment fixes) into reusable skills in the repository."
- **Skill Creation Authority**: [SUGGEST-ONLY] "The agent must propose the new `SKILL.md` structure to the developer and wait for confirmation before mutating the `skills_registry` or writing to the `/skills` folder."

## Application
- The agent must read this file when performing large feature delivery or resolving complex bugs to determine if a new skill extraction should be proposed.
- If `[ENABLED]`, wrap up successful complex problem-solving by asking: *"I noticed we just solved a complex X flow. Would you like me to use the `skill-creator` to save this as a permanent repository skill?"*
