# Summary — V4 Phase 7: Distribución Profesional

**Status:** Planning
**Started:** 2026-03-21
**Completed:** —

## What This Is

Hace que Pedrito sea instalable via `brew install`, `curl | sh`, y binarios directos.
Sin requerir Bun ni Node en el sistema del usuario.
3 binarios × 4 plataformas = 12 artifacts por release.

## Key Decisions

- **`--define PEDRITO_VERSION` en build time** — los binarios compilados no tienen acceso al filesystem del repo en runtime; el valor se quema en compile time con el `--define` de Bun
- **Ad-hoc signing macOS** (`codesign --sign -`) — evita "damaged binary" de Gatekeeper sin requerir Apple Developer account; suficiente para V4
- **Tap repo separado** (`pedrito-tap`) — convención fuerte de Homebrew; mezclar en el repo principal rompería `brew update`
- **SHA256 obligatorio** — el `install.sh` verifica checksum antes de instalar y aborta si falla; nunca instalar binarios sin verificar
- **`prerelease` automático** — tags con `-` (ej. `v4.0.0-beta.1`) se marcan como prereleases en GitHub

## Files to Create / Modify

23 tareas en `06-tasks.md`:
- 3 modificaciones de version.ts / subcomandos version en engram y gga
- 5 build scripts (build-release.sh + scripts en 3 packages + root)
- 1 `release.yml` (matrix 4 plataformas, job build + job release)
- 2 tareas install.sh (crear + verificar)
- 2 tareas Homebrew (formula + docs)
- 1 `pedrito version` completo
- 1 update build.yml
- 8 verificación (yamllint, test en 2 OS, smoke tests)

## Artifacts por release

```
pedrito-macos-arm64          pedrito-macos-arm64.sha256
pedrito-macos-x64            pedrito-macos-x64.sha256
pedrito-linux-x64            pedrito-linux-x64.sha256
pedrito-windows-x64.exe      pedrito-windows-x64.exe.sha256
pedrito-engram-macos-arm64   ... (×4)
gga-macos-arm64              ... (×4)
pedrito-macos-arm64.tar.gz   pedrito-macos-arm64.tar.gz.sha256  ← para Homebrew
pedrito-macos-x64.tar.gz     pedrito-macos-x64.tar.gz.sha256
```
