# Gestion y creacion de skills

## Estructura local

Cada skill vive en `skills/<skill-name>/SKILL.md`.

Subcarpetas opcionales:

- `scripts/`
- `resources/`

## Registro

Escribir una skill define la capacidad. Registrarla define como el kit la descubre y activa.

Actualiza estos archivos del kit fuente cuando anadas o adaptes una skill:

1. `registry/skill_manifest.json`
2. `registry/preferred_skills.md`
3. `registry/skill_activation_rules.md`
4. `registry/skill_tiers.md`

## Adquisicion JIT

Si falta una skill, el orden de busqueda es:

1. kit o runtime local
2. `https://skills.sh/`
3. `https://agents.md/`
4. `https://github.com/obra/superpowers`

Las skills externas siguen requiriendo:

- aprobacion del developer
- adaptacion al formato y reglas V3
- regeneracion del registro

## Validacion

```bash
bash scripts/validate-skills.sh
```

Usa `scripts/generate-registry.sh` despues de instalar o adaptar skills en el runtime.
