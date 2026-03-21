# ¿Por qué Pedrito?

Hay docenas de herramientas de codificación con IA. Esta página explica qué es Pedrito realmente, qué no es, y por qué la diferencia importa para equipos que necesitan asistencia de IA confiable, auditable y gobernada por el developer.

---

## El problema con la mayoría de herramientas de IA para código

La mayoría de los asistentes de codificación con IA están diseñados para el desarrollador individual en el momento. Están optimizados para autocompletado rápido, respuestas de chat inmediatas y productividad en sesión única. Eso es útil. También es insuficiente para trabajo de ingeniería serio.

Las brechas que se acumulan:

- **Sin memoria.** Cada sesión empieza desde cero. La IA no conoce tus decisiones de arquitectura, las convenciones de tu equipo, ni lo que salió mal el sprint pasado.
- **Sin gobernanza.** La IA actúa y tú reaccionas. No hay gates de aprobación, no hay artefactos de spec, no hay trazabilidad.
- **Sin especialización.** Un modelo generalista intenta debuggear, documentar, revisar y arquitectar simultáneamente. El contexto colapsa.
- **Alucinaciones con APIs actuales.** El modelo fue entrenado hace meses. Usa con confianza métodos obsoletos.
- **Vendor lock-in.** Tu workflow vive dentro de un producto (Copilot, Cursor, Devin) que no controlas.

Pedrito está construido sobre un modelo diferente.

---

## Pedrito vs. GitHub Copilot

| | GitHub Copilot | Pedrito |
|---|---|---|
| **Función principal** | Autocompletado inline + chat | Automatización de workflows multi-agente |
| **Memoria** | Ninguna — se resetea cada sesión | Engram: memoria durable entre sesiones |
| **Especialización** | Un asistente generalista | 7 modos de agente especializados |
| **Gobernanza** | Ninguna | Gates de aprobación, ciclo SDD, tokens OP_* |
| **Trazabilidad** | Ninguna | Artefactos de spec auditables en `specs/` |
| **Precisión de APIs** | Corte de entrenamiento | Tiempo real via Context7 |
| **Dependencia LLM/IDE** | Ecosistema GitHub + VSCode | Agnóstico de LLM/IDE |
| **Conciencia arquitectónica** | Ninguna | Lee decisiones Engram, detecta deriva |
| **Corre en tu repo** | No — producto en la nube | Sí — `.agent/` vive en tu proyecto |

**Cuándo gana Copilot:** Autocompletado rápido y sugerencias inline mientras escribes. Es un atajo de teclado, no un sistema de workflow.

**Cuándo gana Pedrito:** Necesitas que la IA entienda el historial de tu proyecto, siga una spec, produzca trabajo auditable y no rompa cosas sin tu aprobación.

---

## Pedrito vs. Cursor

| | Cursor | Pedrito |
|---|---|---|
| **Función principal** | IDE nativo de IA con chat y edición | Sistema de agentes provisionado en cualquier proyecto |
| **Memoria** | Limitada — archivo de reglas del proyecto | Engram: memoria tipada (decisiones, patrones, incidentes, dominios) |
| **Especialización** | Generalista | 7 modos especializados + descubrimiento JIT de skills |
| **Gobernanza** | Manual — tú revisas los diffs | Ciclo SDD con gates de aprobación explícitos |
| **Dependencia de IDE** | Solo Cursor IDE | Cualquier IDE — Claude Code, Gemini CLI, etc. |
| **Automatización de workflows** | Ediciones de turno único | Workflows orquestados multi-fase |
| **Artefactos de spec** | Ninguno | Artefactos SDD auditables por cambio |
| **Security gates** | Ninguno | `security-reviewer` + tokens de autorización OP_* |

**Cuándo gana Cursor:** Ediciones y refactors de turno único rápidos y fluidos en una experiencia de IDE pulida. Excelente UX para desarrolladores individuales.

**Cuándo gana Pedrito:** Workflows multi-paso, entornos de equipo donde las decisiones necesitan documentarse, o cualquier contexto donde "la IA lo hizo" no es una respuesta aceptable.

---

## Pedrito vs. Devin

| | Devin | Pedrito |
|---|---|---|
| **Función principal** | Agente de software completamente autónomo | Sistema de agentes gobernado — el developer mantiene el control |
| **Modelo de autonomía** | Alta autonomía, bajo control del developer | Autonomía conducida por el dev con gates de aprobación obligatorios |
| **Transparencia** | Caja negra — ves los resultados | Visibilidad total — artefactos de spec, log de decisiones, Engram |
| **Decisiones arquitectónicas** | Tomadas autónomamente | Requieren aprobación explícita del developer |
| **Memoria** | Alcance de sesión | Entre sesiones, tipada, vinculada a evidencia |
| **Modelo de costo** | Por tarea, costoso | Self-hosted, corre en tu suscripción de LLM |
| **Gates de deployment** | Ninguno | `deploy-orchestrator` + aprobación requerida |
| **Trazabilidad** | Ninguna | Artefactos de spec SDD, decisiones Engram |
| **Recuperación** | Opaca | Memoria de incidentes en Engram, regresiones trazables |

**Cuándo gana Devin:** Quieres delegar una tarea completamente y no necesitas entender cómo fue hecha.

**Cuándo gana Pedrito:** Necesitas que el trabajo sea correcto y explicable. Tú eres el arquitecto. Pedrito es tu ejecutor de élite — no toma decisiones arquitectónicas sin tu visto bueno.

---

## La diferencia central: gobernanza

La distinción fundamental no es capacidad — es control.

Cualquier herramienta de IA para código puede escribir código. La pregunta es: **¿quién es responsable de él?**

La respuesta de Pedrito siempre es: el developer.

Esto se hace cumplir estructuralmente:

- **Tokens OP_*** — las operaciones requieren tokens de autorización. Las acciones destructivas o irreversibles están bloqueadas detrás de gates.
- **Ciclo SDD** — los cambios no triviales siguen un proceso de spec de 9 fases. El developer revisa y aprueba la spec antes de que comience la implementación.
- **Memoria Engram** — las decisiones se registran y cruzan referencias. La IA no puede derivar de la arquitectura acordada sin ser detectada.
- **Verification gates** — ningún cambio sale sin un pase de verificación. El agente no puede auto-certificarse.
- **Aprobación de skills JIT** — las nuevas capacidades de registros externos requieren autorización explícita del developer antes de activarse.

Esto no es burocracia. Es la diferencia entre una herramienta que te asiste y un sistema que te reemplaza.

---

## Lo que Pedrito no es

- **No es un IDE.** Pedrito es un sistema de agentes que corre dentro de tu proyecto. Usa el editor que prefieras.
- **No es un modelo.** Pedrito es agnóstico de LLM. Corre sobre Claude, Gemini, o cualquier modelo compatible via el CLI respectivo.
- **No es un SaaS.** Pedrito vive en tu repo. No hay servicio en la nube, no hay datos saliendo de tu entorno sin tu conocimiento.
- **No es un reemplazo para un ingeniero senior.** Pedrito amplifica el juicio de ingeniería senior. No lo sustituye.

---

## Resumen

| Necesidad | Mejor opción |
|-----------|-------------|
| Autocompletado rápido mientras escribes | GitHub Copilot |
| Ediciones de turno único fluidas en un IDE pulido | Cursor |
| Delegación de tareas completamente autónoma | Devin |
| Automatización de workflows multi-agente gobernada y auditable | **Pedrito** |
| Memoria entre sesiones y proyectos | **Pedrito** |
| Sistema de agentes agnóstico de LLM/IDE en tu repo | **Pedrito** |
| Trabajo dirigido por specs con gates de aprobación | **Pedrito** |
