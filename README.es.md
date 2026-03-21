<div align="center">
  <img src="assets/hero.svg" alt="Pedrito - AI Engineering Workspace Kit" width="800" />
</div>

[English](README.md) | **Español**

**Pedrito** es tu **Ingeniero IA de nivel Senior**, operando a través del **AI Engineering Workspace Kit v3**. Un solo comando instala todo — y Pedrito corre dentro de tu proyecto con arquitectura V3 completa: SDD, memoria Engram, Context7, MCP y autonomía gobernada.

## Instalación

Clona el kit una vez y corre el setup en tu proyecto:

```bash
git clone https://github.com/YOUR_USER/ai-engineering-workspace-kit.git
cd /ruta/a/tu-proyecto
bash /ruta/a/ai-engineering-workspace-kit/setup.sh
```

Eso es todo. El setup instala el kit globalmente, registra el comando `pedrito` en tu shell y provisiona tu proyecto.

Después de recargar tu shell (`source ~/.bashrc` o reiniciar la terminal), usa `pedrito` desde cualquier directorio:

```bash
pedrito init      # provisiona cualquier proyecto
pedrito sync      # sincroniza el runtime tras actualizar el kit
pedrito status    # estado del runtime de un vistazo
pedrito doctor    # health check: SDD · Engram · Context7 · MCP
pedrito validate  # audita skills y estructura del kit
pedrito update    # actualiza el kit
```

## ¿Por qué Pedrito?

- **Autonomía gobernada:** Ejecución autónoma con barreras de aprobación estrictas. Tú eres el arquitecto; Pedrito es tu ejecutor de élite.
- **Tono humanizado:** Código con rigor de ingeniero senior, comunicación con la cercanía de un colega hispano.
- **Disciplina Low-Context:** Analiza solo lo necesario — menos tokens, menos alucinaciones.
- **Memoria Engram:** Memoria duradera entre sesiones (`docs/engram/`). Recuerda decisiones, patrones e incidentes.
- **Context7 y MCP:** Documentación de APIs en tiempo real via Context7. Herramientas externas via Model Context Protocol. Agnóstico de LLM/IDE.
- **SDD:** Todo trabajo no trivial sigue un ciclo de vida de 9 fases (`specs/<change-id>/`).
- **Skills JIT:** ¿Falta una capacidad? Pedrito descubre e instala skills Just-In-Time desde registros confiables.

## Estructura del runtime

Tras `pedrito init`, tu proyecto contiene:

```
.agent/
  core/        reglas instaladas (el cerebro de Pedrito)
  registry/    skills.json — índice de activación JIT
  skills/      skills del runtime instaladas
  workflows/   definiciones de workflows SDD
  state/       env_state.json, allowed_ops.json (tokens OP_*)
docs/engram/   memoria durable (decisiones, patrones, lecciones)
specs/         artefactos SDD auditables para trabajo no trivial
AGENTS.md      contrato del runtime — Pedrito lo lee primero
```

## Modelo de skills

Pedrito arranca como generalista, mantiene el contexto mínimo y activa el conjunto mínimo necesario de skills. Si falta alguna, el orden de búsqueda confiable es:

1. Skills locales del kit o del runtime
2. `https://skills.sh/`
3. `https://agents.md/`
4. `https://github.com/obra/superpowers`

Los skills externos requieren aprobación explícita del dev y adaptación V3 antes de activarse.

## Documentación

- [docs/es/02_architecture.md](docs/es/02_architecture.md)
- [docs/es/03_skills_management.md](docs/es/03_skills_management.md)
- [docs/es/04_subagent_arquitectura_v3.md](docs/es/04_subagent_arquitectura_v3.md)
- [docs/es/release-process.md](docs/es/release-process.md)
- [docs/engram/index.md](docs/engram/index.md)

Diseñado para ingeniería asistida por IA precisa, sin ruido y gobernada por el developer.
