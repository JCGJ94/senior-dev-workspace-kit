# Arquitectura de Sub-Agentes V3

## Propósito
Definir la primera topología de orquestación V3 completa del AI Engineering Workspace Kit.

## Por qué existe
El sistema V3 necesita un modelo de ejecución duradero que escale la calidad de entrega sin permitir que la ventana de contexto activa crezca sin control. El agente maestro y sus sub-agentes especializados proporcionan ese grafo de ejecución.

## Agente Maestro

### `architect-orchestrator-v3`
Dueño de la ejecución global.

Responsabilidades:
- aplicar el contrato de arquitectura V3
- enrutar trabajo hacia los sub-agentes especializados
- mantener SDD obligatorio para trabajo no trivial
- mantener estabilidad de contexto
- exigir evidencia de verificación y seguridad
- controlar el enrutamiento al dominio de deploy
- promover conocimiento reutilizable al Engram por el camino correcto

## Sub-Agentes Especializados

### `engram-manager`
Dueño de la memoria durable.

Alcance:
- promoción de memoria
- etiquetado para recuperación
- clasificación de conocimiento durable

### `sdd-manager`
Dueño del ciclo SDD de 9 fases.

Alcance:
- progresión de fases
- completitud de artefactos
- disponibilidad del workflow

### `skill-governor`
Dueño de la gobernanza de skills.

Alcance:
- activación de skills
- adaptación de skills upstream de confianza a V3
- disciplina de registry y política de confianza

### `security-reviewer`
Dueño de las puertas de seguridad.

Alcance:
- límites de confianza
- controles de CI/CD
- seguridad del runtime
- bloqueadores de release

### `test-verifier`
Dueño de la puerta de verificación.

Alcance:
- mapeo de checks requeridos
- validación de evidencia
- disponibilidad para completar

### `deploy-orchestrator`
Dueño del dominio de deploy.

Alcance:
- preflight
- contrato de build y release
- validación de smoke tests
- planificación de rollback

### `context-keeper`
Dueño de la estabilidad de contexto.

Alcance:
- paquetes de contexto
- carga con resumen primero
- control de la ventana activa

## Modelo de Ejecución
1. Recibir la solicitud.
2. Determinar si SDD es obligatorio.
3. Activar `architect-orchestrator-v3` para trabajo transversal.
4. Seleccionar el conjunto mínimo de sub-agentes especializados.
5. Construir un paquete de contexto estable.
6. Ejecutar la fase SDD actual.
7. Verificar antes de completar.
8. Promover conocimiento durable al Engram.

## Skills Upstream de Confianza
Los skills seleccionados por el mantenedor del mother-repo se tratan como entradas de alta confianza. V3 debe preservarlos y adaptarlos, no descartarlos. La adaptación implica:
- añadir metadatos V3 donde falten
- alinear las reglas de activación
- alinear los contratos de verificación
- alinear la disciplina de contexto y memoria

## Objetivo de Integración Inicial
Este documento define solo el primer milestone de integración:
- el agente maestro existe
- los sub-agentes especializados existen
- el registry los conoce
- las reglas de activación los entienden

El trabajo futuro los conectará al Engram completo, la generación de artefactos SDD, esquemas de registry reforzados y enforcement en CI/CD.
