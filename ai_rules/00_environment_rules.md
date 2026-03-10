# Environment Resolution Rules

## Purpose
Ensure the AI agent identifies the correct ecosystem, runtime, and tooling before executing any command.

## Step 0: Repository Intent Detection
Before analyzing specific files, scan the repository root to understand the overall intent:
- **Infrastructure:** Detect `docker-compose.yml`, `Makefile`, `terraform/`, or CI/CD paths.
- **Project Structure:** Identify if it's a Monorepo (`apps/`, `packages/`, `nx.json`), a simple Backend/Frontend split, or a monolithic app.
- **Orchestration:** Recognize root-level tools (Turborepo, Husky, Prettier) that might differ from the sub-project's primary language.

## Environment Resolution Contract
The agent MUST follow this priority to determine the active ecosystem in the current working directory:

### 1. Ecosystem Identification (Lockfiles First)
- **TypeScript/JS:** `bun.lockb` | `bun.lock` (Bun), `pnpm-lock.yaml` (pnpm), `package-lock.json` (npm), `yarn.lock` (yarn).
- **Python:** `uv.lock` (uv), `poetry.lock` (poetry), `pdm.lock` (pdm), `hatch.lock` (hatch), `requirements.txt` (pip).

### 2. Configuration Analysis (Secondary)
- **Python:** Inspect `pyproject.toml` sections: `[tool.uv]`, `[tool.poetry]`, `[tool.pdm]`, `[tool.hatch]`.
- **TypeScript/JS:** Inspect `package.json` for `packageManager` or `engines`.

### 3. Type-Safety Detection
- **Python:** Prefer `pyright` if `pyrightconfig.json` is present; otherwise, use `mypy` if configured. Fallback to basic linting if no type-checker is defined.
- **TypeScript:** Always use `tsc --noEmit` unless a faster alternative (like `biome`) is explicitly configured in the repo.

## Monorepo Cross-Directory Rules
- **Contextual Scope:** Resolution is ALWAYS scoped to the directory where the change is happening.
- **Switching Ecosystems:** If a task moves from `/frontend` to `/backend`, the agent MUST re-run this resolution contract.
- **Root Protection:** Do not run ecosystem-specific commands from the repository root unless explicitly targeting root-level orchestration tools.

## Mandatory Execution
- Never assume a tool is present. Always verify with `command -v` or by detecting the lockfile.
- If multiple ecosystems are detected and the primary one is ambiguous, ask the developer for confirmation.
