# AI Engineering Workspace Kit

🇬🇧 [English](README.md) | 🇪🇸 [Español](README.es.md)

Un **kit de entorno de desarrollo profesional asistido por IA** diseñado para estandarizar cómo los agentes de IA interactúan con tu código.

Este proyecto provisiona un runtime ligero y modular en cualquier repositorio, aplicando estándares de ingeniería de alto rendimiento, optimización de contexto y compatibilidad con múltiples stacks tecnológicos.

---

## 🚀 Inicio Rápido (v2)

Convierte cualquier repositorio en un espacio de trabajo listo para la IA en segundos.

### Instalación en 1 paso
Desde la raíz de tu proyecto destino:

```bash
# 1. Provisión (Crea .agent/ y detecta tu stack)
bash ruta/al/kit/scripts/provision.sh

# 2. Registro (Indexa las skills disponibles)
bash ruta/al/kit/scripts/generate-registry.sh
```

### 🔄 Actualización Segura
Si el kit base se actualiza, sincroniza tu proyecto sin perder tus personalizaciones:
```bash
bash ruta/al/kit/scripts/sync-workspace-v2.sh
```

---

## 🛠️ Principios del Sistema

### 1. Adaptación al Entorno
El kit **nunca impone herramientas**. Detecta tu stack (Node, Python, Bun, Híbrido) y resuelve tokens operativos como `[OP_TEST]` o `[OP_INSTALL]` dinámicamente mediante `.agent/state/env_state.json`.

### 2. Contexto Modular
La información se segmenta en capas especializadas para minimizar el consumo de tokens y maximizar la profundidad del razonamiento del agente:
- `core/`: Reglas fundamentales de comportamiento.
- `registry/`: Manifiestos de skills y políticas de activación.
- `skills/`: Capacidades técnicas reutilizables.
- `workflows/`: Procedimientos estándar de operación (SOPs).

### 3. Arquitectura Basada en Skills
Las skills son unidades atómicas de conocimiento. Definen **QUÉ** puede hacer el agente. El **Registro** define **CUÁNDO** y **CÓMO** se activan según la intención de la tarea.

---

## 📂 Estructura del Repositorio (Fuente)

- **`core/`**: Fuente de las reglas base de comportamiento de la IA.
- **`registry/`**: Fuente de manifiestos, tiers y lógica de activación.
- **`skills/`**: Biblioteca de capacidades técnicas modulares.
- **`workflows/`**: Procedimientos agnósticos (feature, bugfix, refactor, release).
- **`scripts/`**: Herramientas de automatización (provisión, sync, validación).
- **`docs/`**: Documentación técnica detallada.

---

## 🏗️ El Runtime .agent (Salida)

Al ejecutar `provision.sh`, el kit inyecta un directorio `.agent/` en tu proyecto. Este es el **cerebro operativo** de la IA:
- `.agent/core/`: Reglas inyectadas.
- `.agent/registry/`: Índice local de skills.
- `.agent/skills/`: Conjunto de skills activas.
- `.agent/workflows/`: Procedimientos ejecutables.
- `.agent/state/`: Estado dinámico del entorno (herramientas detectadas).

---

## 🎯 Sistema de Tiers

Las skills se organizan por impacto y coste:
- **Tier 1 — Core**: Siempre activas. Velan por la atomicidad, seguridad y corrección.
- **Tier 2 — Calidad de Código**: Skills de implementación (debugging, TDD, refactor).
- **Tier 3 — Orquestación**: Planificación y delegación multi-agente.
- **Tier 4 — Entrega**: Historial de Git, finalización de ramas y releases.

---

## 🧪 Validación
Mantén la integridad del kit validando la estructura de las skills y la consistencia del registro:
```bash
bash scripts/validate-skills.sh
```

---

## Versionado y Contribución
Este proyecto sigue [Semantic Versioning](https://semver.org/). Las contribuciones deben enfocarse en **bajo consumo de tokens**, **estilo imperativo** y **comportamiento determinista**.