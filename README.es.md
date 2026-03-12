```text
       ___  ____
      / _ \/  _/
     / __ _/ /  
    /_/ |_/___/ 
                
   A G E N T   K I T
```

[English](README.md) | **Español**

El **AI Engineering Workspace Kit** es un entorno de ejecución (runtime) diseñado específicamente para contextualizar, restringir y potenciar agentes de IA (como Claude, Cursor, Copilot o Gemini) que operan dentro de un repositorio estándar.

Provisiona un orquestador ligero y estrictamente estructurado en el directorio `.agent/` que establece la verdad fundamental operativa del código.

---

## El Problema

Los modelos fundacionales carecen de contexto persistente sobre los estándares de arquitectura de un proyecto y su "Tech Stack". Esto provoca "vibe-coding": código que funciona superficialmente pero viola los principios de la base de código subyacente.

## La Solución

El Kit inyecta una arquitectura predecible en el proyecto. Actúa como el puente entre el razonamiento del LLM y el código fuente.

1. **Determinismo:** Autodetecta el entorno de trabajo (ej. Node, Bun, Python) y adapta los tokens de ejecución.
2. **Sistema de Skills:** Proporciona un conjunto de capacidades estandarizadas para el análisis, refactorización y operaciones de calidad de código.
3. **Flujos de Trabajo Estrictos:** Fuerza al agente a seguir procedimientos operativos estándar (SOPs) definidos empíricamente para features, bugfixes y releases.

---

## Quick Start (Instalación)

Provisiona el entorno de ingeniería en tu proyecto con un solo comando:

```bash
# 1. Navega a la raíz de tu proyecto
cd "ruta/a/tu/proyecto"

# 2. Inicializa el orquestador
bash "E:/Full Stack Jose Carlos/senior-dev-workspace-kit/ai-engineering-workspace-kit/scripts/agent" init
```

*Nota: Esta operación es idempotente. Puedes ejecutarla para actualizar un entorno existente sin perder configuraciones personalizadas.*

---

## Arquitectura del Runtime

Una vez inicializado, el directorio de tu proyecto contendrá un entorno oculto `.agent/`. Este es el cerebro operativo.

- `core/`: Reglas de comportamiento fundacionales.
- `registry/`: Manifiestos locales y reglas de enrutamiento para las skills operativas.
- `skills/`: Biblioteca de capacidades técnicas atómicas ejecutables por el LLM.
- `workflows/`: Procedimientos estándar paso a paso para tareas complejas.
- `state/`: Topología del entorno y configuración dinámica analizada.

---

## Auditoría y Orquestación

El kit incorpora capacidades de detección de alucinaciones ("Doctor") obligando al agente a fundamentar su código verificando contexto real a través de repositorios como Context7 (si está disponible) y ecosistemas MCP (Model Context Protocol).

Para auditar la disponibilidad de conectividad y estado del runtime:

```bash
bash ruta/al/ai-engineering-workspace-kit/scripts/agent doctor
```

Para forzar una sincronización del estado base y skills cuando el repositorio matriz (upstream) haya sido actualizado:

```bash
bash ruta/al/ai-engineering-workspace-kit/scripts/agent sync
```

---

*Diseñado para la ingeniería de precisión guiada por IA.*