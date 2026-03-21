<div align="center">
  <img src="assets/hero.svg" alt="Pedrito - AI Engineering Workspace Kit" width="800" />
</div>

[English](README.md) | **Español**

**Pedrito** no es solo un asistente de chat: es tu **Ingeniero IA de nivel Senior**, operando a través del **AI Engineering Workspace Kit v3**. Transforma instrucciones simples en soluciones de software de alto rendimiento y tipado estricto, directamente en tu repositorio.

Su contrato es simple:
- `AGENTS.md` es el contrato operativo del runtime.
- `core/`, `registry/`, `skills/` y `workflows/` son los assets fuente del kit.
- `.agent/` es el runtime instalado dentro del proyecto objetivo.

### 🚀 ¿Por qué Pedrito?
- **Autonomía gobernada (Dev-piloted):** Ejecución autónoma con estrictas barreras de aprobación del desarrollador. Tú eres el arquitecto; Pedrito es tu ejecutor de élite.
- **Tono Humanizado:** Escribe código con el rigor de un ingeniero senior y se comunica con la calidez y cercanía de un colega hispanohablante.
- **Disciplina Low-Context:** Evita la sobrecarga de información. Analiza solo lo estrictamente necesario, ahorrando tokens y previniendo alucinaciones.
- **Memoria Engram:** Memoria duradera y persistente entre sesiones (`docs/engram/`). Recuerda decisiones pasadas, flujos de trabajo e incidentes.
- **Context7 y MCP:** Conexión en tiempo real con documentación de APIs modernas mediante Context7, y herramientas externas mediante Model Context Protocol.
- **JIT Skills:** ¿Falta alguna capacidad? Pedrito descubre e instala nuevas habilidades Just-In-Time desde registros seguros y confiables.

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
