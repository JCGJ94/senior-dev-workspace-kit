# Skills Management & Authoring

This kit uses an Antigravity-style agentic workflow. A "Skill" is a modular chunk of instructions, rules, and optional executing logic tailored for specific technical scenarios.

## 1. Directory Structure (`/skills`)
Every skill must live locally in its own directory, following this structure:
```text
skills/
└── skill-name/
    ├── SKILL.md       (Mandatory: rules and metadata)
    ├── scripts/       (Optional: executable files)
    ├── resources/     (Optional: reference assets)
```

**Low-Token Compactness Rule:** Skills must not contain greetings, narrative, or redundant explanations. Every rule must begin with an imperative verb.

## 2. Skills Registry (`/skills_registry`)
Writing a skill only determines the "WHAT". The `skills_registry` determines the "WHEN".
After a skill is drafted, it MUST be registered:
1. `skill_manifest.json`: Core index map for fast agent discovery.
2. `preferred_skills.md`: Categorized inventory to visualize active skills.
3. `skill_activation_rules.md`: Trigger context definitions.
4. `skill_tiers.md`: Complexity ranking (Tier 1 vs. Tier 3 vs. Optional).

## 3. Creating a Skill
Instead of writing it manually, you can ask the agent:
*"Please create a new skill for standardizing Supabase migrations based on what we just did."*

The agent's `skill-creator` capability will securely format and propose the new skill following `templates/_blueprint/SKILL.md`.

## 4. Validating the Architecture
To prevent broken references or detached skills, a strict cross-platform validator is provided. Always run the validation script after modifications:
```bash
bash scripts/validate-skills.sh
```
This ensures manifest synchronization, folder structure integrity, and absence of legacy flat files.
