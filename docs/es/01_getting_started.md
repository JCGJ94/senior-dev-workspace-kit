# Primeros Pasos

## 1. Instalación e Inicialización
Para inicializar un nuevo proyecto con el AI Engineering Workspace Kit, clona el repositorio y ejecuta el script de inicialización (`bootstrap`) dentro de la carpeta raíz de tu proyecto de destino:

```bash
git clone <repo> ai-engineering-workspace-kit
cd mi-nuevo-proyecto
bash ../ai-engineering-workspace-kit/scripts/bootstrap-workspace.sh
```

Se generará una carpeta `.devkit` que contendrá todas las configuraciones de IA necesarias, habilidades (skills) y reglas operativas para tu nuevo repositorio.

## 2. Scripts de Uso
El directorio `scripts/` contiene varias utilidades de automatización para gestionar el entorno de trabajo (workspace):

- **`bootstrap-workspace.sh`**: Inicializa el entorno de trabajo en un directorio de destino.
- **`validate-skills.sh`**: Valida la integridad del registro de habilidades y la estructura del sistema de archivos. Ejecútalo siempre después de modificar cualquier habilidad.
  ```bash
  bash scripts/validate-skills.sh
  ```
- **`install-rules.sh` / `install-skills.sh` / `install-workflows.sh`**: Instala componentes individuales de los módulos.
- **`set-skill-profile.sh`**: Cambia entre diferentes perfiles de habilidades para el agente.
- **`sync-workspace.sh`**: Sincroniza proyectos existentes con las actualizaciones del repositorio base.
