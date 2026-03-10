# Resumen de Arquitectura

El kit de trabajo está estructurado con estricta modularidad y separación de responsabilidades para maximizar la optimización del contexto para la IA. Esto evita que el agente cargue reglas innecesarias, manteniendo un consumo de tokens extremadamente bajo.

## Módulos Principales

- **`ai_rules/`**: Reglas de comportamiento base para los agentes IA (ej. cómo programar, escribir código y cómo asegurar la arquitectura). Están siempre activas.
- **`skills/`**: Habilidades especializadas organizadas en carpetas. Cada carpeta contiene un archivo `SKILL.md` con instrucciones atómicas para dominios específicos (ej. `frontend`, `systematic-debugging`).
- **`skills_registry/`**: La capa de orquestación. Define *cuándo* y *cómo* se usan las habilidades, determinando los niveles (tiers) activos e indexando habilidades válidas a través del manifiesto.
- **`workflows/`**: Procedimientos Operativos Estándar (SOPs) para tareas procedimentales repetibles como despliegues, lanzamientos o arreglo de errores.
- **`templates/`**: Planos (blueprints) de estructura o base para nuevas habilidades (`_blueprint/`) y arquetipos arquitectónicos (ej. `saas`, `portfolio`).
- **`config/`**: Archivos de configuración como `developer_preferences.md` que especifican la autoridad del agente, preferencias del desarrollador y proactividad.
- **`scripts/`**: Herramientas de automatización y scripts ejecutables para gestionar el ciclo de vida del entorno de trabajo.
