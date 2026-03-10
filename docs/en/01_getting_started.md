# Getting Started

## 1. Installation & Initialization
To initialize a new project with the AI Engineering Workspace Kit, clone the repo and run the bootstrap script within your target project's root folder:

```bash
git clone <repo> ai-engineering-workspace-kit
cd my-new-project
bash ../ai-engineering-workspace-kit/scripts/bootstrap-workspace.sh
```

A `.devkit` folder will be generated containing all the necessary AI configurations, skills, and operational rules for your new repository.

## 2. Usage Scripts
The `scripts/` directory contains several automation utilities to manage the workspace:

- **`bootstrap-workspace.sh`**: Initializes the workspace into a target directory.
- **`validate-skills.sh`**: Validates the integrity of the skills registry and file system structure. Always run this after modifying skills.
  ```bash
  bash scripts/validate-skills.sh
  ```
- **`install-rules.sh` / `install-skills.sh` / `install-workflows.sh`**: Installs individual module components.
- **`set-skill-profile.sh`**: Switches between different skill profiles for the agent.
- **`sync-workspace.sh`**: Synchronizes existing projects with updates from the base repo.
