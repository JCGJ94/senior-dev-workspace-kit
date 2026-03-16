# Resumen de arquitectura

## Contrato V3

- `AGENTS.md` es el contrato operativo del runtime.
- `core/`, `registry/`, `skills/` y `workflows/` son assets fuente del kit.
- `.agent/` es el runtime instalado dentro del proyecto del developer.

## Kit fuente frente a runtime

El kit fuente vive en este repositorio para poder versionarse, validarse y distribuirse por GitHub.

El runtime es lo que se instala dentro del proyecto objetivo:

- `.agent/core/`
- `.agent/registry/`
- `.agent/skills/`
- `.agent/workflows/`
- `.agent/state/`

## Capas de soporte

- `docs/engram/` - memoria duradera
- `specs/` - artefactos auditables para trabajo no trivial
- `scripts/` - utilidades de instalacion, sincronizacion y validacion

## Objetivos de diseno

- baja complejidad de integracion para forks en GitHub
- autonomia gobernada con puertas de aprobacion
- disciplina de contexto de bajo consumo
- workflows y skills reutilizables
- un tono humano, calmado y claro para el developer
