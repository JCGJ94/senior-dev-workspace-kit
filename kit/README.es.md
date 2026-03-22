<div align="center">
  <img src="assets/hero.svg" alt="Pedrito - AI Agent System for Developer Workflow Automation" width="800" />
</div>

[English](README.md) | **Español**

**Pedrito** es un **Sistema de Agentes IA para Automatización de Workflows de Desarrollo**. Analiza código, depura sistemáticamente, genera documentación, optimiza prompts y orquesta workflows complejos — todo dentro de tu proyecto, con control total del developer y cero alucinaciones.

Un solo comando instala todo. Pedrito corre dentro de tu proyecto con arquitectura V3 completa: SDD, memoria Engram, Context7, MCP y autonomía gobernada.

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

## Modos de Agente

Pedrito incluye modos de agente especializados para los workflows de desarrollo más comunes. Activa lo que necesitas — nada más.

| Modo | Qué hace |
|------|----------|
| **Analizador de Código** | Audita arquitectura, detecta deuda técnica, revisa calidad de código y postura de seguridad |
| **Asistente de Debugging** | Análisis sistemático de causa raíz — rastrea fallos, aísla regresiones, propone fixes verificados |
| **Generador de Documentación** | Produce documentación como código: referencias de API, ADRs, changelogs y guías de onboarding |
| **Optimizador de Prompts** | Refina tus prompts e implementaciones de contexto para mayor precisión, eficiencia en tokens y menos alucinaciones |
| **Orquestador** | Coordina múltiples sub-agentes para resolver workflows complejos de extremo a extremo |
| **Revisor de Código** | Auditorías arquitectónicas con security gates, verificación del historial de commits y control de calidad |
| **Verificador de Tests** | Enforcement de TDD, verification gates y cobertura de regresiones antes de que cualquier cambio salga a producción |

Cada modo activa el conjunto mínimo de skills necesarias — sin bloat, sin ruido.

## ¿Por qué Pedrito?

- **Tú eliges el agente.** Analizador, debugger, generador de docs, orquestador — activa el agente correcto para cada tarea.
- **Memoria que sobrevive sesiones.** Engram recuerda decisiones, patrones e incidentes durante semanas. El contexto de tu proyecto nunca se pierde.
- **Autonomía gobernada.** No es una caja negra. Tú apruebas cambios arquitectónicos, skills externas y operaciones destructivas.
- **Trabajo dirigido por specs.** Todo cambio no trivial produce artefactos auditables que puedes revisar, rechazar o archivar.
- **Sin alucinaciones por diseño.** Context7 alimenta documentación de librerías en tiempo real. La disciplina low-context corta el ruido en la fuente.
- **Capacidades JIT.** ¿Falta una skill? Pedrito la descubre e instala desde registros confiables — con tu aprobación.
- **Agnóstico de LLM/IDE.** Funciona con cualquier modelo y cualquier editor. El sistema de agentes vive en tu proyecto, no en la nube de un vendor.

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

- [docs/es/00_agent_modes.md](docs/es/00_agent_modes.md)
- [docs/es/01_why_pedrito.md](docs/es/01_why_pedrito.md)
- [docs/es/02_architecture.md](docs/es/02_architecture.md)
- [docs/es/03_skills_management.md](docs/es/03_skills_management.md)
- [docs/es/04_subagent_arquitectura_v3.md](docs/es/04_subagent_arquitectura_v3.md)
- [docs/es/release-process.md](docs/es/release-process.md)
- [docs/engram/index.md](docs/engram/index.md)

Diseñado para ingeniería asistida por IA precisa, sin ruido y gobernada por el developer.
