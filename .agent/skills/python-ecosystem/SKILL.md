# Python Ecosystem

## Purpose
Work effectively in Python repositories by detecting the real project tooling, respecting environment boundaries, and implementing changes using repository-native Python workflows instead of forcing non-Python defaults.

## Use when
- Working in a Python repository or Python subproject.
- Implementing backend services, CLIs, scripts, automation, data workflows, or tests in Python.
- Debugging, refactoring, or reviewing Python code.
- Managing Python environments, dependencies, packaging, or quality tooling.

## Do not use when
- The repository is not Python-based and contains no meaningful Python surface.
- The task is strictly frontend-only or unrelated to Python execution.
- The Python environment cannot be inferred and no safe repository-native commands are available.
- The requested change belongs entirely to another runtime already isolated from Python.

## Python Workflow

1. **Detect the Real Python Toolchain**
   Identify the actual repository setup before acting.

   Check for:
   - `pyproject.toml`
   - `requirements.txt`
   - `requirements-dev.txt`
   - `poetry.lock`
   - `uv.lock`
   - `Pipfile`
   - `tox.ini`
   - `noxfile.py`
   - `.python-version`

   Detect:
   - package manager
   - environment manager
   - test runner
   - lint and format tools
   - typing tools

   Do not assume `uv`, `poetry`, `pip`, `pytest`, `ruff`, `mypy`, or `pyright` unless the repository indicates them.

2. **Respect Environment Boundaries**
   - Use the repo’s actual environment workflow.
   - Prefer project-local execution over global Python assumptions.
   - Do not mix tools from different Python workflows unless the repo already does so intentionally.
   - Do not introduce JavaScript tooling into Python-only tasks.

3. **Follow Repository-Native Commands**
   Prefer the project’s real commands for:
   - install
   - test
   - lint
   - format
   - type-check
   - run scripts

   Examples may include:
   - `uv run`
   - `poetry run`
   - virtualenv-based commands
   - `python -m ...`

   Never force Bun, Node, or TypeScript commands for Python work.

4. **Preserve Pythonic Structure**
   - Follow existing package layout, naming, import style, and module boundaries.
   - Prefer small focused modules and explicit logic.
   - Avoid introducing unnecessary abstractions or framework-like wrappers.

5. **Treat Types and Validation Explicitly**
   - Respect the repo’s current typing level.
   - Add or refine type hints when consistent with the codebase.
   - Use validation libraries only if already adopted or clearly justified by the task.
   - Do not over-type small scripts if the repository does not follow that pattern.

6. **Handle Dependencies Conservatively**
   - Add dependencies only when necessary.
   - Use the repository’s package management strategy.
   - Do not mix `requirements.txt`, `poetry add`, and `uv add` arbitrarily.
   - Avoid dependency churn for small tasks.

7. **Keep Scripts Portable**
   - Prefer standard library solutions when sufficient.
   - Keep scripts cross-platform where practical.
   - Avoid shell-specific assumptions unless the repository explicitly requires them.

8. **Verify with Python-Native Evidence**
   - Run the actual repository verification commands.
   - Confirm tests, lint, format, and typing status using the detected Python workflow.
   - Do not claim success without fresh verification evidence.

## Rules
- Detect the Python toolchain from the repository before acting.
- Never force Bun or other non-Python runtimes onto Python tasks.
- Use repository-native environment and dependency workflows.
- Respect existing Python package layout and style.
- Keep changes minimal, explicit, and reversible.
- Avoid unnecessary new dependencies.
- Prefer standard library solutions when they are sufficient.
- Follow the repo’s actual testing, linting, and typing strategy.
- Do not claim completion without fresh verification.
- Keep commands and implementation compatible with the developer’s environment whenever possible.

## Tooling Detection Guidelines

Prefer detecting:
- `pyproject.toml` configuration
- lockfiles
- task runner config
- lint/type/test config
- local script conventions

Avoid assuming:
- `pytest` if tests are not configured
- `ruff` if another linter is used
- `mypy` if typing checks are not present
- `poetry` or `uv` without evidence

## Validation
Before reporting completion, confirm:
- The repository is actually using Python for the affected area.
- The toolchain was inferred from repository files, not assumed.
- No non-native runtime was forced into the workflow.
- Dependency changes follow the repo’s actual package strategy.
- Fresh Python-native verification was executed successfully.

## Output
Return:
- Python area affected
- Toolchain detected
- Commands used
- Dependency impact
- Verification run
- Risks or follow-up notes