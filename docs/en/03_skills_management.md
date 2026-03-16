# Skills management and authoring

## Local skill structure

Every skill lives under `skills/<skill-name>/SKILL.md`.

Optional subfolders:

- `scripts/`
- `resources/`

## Registration

Writing a skill defines the capability. Registering it defines how the kit discovers and activates it.

Update these source-kit files when adding or adapting a skill:

1. `registry/skill_manifest.json`
2. `registry/preferred_skills.md`
3. `registry/skill_activation_rules.md`
4. `registry/skill_tiers.md`

## JIT acquisition

If a skill is missing, search in this order:

1. local kit/runtime
2. `https://skills.sh/`
3. `https://agents.md/`
4. `https://github.com/obra/superpowers`

External skills still require:

- developer approval
- V3 adaptation through local conventions
- registry regeneration

## Validation

```bash
bash scripts/validate-skills.sh
```

Use `scripts/generate-registry.sh` after installing or adapting runtime skills.
