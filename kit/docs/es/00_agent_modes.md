# Pedrito — Modos de Agente

Pedrito es un orquestador que coordina un sistema multi-agente. Cada modo activa un conjunto especializado de skills calibradas para un problema específico de workflow de desarrollo. Activas lo que necesitas — el resto permanece inactivo para mantener el contexto limpio y el razonamiento preciso.

---

## Resumen

| Modo | Cuándo usarlo | Skills principales activadas |
|------|---------------|------------------------------|
| [Analizador de Código](#analizador-de-código) | Revisiones de arquitectura, auditorías de deuda técnica, postura de seguridad | `code-review-pro`, `architect-orchestrator-v3` |
| [Asistente de Debugging](#asistente-de-debugging) | Cacería de bugs, aislamiento de regresiones, incidentes en producción | `debugging`, `systematic-debugging` |
| [Generador de Documentación](#generador-de-documentación) | Referencias de API, ADRs, changelogs, guías de onboarding | `docs-pro`, `commit-sentinel` |
| [Optimizador de Prompts](#optimizador-de-prompts) | Reducir alucinaciones, mejorar calidad de outputs IA, cortar desperdicio de tokens | `context-keeper`, `context7` |
| [Orquestador](#orquestador) | Workflows multi-paso, ejecución coordinada de agentes, migraciones complejas | `architect-orchestrator-v3`, `sdd-manager` |
| [Revisor de Código](#revisor-de-código) | Revisiones de PR, security gates, enforcement de calidad en commits | `security-reviewer`, `commit-sentinel`, `code-review-pro` |
| [Verificador de Tests](#verificador-de-tests) | Enforcement de TDD, verificación de cobertura, gates de regresión | `test-driven-development`, `test-verifier` |

---

## Analizador de Código

**Problema que resuelve:** Necesitas una lectura objetiva del estado de salud de un codebase — no un linter, no una revisión de estilo, sino una auditoría arquitectónica de nivel senior que saca a la luz lo que realmente importa.

**Qué hace Pedrito:**
- Mapea dependencias entre módulos e identifica puntos de acoplamiento excesivo
- Detecta deriva arquitectónica frente a las decisiones de diseño establecidas
- Señala vulnerabilidades de seguridad y patrones riesgosos (OWASP Top 10, inyección, brechas de autenticación)
- Cuantifica la deuda técnica por área — te da una lista priorizada, no solo un conteo de advertencias
- Cruza los hallazgos con la memoria Engram para distinguir problemas nuevos de trade-offs aceptados y conocidos

**Ejemplo de prompt:**
```
Analiza el módulo de autenticación en cuanto a postura de seguridad y deuda arquitectónica.
Marca todo lo que bloquearía una auditoría SOC 2.
```

**Output que recibes:**
- Hallazgos estructurados ordenados por severidad
- Referencias específicas de archivo/línea
- Ruta de remediación recomendada por hallazgo
- Borrador de spec SDD si la remediación no es trivial

**Skills activadas:** `code-review-pro`, `architect-orchestrator-v3`, `security-reviewer`

---

## Asistente de Debugging

**Problema que resuelve:** Tienes un bug. No sabes dónde vive ni por qué apareció. Necesitas eliminación sistemática, no suposiciones aleatorias.

**Qué hace Pedrito:**
- Aplica un framework de análisis de causa raíz estructurado antes de tocar cualquier código
- Traza rutas de ejecución y reduce la superficie de fallo
- Aísla regresiones usando historial de git y la memoria de incidentes de Engram
- Propone un fix solo después de confirmar la causa raíz — nunca antes
- Documenta el incidente en Engram para que el equipo no debuggee lo mismo dos veces

**Ejemplo de prompt:**
```
El webhook de pagos está fallando silenciosamente en staging pero pasando en local.
Traza el fallo y encuentra la causa raíz.
```

**Output que recibes:**
- Declaración de causa raíz con evidencia
- Pasos de reproducción
- Propuesta de fix con explicación
- Entrada de incidente en Engram para referencia futura

**Skills activadas:** `debugging`, `systematic-debugging`, `verification-before-completion`

---

## Generador de Documentación

**Problema que resuelve:** Tu código se entrega pero tu documentación no. Los ADRs nunca se escriben. Los changelogs son inconsistentes. El onboarding tarda días porque nada está documentado.

**Qué hace Pedrito:**
- Genera documentación de referencia de API directamente desde el código — sin escritura manual de specs
- Escribe Architecture Decision Records (ADRs) desde specs SDD y decisiones de Engram
- Produce changelogs desde el historial de git con agrupación semántica
- Crea guías de onboarding adaptadas a la estructura real del proyecto
- Mantiene la documentación como código — guardada en control de versiones, revisable, auditable

**Ejemplos de prompt:**
```
Genera un ADR para la decisión de usar event sourcing en el servicio de órdenes.
```
```
Escribe la entrada del CHANGELOG para la versión v2.1.0 basándote en los commits desde v2.0.0.
```

**Output que recibes:**
- Documentos en Markdown listos para commit
- Estructura consistente en todos los tipos de doc
- Almacenados en el lugar correcto (`specs/`, `docs/`, `docs/engram/decisions/`)

**Skills activadas:** `docs-pro`, `commit-sentinel`, `engram-manager`

---

## Optimizador de Prompts

**Problema que resuelve:** Tus outputs de IA son inconsistentes, demasiado verbosos o están confiadamente equivocados. Estás gastando tokens en ruido y obteniendo alucinaciones en detalles críticos.

**Qué hace Pedrito:**
- Audita tus prompts existentes en busca de anti-patrones estructurales (instrucciones vagas, restricciones faltantes, sobrecarga de contexto)
- Reescribe los prompts usando principios de disciplina low-context
- Diseña ventanas de contexto que incluyen solo lo que el modelo necesita — nada más
- Valida los outputs frente al comportamiento esperado antes de dar un prompt por terminado
- Sincroniza documentación de librerías en tiempo real via Context7 para que los prompts referencien APIs actuales, no obsoletas

**Ejemplo de prompt:**
```
Revisa los prompts en /src/ai/prompts/ y optimízalos para precisión y eficiencia de tokens.
```

**Output que recibes:**
- Análisis anotado de las debilidades de cada prompt
- Versiones reescritas con explicaciones
- Comparación de conteo de tokens antes/después
- Casos de prueba de validación

**Skills activadas:** `context-keeper`, `context7`, `humanized-communication`

---

## Orquestador

**Problema que resuelve:** Tu tarea es demasiado grande para una sola pasada de agente. Involucra múltiples preocupaciones — análisis, planificación, implementación, verificación — y necesita coordinación entre ellas sin perder estado.

**Qué hace Pedrito:**
- Descompone workflows complejos en un ciclo de vida SDD de 9 fases (Intake → Explore → Proposal → Spec → Design → Tasks → Apply → Verify → Archive)
- Activa sub-agentes especializados para cada fase y coordina sus outputs
- Mantiene un artefacto de spec compartido para que todos los agentes trabajen desde la misma fuente de verdad
- Aplica gates de aprobación entre fases — tú mantienes el control de las decisiones críticas
- Archiva el workflow completo en `specs/<change-id>/` para auditoría futura

**Ejemplos de prompt:**
```
Migra el servicio de usuarios de REST a GraphQL. Planifica, genera spec e implementa.
```
```
Refactoriza el módulo de facturación para soportar multi-moneda. Workflow SDD completo.
```

**Output que recibes:**
- Ejecución por fases con checkpoints visibles
- Artefactos de spec auditables
- Gates de aprobación antes de pasos destructivos o irreversibles
- Archivo completo de decisiones y rationale

**Skills activadas:** `architect-orchestrator-v3`, `sdd-manager`, `engram-manager`, `writing-plans`, `executing-plans`

---

## Revisor de Código

**Problema que resuelve:** Las revisiones de PR son inconsistentes. Los problemas de seguridad se cuelan. El historial de commits es un desastre. Necesitas un revisor que no se canse, no se salte las partes difíciles y haga cumplir los estándares en cada ocasión.

**Qué hace Pedrito:**
- Revisa PRs en cuanto a corrección, seguridad y alineación arquitectónica
- Ejecuta verificaciones de security gate (vectores de inyección, patrones de autenticación, riesgos de exposición de datos)
- Audita los mensajes de commit para verificar cumplimiento de conventional commits y claridad
- Cruza los cambios con las decisiones de Engram para detectar deriva de la arquitectura acordada
- Bloquea la aprobación si los verification gates no se han cumplido

**Ejemplo de prompt:**
```
Revisa el PR del refactor de pagos. Enfócate en seguridad y cambios de contrato de API.
```

**Output que recibes:**
- Revisión estructurada con hallazgos ordenados por severidad
- Informe de pass/fail del security gate
- Resumen del estado del historial de commits
- Aprobación o bloqueo explícito con razonamiento

**Skills activadas:** `code-review-pro`, `security-reviewer`, `commit-sentinel`, `verification-before-completion`

---

## Verificador de Tests

**Problema que resuelve:** Existen tests pero no prueban las cosas correctas. Los números de cobertura se ven bien pero las regresiones igual se van a producción. La disciplina TDD se erosiona bajo presión de deadlines.

**Qué hace Pedrito:**
- Aplica TDD — los tests deben escribirse antes o junto a la implementación, no después
- Verifica que la cobertura de tests realmente cubre la superficie de riesgo, no solo los happy paths
- Ejecuta verification gates antes de marcar cualquier tarea como completada
- Detecta y señala tests que pasan por accidente (assertions débiles, edge cases faltantes)
- Almacena los resultados de verificación como evidencia en el artefacto de spec SDD

**Ejemplo de prompt:**
```
Verifica la cobertura de tests del módulo de autenticación.
Señala cualquier superficie de riesgo que no esté cubierta.
```

**Output que recibes:**
- Mapa de cobertura con análisis de brechas
- Lista de edge cases faltantes y rutas de riesgo no cubiertas
- Pass/fail del verification gate
- Recomendaciones para adiciones de tests específicos

**Skills activadas:** `test-driven-development`, `test-verifier`, `verification-before-completion`, `systematic-debugging`

---

## Combinando modos

Los modos se pueden encadenar. El Orquestador naturalmente invoca otros modos como sub-agentes durante un workflow SDD. Un flujo típico de tarea compleja podría verse así:

```
Orquestador → Analizador de Código (fase Explore)
            → Revisor de Código    (fase Apply)
            → Verificador de Tests (fase Verify)
            → Generador de Docs    (fase Archive)
```

Pedrito gestiona esta coordinación. Tú ves los checkpoints y apruebas los gates. Los agentes hacen el trabajo.

---

## Descubrimiento JIT de modos

Si tu workflow no encaja en ninguno de estos modos, Pedrito puede descubrir skills adicionales Just-In-Time desde registros confiables. Las nuevas capacidades siempre se presentan para tu aprobación antes de activarse. Ver [03_skills_management.md](03_skills_management.md) para más detalles.
