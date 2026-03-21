# AI Engineering Workspace Kit — Guía de Uso

## Instalación

Clona el kit e inicializa un proyecto objetivo desde su raíz:

```bash
git clone <repo> ai-engineering-workspace-kit
cd /ruta/al/proyecto-objetivo
bash /ruta/al/ai-engineering-workspace-kit/scripts/agent init
```

Esto provisiona `.agent/`, `docs/engram/` y `specs/` dentro del repositorio objetivo. El comando corre en modo no interactivo por defecto.

## Scripts disponibles

| Script | Propósito |
|---|---|
| `scripts/agent` | Punto de entrada V3 unificado (`init`, `sync`, `status`) |
| `scripts/provision.sh` | Instala el runtime en un proyecto objetivo |
| `scripts/sync-workspace.sh` | Actualiza un runtime existente desde el kit fuente |
| `scripts/generate-registry.sh` | Regenera `.agent/registry/skills.json` |
| `scripts/skill-manager.sh` | Instala skills upstream de confianza en el runtime |
| `scripts/validate-kit.sh` | Valida la estructura del kit fuente |
| `scripts/validate-skills.sh` | Valida estructura y frontmatter de skills |
| `scripts/validate-skills.py` | Verificación completa de metadatos de skills |

## Sincronizar un runtime existente

```bash
bash /ruta/al/ai-engineering-workspace-kit/scripts/agent sync
```

Actualiza el runtime desde el kit fuente sin tocar el Engram ni los specs activos.

## Reglas de operación

- `AGENTS.md` es el contrato de runtime — Pedrito lo lee al inicio de cada sesión.
- `.agent/core/` contiene el conjunto de reglas instaladas que gobiernan el comportamiento.
- `docs/engram/` almacena la memoria durable entre sesiones (decisiones, patrones, lecciones).
- `specs/` almacena los artefactos de trabajo no trivial (ciclo de vida SDD de 9 fases).
- El agente mantiene el contexto ajustado y activa el mínimo de skills necesarios.
- Los tokens `[OP_*]` se resuelven via `.agent/state/allowed_ops.json`.

## Modelo de aprobación

**Autónomo:** análisis, planificación, resúmenes, cambios reversibles de bajo riesgo.

**Requiere aprobación del desarrollador:** cambios de arquitectura, adopción de skills externos, cambios de dependencias, operaciones destructivas de archivos, y cualquier acción relacionada con seguridad, deploy o datos sensibles.

## Skills JIT

Cuando falta un skill en el runtime, el orden de búsqueda de confianza es:

1. Skills del kit local o runtime instalado
2. `https://skills.sh/`
3. `https://agents.md/`
4. `https://github.com/obra/superpowers`

Los skills externos requieren aprobación explícita y adaptación V3 (frontmatter + entrada en registry) antes de activarse.

## Trabajo no trivial (SDD)

Cualquier cambio que toque más de 3 archivos, modifique comportamiento, involucre seguridad o deploy, o tome más de 30 minutos **debe** seguir el ciclo de vida SDD via `specs/<change-id>/`. Ver `.agent/core/03_development_super_rule.md`.
