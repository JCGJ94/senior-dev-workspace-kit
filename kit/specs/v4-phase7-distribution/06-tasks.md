# Phase 7 Tasks — Distribución Profesional

## Versión centralizada

- [ ] **7.1** Modificar `packages/installer/src/version.ts`
  - Cambiar a `declare const PEDRITO_VERSION: string`
  - Exportar `VERSION = typeof PEDRITO_VERSION !== 'undefined' ? PEDRITO_VERSION : '4.0.0-dev'`
  - El valor real se inyecta via `--define` en build time (ver 7.4)

- [ ] **7.2** Añadir subcomando `version` en `packages/engram/src/main.ts`
  - case `'version'`: `console.log(VERSION)` y exit 0
  - Añadir al help text: `  version            Show version`

- [ ] **7.3** Añadir subcomando `version` en `packages/gga/src/main.ts`
  - Añadir a Commander: `.command('version').action(() => { console.log(VERSION); })`

## Build scripts por plataforma

- [ ] **7.4** Crear `scripts/build-release.sh`
  - Acepta un argumento: `TARGET` (macos-arm64 | macos-x64 | linux-x64 | windows-x64)
  - Lee `VERSION` del `package.json` raíz con `node -p`
  - Crea `dist-release/$TARGET/`
  - Para cada package (installer, engram, gga): compila con `bun build --compile --target=bun-$TARGET --define "PEDRITO_VERSION=..."`
  - Nombres de salida: `pedrito-<target>`, `pedrito-engram-<target>`, `gga-<target>` (+ `.exe` en windows)
  - `chmod +x` los binarios resultantes

- [ ] **7.5** Actualizar `packages/installer/package.json` — añadir scripts `build:macos-arm64`, `build:macos-x64`, `build:linux-x64`, `build:windows-x64`
  - Cada uno usa `bun build --compile --target=bun-<target> --define "PEDRITO_VERSION=..." --outfile dist/pedrito-<target>`

- [ ] **7.6** Actualizar `packages/engram/package.json` — idem, binario `pedrito-engram-<target>`

- [ ] **7.7** Actualizar `packages/gga/package.json` — idem, binario `gga-<target>`

- [ ] **7.8** Actualizar `package.json` raíz — añadir scripts `build:release:macos-arm64`, `build:release:macos-x64`, `build:release:linux-x64`, `build:release:windows-x64`
  - Cada uno llama `scripts/build-release.sh <target>` o hace `bun run --filter '*' build:<target>`

## GitHub Actions — release.yml

- [ ] **7.9** Crear `.github/workflows/release.yml`
  - Trigger: `push: tags: ['v*']`
  - `permissions: contents: write`
  - Job `build` con matrix de 4 plataformas (macos-latest, macos-13, ubuntu-latest, windows-latest)
  - Steps por job:
    1. `actions/checkout@v4`
    2. `oven-sh/setup-bun@v2` con `bun-version: 1.3.10`
    3. `bun install --frozen-lockfile`
    4. Ejecutar `scripts/build-release.sh <target>`
    5. Generar checksums SHA256 para cada binario (`sha256sum` o `shasum -a 256`)
    6. Crear tar.gz de los 3 binarios (solo en macOS jobs, para Homebrew)
    7. Generar SHA256 del tar.gz
    8. Ad-hoc code signing (solo macOS): `codesign --deep --force --sign -` en cada binario
    9. `actions/upload-artifact@v4` con todos los archivos del directorio de release
  - Job `release` (needs: build):
    1. `actions/download-artifact@v4` para descargar todos los artifacts
    2. Extraer versión del tag: `VERSION=${GITHUB_REF_NAME#v}`
    3. `softprops/action-gh-release@v2` con files de todos los artifacts, body con instrucciones de instalación, `prerelease: ${{ contains(github.ref_name, '-') }}`

## Curl installer

- [ ] **7.10** Crear `scripts/install.sh`
  - Detección de OS (darwin→macos, linux→linux) y ARCH (arm64/aarch64→arm64, x86_64→x64)
  - Si OS o ARCH no soportados → error claro con lista de plataformas soportadas
  - Resolver versión `latest` via GitHub API si `PEDRITO_VERSION` no está en env
  - Para cada binario (pedrito, pedrito-engram, gga): descargar + descargar .sha256
  - Verificar checksum con `sha256sum --check` (Linux) o `shasum -a 256 --check` (macOS)
  - Si falla checksum → abortar con error, no instalar
  - Detectar si `$INSTALL_DIR` requiere sudo, aplicar si es necesario
  - Mover binarios a `$INSTALL_DIR` (default `/usr/local/bin`)
  - Imprimir mensaje de éxito + next steps (`pedrito install`)

- [ ] **7.11** Hacer `scripts/install.sh` ejecutable y testearlo en macOS + Linux
  - Test en macOS ARM64: descarga, verifica checksum, instala correctamente
  - Test en Ubuntu (Docker): `docker run --rm ubuntu bash -c "apt-get install -y curl && curl -sL .../install.sh | sh"`
  - Test de fallo de checksum: corromper el `.sha256` → verificar que no instala

## Homebrew Formula

- [ ] **7.12** Crear `Formula/pedrito.rb`
  - `desc`, `homepage`, `version`, `license "MIT"`
  - `on_macos` con bloques `on_arm` y `on_intel`
  - URLs apuntando al tar.gz del GitHub Release
  - SHA256 con `"PLACEHOLDER_<ARCH>_SHA256"` (se actualizan en cada release)
  - `def install`: `bin.install` los 3 binarios
  - `test do`: `assert_match version.to_s, shell_output("#{bin}/pedrito version")`
  - Validar sintaxis: `ruby -c Formula/pedrito.rb`

- [ ] **7.13** Crear `docs/homebrew-tap-setup.md` (en `kit/docs/`)
  - Instrucciones para crear el tap repo `pedrito-tap` en GitHub
  - Cómo copiar `Formula/pedrito.rb` al tap
  - Cómo actualizar la formula tras un nuevo release (manual y futuro-automático)
  - Cómo testear: `brew install --build-from-source` + `brew test pedrito`

## `pedrito version` — comando

- [ ] **7.14** Actualizar `pedrito version` en `packages/installer/src/main.ts`
  - Mostrar `pedrito v<VERSION>`
  - Intentar `pedrito-engram version` via spawn → mostrar resultado o `not installed`
  - Intentar `gga version` via spawn → mostrar resultado o `not installed`
  - Mostrar versión del kit: leer `kit/CHANGELOG.md` primera línea o `kit/package.json` si existe

## Actualizar build.yml existente

- [ ] **7.15** Actualizar `.github/workflows/build.yml`
  - Añadir `env: FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` si no está (ya está)
  - Verificar que `bun run build` sigue funcionando (compila binarios para la plataforma local)
  - No necesita `--compile --target` — el build de desarrollo compila para el runner nativo
  - Añadir step de smoke test: ejecutar `./packages/installer/dist/pedrito version` tras build

## Tests y verificación

- [ ] **7.16** Verificar que `release.yml` es YAML válido: `yamllint .github/workflows/release.yml`
- [ ] **7.17** Test en dry-run del workflow: crear tag `v4.0.0-test` en una rama, verificar que el workflow inicia y los jobs de build pasan
- [ ] **7.18** Verificar `scripts/install.sh` en macOS ARM64 — instala los 3 binarios
- [ ] **7.19** Verificar `scripts/install.sh` en Linux x64 — instala sin error
- [ ] **7.20** Verificar que el binario linux-x64 corre sin Bun instalado (`unset PATH` para Bun, ejecutar binario)
- [ ] **7.21** Verificar `pedrito version` muestra los 3 componentes
- [ ] **7.22** Verificar `ruby -c Formula/pedrito.rb` no da errores de sintaxis
- [ ] **7.23** Cerrar spec: completar `summary.md`, marcar status Complete

---

## Orden de implementación recomendado

```
7.1–7.3 (versión centralizada — pre-requisito para build correcto)
  → 7.4–7.8 (build scripts)
  → 7.9 (release.yml)               ← depende de build scripts
  → 7.10–7.11 (install.sh)          ← independiente de release.yml
  → 7.12–7.13 (Homebrew)            ← independiente
  → 7.14 (pedrito version)
  → 7.15 (actualizar build.yml)
  → 7.16–7.23 (verificación)
```

**MVP mínimo:** 7.1–7.4 + 7.9 + 7.10 — versión centralizada + release automation + curl installer.
Homebrew (7.12) es el polish final.
