# Primeros pasos

## Instalacion

Clona el repositorio e inicializa un proyecto objetivo desde su raiz:

```bash
git clone <repo> ai-engineering-workspace-kit
cd /ruta/al/proyecto-objetivo
bash ../ai-engineering-workspace-kit/scripts/agent init
```

Esto crea `.agent/` dentro del proyecto objetivo.
El comando `init` es no interactivo por defecto.

## Scripts principales

- `scripts/agent` - entrada unificada V3
- `scripts/provision.sh` - instala el runtime en un proyecto objetivo
- `scripts/sync-workspace.sh` - refresca un runtime existente
- `scripts/generate-registry.sh` - regenera `.agent/registry/skills.json`
- `scripts/skill-manager.sh` - instala skills confiables en el runtime
- `scripts/validate-kit.sh` - valida el kit fuente
- `scripts/validate-skills.sh` - valida la estructura local de skills
