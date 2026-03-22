# Phase 7 Intake — Distribución Profesional

**Fecha:** 2026-03-21
**Fase:** V4 Phase 7
**Scope:** CI/CD, compilación cross-platform, scripts de distribución, Homebrew

---

## Contexto

Al finalizar Fase 6, Pedrito es funcionalmente completo: instalador, Engram, GGA,
MCP, backup, y perfiles. Pero para que alguien externo lo use, necesita:

```bash
# Hoy (no funciona para un usuario nuevo):
git clone ... && bun install && bun run build && ./dist/pedrito

# Fase 7 (lo que queremos):
brew install tu-user/pedrito/pedrito
# o
curl -sL install.pedrito.dev | sh
```

### Estado actual del CI

`build.yml` ya existe y corre en macos-latest + ubuntu-latest:
- `bun install --frozen-lockfile`
- `bun run typecheck` + `bun run test` + `bun run build`

El `build` de cada package usa `bun build --compile --outfile dist/<binary>`,
pero sin `--target` explícito — compila solo para la plataforma donde corre el runner.

### Binarios a distribuir

| Binario | Package | Descripción |
|---|---|---|
| `pedrito` | `@pedrito/installer` | CLI instalador principal |
| `pedrito-engram` | `@pedrito/engram` | Servidor de memoria |
| `gga` | `@pedrito/gga` | Pre-commit hook Guardian Angel |

### Plataformas objetivo

| Target Bun | OS | Arch | Binario |
|---|---|---|---|
| `bun-macos-arm64` | macOS | Apple Silicon | `pedrito-macos-arm64` |
| `bun-macos-x64` | macOS | Intel | `pedrito-macos-x64` |
| `bun-linux-x64` | Linux / Ubuntu / WSL2 | x64 | `pedrito-linux-x64` |
| `bun-windows-x64` | Windows | x64 | `pedrito-windows-x64.exe` |

## Objetivo de la fase

1. **`release.yml`** — GitHub Actions que al crear tag `v*` compila todos los binarios
   para las 4 plataformas, genera checksums SHA256 y crea GitHub Release automáticamente
2. **Build scripts** — añadir `build:release` por plataforma en cada package
3. **`scripts/install.sh`** — curl installer que detecta plataforma y descarga el binario correcto
4. **Homebrew Formula** — `Formula/pedrito.rb` para distribuir via `brew install`
5. **Versión centralizada** — single source of truth en `package.json` raíz, leído por todos los packages en build time
6. **`pedrito version`** — mostrar versiones de pedrito, engram, gga y kit

## Restricciones

- Los binarios son self-contained (sin runtime Bun en el sistema del usuario)
- El `install.sh` verifica SHA256 antes de instalar — no instalar si falla
- La Homebrew Formula vive en un tap separado (`pedrito-tap`) — esta fase la spec'a pero no la crea
- Windows es best-effort: cross-compilar desde `windows-latest` runner con limitaciones conocidas de Bun
- `release.yml` solo se dispara en tags `v*` — no en cada push

## Criterios de éxito

1. `git tag v4.0.0 && git push --tags` dispara `release.yml` y crea GitHub Release
2. El release tiene 12 binarios (3 tools × 4 plataformas) + 12 checksums SHA256
3. `curl -sL .../install.sh | sh` descarga, verifica y instala en macOS ARM64 y Linux x64
4. `brew tap tu-user/pedrito && brew install pedrito` funciona en macOS
5. `pedrito version` muestra versiones de los 3 componentes
6. Los binarios de macOS están firmados con `codesign --deep` (ad-hoc si no hay Apple Developer cert)
