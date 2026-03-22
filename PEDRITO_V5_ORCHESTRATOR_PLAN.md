# Pedrito V5 — Plan de Orquestación con Dispatch Real

**Fecha:** 2026-03-22
**Referencia:** [Gentleman-Programming/gentle-ai](https://github.com/Gentleman-Programming/gentle-ai) (Agent Teams Lite)
**Estado:** Implementado

---

## Resumen Ejecutivo

Pedrito V4 tiene toda la infraestructura (Engram, GGA, 43 skills, CI/CD, Homebrew), pero el orquestador NO delega realmente. Gentleman resolvió esto con un modelo simple y brutal: **el orquestador NUNCA toca código — solo clasifica, delega, y sintetiza**.

Este plan alinea Pedrito con ese modelo, manteniendo las ventajas que ya tenemos (43 skills, tiers, activation rules, JIT creation, OP tokens, workflows) y corrigiendo lo que nos falta.

---

## Análisis Comparativo: Gentleman vs Pedrito

### Lo que Gentleman tiene y nosotros NO

| Gentleman | Pedrito hoy | Impacto |
|-----------|-------------|---------|
| **Hard Stop Rule**: orquestador NUNCA lee/edita código | Core rules sugieren pero no imponen | El orquestador se contamina con contexto de ejecución |
| **Delegate-first**: prefiere async sobre sync | No tiene concepto async vs sync | Todo es bloqueante, desperdicia tiempo |
| **Skill Pre-Resolution**: resuelve paths 1 vez por sesión | Registry existe pero no se pre-resuelve | Cada sub-agente busca el registry, gasta tokens |
| **Sub-Agent Context Protocol**: orquestador controla qué ve cada sub-agente | No hay protocolo | Sub-agentes reciben demasiado o muy poco contexto |
| **Return Envelope**: `{status, summary, artifacts, next, risks}` | Skills no tienen contrato de retorno | Orquestador no puede verificar resultados programáticamente |
| **State Recovery**: DAG state en Engram para recovery post-compaction | No hay state recovery | Después de compaction se pierde el progreso |
| **Engram Loop en dispatch**: orquestador busca antes, sub-agente guarda después | Engram existe pero es manual | Conocimiento no fluye entre sesiones |

### Lo que Pedrito tiene y Gentleman NO

| Pedrito ventaja | Por qué importa |
|----------------|-----------------|
| **43 skills** (vs 11) | Más coverage: debugging, backend, frontend, TDD, security, deploy |
| **Tier system** (0-4 + Meta) | Prioridad clara entre skills |
| **19 activation rules** | Reglas sofisticadas de cuándo activar qué |
| **Context budget** (max 5000 tokens, max 7 skills) | Control de token usage por skill |
| **JIT skill creation** (skill-creator + skill-manager + fallback chain) | Si falta skill, la crea on-the-fly |
| **[OP_*] tokens** resolvibles por ecosistema | Operaciones portables |
| **Workflow templates** (deploy con 5 stages) | Flujos estandarizados |
| **GGA multi-provider** | Pre-commit con más providers |
| **4 modos de comunicación** (cubano, colombiano, neutro-latam, inglés) | Más opciones de persona |

### Estrategia de contexto: Gentleman vs Pedrito

Gentleman NO comprime contexto — usa un orquestador **thin** que delega todo el trabajo pesado. El contexto se mantiene pequeño porque:
1. El orquestador nunca lee código (no llena su contexto con archivos)
2. Cada sub-agente tiene contexto fresco y acotado
3. Solo se pasan resúmenes ejecutivos entre fases, no contenido crudo

**Decisión**: Eliminar la dependencia en context-distiller/context-optimizer como mecanismo principal. En su lugar, adoptar el modelo de Gentleman: **contexto thin por diseño, no por compresión**. Las skills de context se mantienen para casos edge pero NO son el mecanismo primario.

---

## Fases de Implementación

### Fase 1: Runtime State (Fundación)

**Archivos a crear:**

#### 1A. `.agent/state/allowed_ops.json`

Referenciado por AGENTS.md y todos los workflows pero no existe. Sin él, todo `[OP_*]` falla silenciosamente.

```json
{
  "OP_INSTALL": "bun install",
  "OP_TEST": "bun test",
  "OP_TYPECHECK": "bun run typecheck",
  "OP_LINT": "bun run lint",
  "OP_BUILD": "bun run build",
  "OP_DEPLOY": "echo 'Deploy not configured — see workflows/deploy_workflow.md'",
  "OP_VALIDATE_KIT": "bash kit/scripts/validate-kit.sh",
  "OP_VALIDATE_SKILLS": "python kit/scripts/validate-skills.py",
  "OP_GENERATE_REGISTRY": "bash kit/scripts/generate-registry.sh"
}
```

**Verificación:** `python3 -m json.tool .agent/state/allowed_ops.json`

---

### Fase 2: Contratos Compartidos (_shared)

**Archivos a crear en `kit/skills/_shared/`:**

#### 2A. `kit/skills/_shared/return-envelope.md`

Contrato de retorno estandarizado para TODOS los sub-agentes. Equivalente al `sdd-phase-common.md` de Gentleman.

Contenido:
- Formato obligatorio de retorno: `{status, executive_summary, artifacts, next_recommended, risks}`
- Regla de skill loading: el orquestador pasa el path, el sub-agente lo carga
- Sub-agentes NO buscan el registry

#### 2B. `kit/skills/_shared/engram-protocol.md`

Protocolo Engram para sub-agentes. Equivalente al `engram-convention.md` + `persistence-contract.md` de Gentleman.

Contenido:
- **Lectura**: el orquestador lee Engram y pasa resumen en el prompt
- **Escritura**: el sub-agente guarda descubrimientos/decisiones ANTES de retornar
- **SDD artifacts**: topic keys determinísticos (`sdd/{change-name}/{artifact-type}`)
- **Degradación graceful**: si Engram server no disponible → docs/engram/ file-based

**Verificación:** Ambos archivos existen y contienen las secciones definidas.

---

### Fase 3: Protocolo de Orquestación (El Corazón)

**Archivo a crear:**

#### 3A. `kit/core/10_orchestrator_protocol.md`

Core rule nuevo (Tier 0). El archivo más importante de todo el plan. Define:

1. **Hard Stop Rule** — el orquestador NUNCA ejecuta código. Zero excepciones.
2. **Delegation Rules** — tabla de qué está permitido y qué no.
3. **Task Classification Gate** — direct / small / orchestrated / parallel.
4. **Skill Pre-Resolution** — leer registry una vez, cachear paths, pasar pre-resueltos.
5. **Engram Context Loop** — buscar antes de dispatch, sub-agente guarda después.
6. **Sub-Agent Dispatch Template** — prompt structure exacto con: ROLE, SKILL, CONTEXT, GOAL, SCOPE, NON-GOALS, OUTPUT (return envelope), VERIFICATION, PERSISTENCE.
7. **Result Verification** — check status, run verification command, never integrate sin verificar.
8. **State Persistence** — guardar DAG state en Engram para recovery post-compaction.
9. **[OP_*] Token Resolution** — resolver via allowed_ops.json con fallback.
10. **Anti-Patterns** — lista explícita de lo que el orquestador NUNCA hace.

**Verificación:** `grep -c "Hard Stop\|COORDINATOR\|delegate\|dispatch" kit/core/10_orchestrator_protocol.md` → múltiples hits.

---

### Fase 4: Actualizar Core Rules Existentes

**Archivos a modificar:**

#### 4A. `kit/core/01_core_rules.md`

- **Línea 10**: Cambiar identidad de "elite senior software engineer" a "COORDINATOR, not an executor" que referencia `10_orchestrator_protocol.md`
- **Líneas 20-22**: Reescribir "Skill Orchestration" para incluir pre-resolución de skills y referencia al protocolo

#### 4B. `kit/core/03_development_super_rule.md`

- **Sección 5** (líneas 30-33): Cambiar "Escalation & Modularity" a "Orchestrated Dispatch (MANDATORY)" — todo código DEBE ser delegado, referencia al protocolo

#### 4C. `kit/core/06_memory_rules.md`

- Agregar sección "Engram Server Integration" con el lifecycle: session start → before dispatch → sub-agent writes → state recovery

#### 4D. `kit/core/08_activation_policy.md`

- **Sección 3**: Concretar resolución de [OP_*] con referencia a `allowed_ops.json`
- **Sección 5 JIT**: Agregar post-install verification (re-run trigger matching)

**Verificación:** grep de las referencias clave en cada archivo modificado.

---

### Fase 5: Actualizar Runtime Contract

**Archivo a modificar:**

#### 5A. `kit/AGENTS.md`

Agregar nueva sección "🎯 Orchestration Protocol" después de "Memory & Context":
- Coordinator, not executor → referencia a `10_orchestrator_protocol.md`
- Skill Pre-Resolution
- Dispatch Contract con return envelope
- Engram Loop
- JIT Protocol
- OP Resolution

**Verificación:** `grep "Orchestration Protocol" kit/AGENTS.md`

---

### Fase 6: Actualizar Skill del Orquestador

**Archivo a modificar:**

#### 6A. `kit/skills/architect-orchestrator-v3/SKILL.md`

Reescribir "Orchestration Workflow" (líneas 47-82) de descriptivo a **imperativo**:
1. Intake & Classification con output estructurado
2. Skill Resolution desde session cache
3. Engram Context Pack
4. Dispatch Template (referencia `10_orchestrator_protocol.md` sección 6)
5. Result Verification con return envelope
6. Integration con `[OP_TEST]` + `[OP_TYPECHECK]`
7. State Persistence en Engram
8. Knowledge Promotion

Agregar sección "Automatic Skill Resolution Protocol" con algoritmo de trigger matching.

**Verificación:** `grep -c "dispatch\|Agent tool\|return envelope" kit/skills/architect-orchestrator-v3/SKILL.md`

---

### Fase 7: Sistema de Personas (4 modos)

**Archivos a crear/modificar:**

#### 7A. CREAR `kit/config/personas/pedrito-cubano.md`

Persona cubana pura: "oye", "dale", "tranquilo", "está brutal", "asere" (esporádico), tuteo caribeño.

#### 7B. CREAR `kit/config/personas/pedrito-colombiano.md`

Persona colombiana pura: "parcero", "bacano", "qué más", "venga", "listo", tuteo colombiano.

#### 7C. RENOMBRAR/ACTUALIZAR `kit/config/personas/pedrito-mode.md` → selección default

Actualizar para que sea un wrapper que indica cuál de los 4 modos está activo, o eliminar y dejar los 4 como opciones directas.

#### 7D. Actualizar `kit/config/personas/README.md`

Tabla actualizada con 4 opciones:
| Persona | Descripción |
|---------|-------------|
| `pedrito-cubano` | Senior Architect mentor, acento cubano caribeño |
| `pedrito-colombiano` | Senior Architect mentor, acento colombiano |
| `pedrito-neutral-latam` | Senior Architect mentor, español neutro sin regionalismos |
| `neutral-mode` | Sin personalidad, inglés profesional |

#### 7E. Actualizar `packages/installer/src/cli.ts` showHelp()

Listar las 4 personas:
```
Personas:
  pedrito-cubano            Cuban Caribbean mentor (default)
  pedrito-colombiano        Colombian mentor
  pedrito-neutral-latam     Neutral Latin American mentor
  neutral-mode              No personality overlay
```

#### 7F. Actualizar `kit/docs/engram/decisions/001-pedrito-identity.md`

Reflejar los 4 modos de comunicación.

**Verificación:** Los 4 archivos de persona existen. CLI help muestra los 4 modos.

---

## Resumen de Archivos

### Crear (6 archivos nuevos)
| Archivo | Fase |
|---------|------|
| `.agent/state/allowed_ops.json` | 1 |
| `kit/skills/_shared/return-envelope.md` | 2 |
| `kit/skills/_shared/engram-protocol.md` | 2 |
| `kit/core/10_orchestrator_protocol.md` | 3 |
| `kit/config/personas/pedrito-cubano.md` | 7 |
| `kit/config/personas/pedrito-colombiano.md` | 7 |

### Modificar (9 archivos)
| Archivo | Fase |
|---------|------|
| `kit/core/01_core_rules.md` | 4 |
| `kit/core/03_development_super_rule.md` | 4 |
| `kit/core/06_memory_rules.md` | 4 |
| `kit/core/08_activation_policy.md` | 4 |
| `kit/AGENTS.md` | 5 |
| `kit/skills/architect-orchestrator-v3/SKILL.md` | 6 |
| `kit/config/personas/pedrito-mode.md` | 7 |
| `kit/config/personas/README.md` | 7 |
| `packages/installer/src/cli.ts` | 7 |

### No tocar
- Engram server code (API ya soporta todo)
- GGA code
- Installer core logic
- Tests existentes
- Build/release pipeline

---

## Verificación Final

```bash
# Fase 1
python3 -m json.tool .agent/state/allowed_ops.json

# Fase 2
cat kit/skills/_shared/return-envelope.md
cat kit/skills/_shared/engram-protocol.md

# Fase 3
grep -c "Hard Stop\|COORDINATOR\|delegate" kit/core/10_orchestrator_protocol.md

# Fase 4
grep "10_orchestrator_protocol" kit/core/01_core_rules.md
grep "delegate\|MUST" kit/core/03_development_super_rule.md
grep "Engram Server" kit/core/06_memory_rules.md
grep "allowed_ops" kit/core/08_activation_policy.md

# Fase 5
grep "Orchestration Protocol" kit/AGENTS.md

# Fase 6
grep -c "dispatch\|envelope" kit/skills/architect-orchestrator-v3/SKILL.md

# Fase 7
ls kit/config/personas/pedrito-cubano.md
ls kit/config/personas/pedrito-colombiano.md
bun run packages/installer/src/cli.ts --help | grep -A5 "Personas"

# Regresión
bun test
bun run typecheck
bash kit/scripts/validate-kit.sh
```

---

## Post-Implementación: Ventajas Pedrito sobre Gentleman

| Área | Pedrito V5 | Gentleman |
|------|-----------|-----------|
| **Dispatch** | Mismo delegate-first + budget system | Delegate-first sin budget |
| **Skills** | 43 skills con tiers | 11 skills sin tiers |
| **Context** | Thin por diseño (no compresión) + budget | Thin por diseño |
| **Activation** | 19 reglas sofisticadas | Sin reglas |
| **JIT** | skill-creator + skill-manager + fallback chain | Solo skill-creator |
| **OP tokens** | allowed_ops.json resolvible | No tiene |
| **Personas** | 4 modos (cubano, colombiano, neutro, inglés) | 2 modos |
| **Workflows** | Templates de deploy con 5 stages | No tiene |
| **Pre-commit** | GGA multi-provider | GGA básico |
| **Memory** | Engram server (SQLite+FTS5+REST+MCP) + file fallback | Engram MCP |
