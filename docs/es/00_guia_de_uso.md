# Guía de uso del AI Engineering Workspace Kit

🇬🇧 [English](../en/00_usage_guide.md) | 🇪🇸 [Español](00_guia_de_uso.md)

Este documento explica cómo utilizar el kit dentro de proyectos reales.

El workspace actúa como una **capa operativa de desarrollo asistido por IA**.

---

## Ciclo de vida del workspace

El sistema funciona en tres fases.

### 1. Bootstrap

Instalar el workspace en un proyecto.

```bash
bash scripts/bootstrap-workspace.sh
```

Esto crea la carpeta `.devkit/`.

---

### 2. Desarrollo

Durante el desarrollo:
- Las reglas guían al agente.
- Las skills se activan cuando son necesarias.
- Los workflows estandarizan procesos.

---

### 3. Mantenimiento

Cuando el kit evoluciona:

```bash
bash scripts/sync-workspace.sh
```

Esto actualiza los proyectos existentes.

---

## Flujo de trabajo diario

El flujo habitual es:
1. El usuario pide al agente implementar una funcionalidad.
2. El agente activa las skills relevantes.
3. Las reglas aseguran la calidad de la arquitectura.
4. Los workflows guían los procesos complejos.

---

## Crear nuevas skills

Pasos para crear una nueva skill:

1. **Crear carpeta:**
   ```bash
   mkdir -p skills/nueva-skill
   ```
2. **Añadir archivo:**
   Crea el archivo principal `skills/nueva-skill/SKILL.md`.
3. **Registrar:**
   Registra la nueva skill en el sistema dentro de `skills_registry/`.
4. **Validar:**
   Ejecuta el script de validación:
   ```bash
   bash scripts/validate-skills.sh
   ```

---

## Resolución de entorno

El kit nunca fuerza herramientas. Se basa en señales del repositorio actual:

- Archivos de bloqueo (lockfiles).
- Gestores de paquetes.
- Configuración del lenguaje.
- Herramientas de tipado.

Esto permite soportar de forma natural:
- Python
- Node.js
- Bun
- Proyectos híbridos