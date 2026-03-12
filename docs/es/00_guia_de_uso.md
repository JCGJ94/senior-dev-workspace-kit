# Guía de uso del AI Engineering Workspace Kit

🇬🇧 [English](../en/00_usage_guide.md) | 🇪🇸 [Español](00_guia_de_uso.md)

Este documento explica cómo utilizar el kit dentro de proyectos reales para estandarizar el desarrollo asistido por IA.

---

## Ciclo de vida del workspace

El sistema funciona mediante el aprovisionamiento de un runtime operativo.

### 1. Provisión (Provisioning)

Instalar el workspace en un proyecto nuevo o existente:

```bash
# Detecta tu stack y crea .agent/
bash ruta/al/kit/scripts/provision.sh
```

Esto crea la carpeta `.agent/`, que contiene las reglas, skills y workflows optimizados para tu entorno.

---

### 2. Registro (Indexing)

Preparar el catálogo de habilidades para el agente:

```bash
# Genera el índice de skills local
bash ruta/al/kit/scripts/generate-registry.sh
```

---

### 3. Desarrollo

Durante el desarrollo:
- El agente consulta `.agent/core/` para seguir las reglas de ingeniería.
- Las skills se activan según la intención detectada.
- Los workflows guían procesos complejos (feature, bugfix, etc.).

---

### 4. Sincronización

Cuando el kit base evoluciona (nuevas skills o reglas core):

```bash
# Actualiza .agent/ protegiendo tus configuraciones locales
bash ruta/al/kit/scripts/sync-workspace-v2.sh
```

---

## Flujo de trabajo diario

1. Pides al agente implementar una funcionalidad o corregir un error.
2. El agente detecta el stack (vía `.agent/state/env_state.json`).
3. El agente activa las skills adecuadas (ej. `typescript-ecosystem`, `debugging`).
4. Se ejecutan comandos agnósticos (ej. `[OP_TEST]`) que se traducen a tu herramienta real (`npm test`, `pytest`, etc.).

---

## Crear nuevas skills en el Kit

Para añadir una capacidad al kit fuente:

1. **Crear carpeta:** `mkdir -p skills/mi-nueva-skill`
2. **Añadir SKILL.md:** Define el comportamiento y herramientas.
3. **Registrar:** Actualiza `registry/skill_manifest.json`.
4. **Validar:** Ejecuta `bash scripts/validate-skills.sh`.

---

## Resolución dinámica del entorno

El kit se basa en señales del repositorio para no forzar herramientas:
- Lockfiles detectados.
- Gestores de paquetes presentes.
- Configuración de tipos (`tsconfig`, `pyproject.toml`).

Esto permite un soporte nativo y sin fricción para Node.js, Python, Bun y proyectos híbridos.