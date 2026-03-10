# AI Engineering Workspace Kit

🇬🇧 [English](README.md) | 🇪🇸 [Español](README.es.md)

Un **kit de entorno de desarrollo reutilizable** diseñado para estandarizar proyectos que utilizan desarrollo asistido por IA.

Este repositorio proporciona una capa operativa que define cómo interactúan:
- Los agentes de IA.
- El desarrollador.
- La arquitectura del proyecto.

El objetivo es crear un entorno consistente para proyectos que utilizan herramientas como:
- Antigravity
- Windsurf
- Cursor
- Sistemas multi-agente personalizados

---

## Por qué existe este repositorio

La mayoría de repositorios definen **la estructura del código**, pero no definen **cómo debe comportarse la IA dentro del proyecto**.

Este kit resuelve ese problema proporcionando:
- Reglas de ingeniería para IA.
- Habilidades modulares reutilizables.
- Flujos de trabajo estandarizados.
- Scripts de automatización.
- Validación de la arquitectura de habilidades.
- Documentación optimizada para bajo consumo de tokens.

El resultado es un **entorno portable de desarrollo asistido por IA** reutilizable entre múltiples proyectos.

---

## Principios del sistema

### 1. Adaptación al entorno
El kit **no impone tecnologías**.
Debe adaptarse al ecosistema real del proyecto.
Por ejemplo:
- Proyectos Python → herramientas Python
- Proyectos Node → herramientas Node
- Proyectos híbridos → toolchains separadas

### 2. Contexto modular
Las reglas se separan en módulos para evitar cargar contexto innecesario:
- `ai_rules/`
- `skills/`
- `skills_registry/`
- `workflows/`
- `templates/`
- `config/`
- `scripts/`

Esto permite mantener un **consumo mínimo de tokens** para el agente.

### 3. Arquitectura basada en Skills
El sistema utiliza **Skills** como unidades de conocimiento reutilizable.
Una Skill representa una capacidad técnica concreta, por ejemplo:
- Debugging sistemático
- Arquitectura frontend
- Testing
- Migraciones de base de datos

Cada Skill contiene:
- `SKILL.md`
- `scripts/`
- `resources/`

### 4. Activación explícita
Escribir una skill define **QUÉ hace**.
El sistema de registro define **CUÁNDO se usa**.
La lógica de activación se gestiona en:
- `skills_registry/`

---

## Inicio rápido

### 1. Clonar el repositorio
```bash
git clone <repo> ai-engineering-workspace-kit
```

### 2. Inicializar un proyecto
Dentro de tu proyecto:
```bash
cd mi-proyecto
bash ../ai-engineering-workspace-kit/scripts/bootstrap-workspace.sh
```
Esto generará una carpeta `.devkit/` que contendrá las configuraciones necesarias para el entorno de IA.

### 3. Validar la arquitectura
Después de modificar habilidades:
```bash
bash scripts/validate-skills.sh
```
Esto asegura:
- Que el manifiesto esté sincronizado.
- Que no existan skills huérfanas.
- Que la estructura sea correcta.

### 4. Sincronizar actualizaciones
Si el kit base evoluciona:
```bash
bash scripts/sync-workspace.sh
```
Esto actualizará reglas, skills y workflows.

---

## Estructura del repositorio

- **`ai_rules/`**: Reglas base de comportamiento para los agentes IA. Siempre activas.
- **`skills/`**: Capacidades técnicas modulares. Cada skill se encuentra en su propio directorio.
- **`skills_registry/`**: Capa de orquestación del sistema. Define activación de skills, niveles (tiers), manifiesto de habilidades y skills preferidas.
- **`workflows/`**: Procedimientos estándar para tareas repetibles (ej. debugging, despliegues, releases).
- **`templates/`**: Plantillas reutilizables para crear nuevas skills o arquitecturas.
- **`config/`**: Configuraciones generales del kit.
- **`scripts/`**: Herramientas de automatización del entorno (bootstrap, validación, sincronización).
- **`docs/`**: Documentación detallada del kit.

---

## Sistema de Skills

Las skills son módulos reutilizables utilizados por el agente IA.

**Estructura:**
```text
skills/
└── nombre-skill/
    ├── SKILL.md
    ├── scripts/
    └── resources/
```

**Reglas de escritura:**
- Usar verbos imperativos.
- Evitar narrativa innecesaria.
- Mantener bajo consumo de tokens.

---

## Sistema de Tiers

Las skills se clasifican por niveles:

- **Tier 1 — Core**: Siempre activas. Definen disciplina de ingeniería.
- **Tier 2 — Calidad de código**: Usadas durante implementación (ej. debugging, testing, refactorización).
- **Tier 3 — Escalado multi-agente**: Usadas para orquestación, planificación, división de tareas.
- **Tier 4 — Git y entrega**: Usadas para commits, ramas, releases.

---

## Documentación

La documentación se encuentra en `docs/` e incluye:
- Guía de inicio
- Arquitectura
- Gestión de skills
- Proceso de releases

---

## Versionado

El repositorio utiliza [Semantic Versioning](https://semver.org/).
- **MAJOR**: cambios incompatibles.
- **MINOR**: nuevas capacidades.
- **PATCH**: correcciones.

---

## Contribución

Las contribuciones deben mantener:
- Modularidad.
- Bajo consumo de tokens.
- Compatibilidad entre entornos.
- Comportamiento determinista del agente.