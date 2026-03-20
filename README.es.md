```text
       ___  ____
      / _ \/  _/
     / __ _/ /
    /_/ |_/___/

   A G E N T   K I T   (P E D R I T O)
```

[English](README.md) | **Español**

El **AI Engineering Workspace Kit** es un kit fuente V3 para instalar un runtime de ingeniería asistida por IA (operado por **Pedrito**) dentro de cualquier repositorio.

Su contrato es simple:

- `AGENTS.md` es el contrato operativo del runtime.
- `core/`, `registry/`, `skills/` y `workflows/` son los assets fuente del kit.
- `.agent/` es el runtime instalado dentro del proyecto objetivo.

## Qué aporta

- un runtime V3 coherente en `.agent/`
- autonomía gobernada con aprobación del developer para acciones sensibles
- disciplina de contexto de bajo consumo
- memoria duradera en `docs/engram/`
- ejecución guiada por workflows para trabajo no trivial
- adopción JIT de skills con gobernanza y fuentes confiables
- un tono humano, calmado y claro para comunicarse con el developer

## Inicio rápido

Clona el kit en una ruta estable:

```bash
git clone https://github.com/YOUR_USER/ai-engineering-workspace-kit.git
```

Inicializa un repositorio objetivo:

```bash
cd /ruta/a/tu/proyecto
bash /ruta/al/ai-engineering-workspace-kit/scripts/agent init
```

`init` se ejecuta en modo no interactivo por defecto, asi que el runtime se instala de una sola vez.

Sincroniza un runtime existente tras actualizar el kit:

```bash
bash /ruta/al/ai-engineering-workspace-kit/scripts/agent sync
```

Si quieres usar el selector opcional de skills durante la inicializacion, pasa flags al provisioner:

```bash
bash /ruta/al/ai-engineering-workspace-kit/scripts/agent init --interactive
```

Valida el kit fuente:

```bash
bash /ruta/al/ai-engineering-workspace-kit/scripts/validate-kit.sh
```

## Estructura del runtime

Tras la inicialización, el repositorio objetivo contiene:

- `.agent/core/` - reglas operativas instaladas
- `.agent/registry/` - registro del runtime y `skills.json` generado
- `.agent/skills/` - skills instaladas en el runtime
- `.agent/workflows/` - workflows instalados
- `.agent/state/` - estado generado y operaciones permitidas
- `docs/engram/` - memoria duradera
- `specs/` - artefactos auditables para cambios no triviales

## Modelo de skills

El agente empieza como generalista, mantiene el contexto pequeño y activa el conjunto minimo util de skills.

Si falta una skill, el orden de busqueda confiable es:

1. skills locales del kit o del runtime
2. `https://skills.sh/`
3. `https://agents.md/`
4. `https://github.com/obra/superpowers`

La adopcion de una skill externa sigue requiriendo aprobacion del developer y adaptacion al formato V3.

## Documentacion

- `docs/es/00_guia_de_uso.md`
- `docs/es/01_getting_started.md`
- `docs/es/02_architecture.md`
- `docs/es/03_skills_management.md`
- `docs/engram/index.md`
- `specs/README.md`

Disenado para una ingenieria asistida por IA precisa, legible y gobernada por el developer.
