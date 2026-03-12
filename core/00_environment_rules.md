# Environment Resolution Rules

## Purpose
Ensure the AI agent identifies the correct ecosystem, runtime, platforms, and tooling before executing ANY command.

## Step 0: Repository Intent Detection
Before modifying files, scan the repository root to understand the macro-architecture:
- **Infrastructure:** Detect `docker-compose.yml`, `Makefile`, `terraform/`, or CI/CD pipelines.
- **Structure:** Identify if it is a Monorepo (`apps/`, `packages/`, `nx.json`, `pnpm-workspace.yaml`), or a monolithic Frontend/Backend.
- **Orchestration:** Check root level tools (Turborepo, Bun, Husky) that govern sub-projects.

## Environment Resolution Contract
The agent MUST follow this strict priority to determine the active stack in the Current Working Directory (CWD):

### 1. Ecosystem Identification (Lockfile Priority)
- **Node/TS:** `bun.lockb` | `bun.lock` (Bun), `pnpm-lock.yaml` (pnpm), `package-lock.json` (npm), `yarn.lock` (yarn). (Bun is the default preference if ambiguous).
- **Python:** `uv.lock` (uv), `poetry.lock` (poetry), `requirements.txt` (pip).

### 2. Validation & Tooling Fallback
- NEVER assume a CLI tool exists globally. Always verify existence using `command -v <tool>`, `npx --no-install <tool>`, or `bun x <tool>`.
- **Hybrid OS Sync:** Recognize that the workspace may be accessed via PC Windows and Mac. Path delimiters and native binaries (like `rm` vs `del`) must be handled carefully. Prefer cross-platform node scripts or POSIX compatibility layers (e.g., git bash) if running terminal commands on Windows.

### 3. Type-Safety Detection
- **TypeScript:** Always use `tsc --noEmit` as the validation baseline unless `biome`/`swc` is explicitly enforced in `package.json` scripts.
- **Python:** Prefer `pyright` or `mypy` if configured in `pyproject.toml`.

## Monorepo Context Switching
- **Dynamic Scope:** Resolution is ALWAYS scoped to the directory being modified. If moving from `/frontend` to `/backend`, re-run environment detection.
- **Root Protection:** Do not run project-specific install commands at the root of a monorepo unless intending to orchestrate all workspaces.
