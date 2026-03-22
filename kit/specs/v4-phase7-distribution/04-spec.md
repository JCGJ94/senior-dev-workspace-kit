# Spec Técnica — V4 Phase 7: Distribución Profesional

---

## 1. Versión Centralizada

### Problema actual

`VERSION = '4.0.0'` está hardcodeado en:
- `packages/installer/src/version.ts`
- `packages/engram/src/main.ts` (inline en el help text)
- `packages/gga/src/index.ts`

Cada release requiere actualizar 3 archivos manualmente.

### Solución: leer `package.json` raíz en build time

```typescript
// packages/installer/src/version.ts — nuevo contenido
import { readFileSync } from 'fs';
import { join } from 'path';

// En tiempo de compilación, Bun inlines el valor via import.meta.dir
// En binario compilado, usamos el valor quemado por bun build
const pkg = JSON.parse(
  readFileSync(join(import.meta.dir, '../../../package.json'), 'utf8')
) as { version: string };

export const VERSION = pkg.version;
```

**Alternativa más robusta para binarios compilados** (sin acceso al filesystem):

Usar el build script para inyectar la versión como constante quemada:

```bash
# En cada package, el build:release script pasa la versión como define
VERSION=$(node -p "require('./../../package.json').version")
bun build src/main.ts --compile \
  --define "PEDRITO_VERSION=\"$VERSION\"" \
  --outfile dist/pedrito
```

```typescript
// version.ts — usando define de Bun
declare const PEDRITO_VERSION: string;
export const VERSION = typeof PEDRITO_VERSION !== 'undefined'
  ? PEDRITO_VERSION
  : '4.0.0-dev';
```

### Scripts `build:release` en cada package

```json
// packages/installer/package.json — nuevos scripts
{
  "scripts": {
    "build": "bun build src/main.ts --compile --outfile dist/pedrito",
    "build:macos-arm64": "bun build src/main.ts --compile --target=bun-macos-arm64 --outfile dist/pedrito-macos-arm64",
    "build:macos-x64":   "bun build src/main.ts --compile --target=bun-macos-x64   --outfile dist/pedrito-macos-x64",
    "build:linux-x64":   "bun build src/main.ts --compile --target=bun-linux-x64   --outfile dist/pedrito-linux-x64",
    "build:windows-x64": "bun build src/main.ts --compile --target=bun-windows-x64 --outfile dist/pedrito-windows-x64.exe"
  }
}
```

Idem para `@pedrito/engram` (outfile: `pedrito-engram-<platform>`)
y `@pedrito/gga` (outfile: `gga-<platform>`).

Script helper en workspace root `package.json`:
```json
{
  "scripts": {
    "build:release:macos-arm64": "bun run --filter '*' build:macos-arm64",
    "build:release:linux-x64":   "bun run --filter '*' build:linux-x64"
  }
}
```

---

## 2. GitHub Actions — `release.yml`

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags: ['v*']

permissions:
  contents: write   # necesario para crear GitHub Release

jobs:
  build:
    name: Build ${{ matrix.target }}
    strategy:
      fail-fast: false
      matrix:
        include:
          - os: macos-latest   # macOS 14 — Apple Silicon
            target: macos-arm64
            bun_target: bun-macos-arm64

          - os: macos-13       # macOS 13 — Intel
            target: macos-x64
            bun_target: bun-macos-x64

          - os: ubuntu-latest
            target: linux-x64
            bun_target: bun-linux-x64

          - os: windows-latest
            target: windows-x64
            bun_target: bun-windows-x64

    runs-on: ${{ matrix.os }}
    env:
      FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true

    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.3.10

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Build binaries (${{ matrix.target }})
        run: bun run build:release:${{ matrix.target }}
        # Compila: pedrito-<target>, pedrito-engram-<target>, gga-<target>

      - name: Generate checksums
        shell: bash
        run: |
          cd dist-release/${{ matrix.target }}
          for f in *; do
            sha256sum "$f" > "$f.sha256"
          done

      - name: Sign binaries (macOS only)
        if: startsWith(matrix.os, 'macos')
        run: |
          codesign --deep --force --sign - dist-release/${{ matrix.target }}/pedrito-${{ matrix.target }}
          codesign --deep --force --sign - dist-release/${{ matrix.target }}/pedrito-engram-${{ matrix.target }}
          codesign --deep --force --sign - dist-release/${{ matrix.target }}/gga-${{ matrix.target }}
        # --sign - es ad-hoc signing (no requiere Apple Developer cert)
        # Evita "damaged binary" en macOS Gatekeeper para descarga directa

      - uses: actions/upload-artifact@v4
        with:
          name: binaries-${{ matrix.target }}
          path: dist-release/${{ matrix.target }}/

  release:
    name: Create GitHub Release
    needs: build
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: artifacts/

      - name: Extract version from tag
        run: echo "VERSION=${GITHUB_REF_NAME#v}" >> $GITHUB_ENV

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          name: "Pedrito v${{ env.VERSION }}"
          body: |
            ## Pedrito v${{ env.VERSION }}

            ### Installation

            **macOS / Linux (recommended):**
            ```bash
            curl -sL https://raw.githubusercontent.com/${{ github.repository }}/main/scripts/install.sh | sh
            ```

            **Homebrew:**
            ```bash
            brew tap ${{ github.repository_owner }}/pedrito
            brew install pedrito
            ```

            **Direct download:** See assets below for your platform.

            ---
            *Generated by GitHub Actions from tag `${{ github.ref_name }}`*
          files: artifacts/**/*
          draft: false
          prerelease: ${{ contains(github.ref_name, '-') }}
          # v4.0.0-beta.1 → prerelease: true
```

### Script de build para el release job

```bash
# scripts/build-release.sh
# Corre en cada runner, compila los 3 binarios para su target

TARGET=$1  # macos-arm64 | macos-x64 | linux-x64 | windows-x64
VERSION=$(node -p "require('./package.json').version")
OUTDIR="dist-release/$TARGET"
mkdir -p "$OUTDIR"

EXT=""
[ "$TARGET" = "windows-x64" ] && EXT=".exe"

for pkg in installer engram gga; do
  case $pkg in
    installer) BIN="pedrito";       SRC="packages/installer/src/main.ts" ;;
    engram)    BIN="pedrito-engram"; SRC="packages/engram/src/main.ts" ;;
    gga)       BIN="gga";           SRC="packages/gga/src/main.ts" ;;
  esac

  bun build "$SRC" \
    --compile \
    --target="bun-$TARGET" \
    --define "PEDRITO_VERSION=\"$VERSION\"" \
    --outfile "$OUTDIR/${BIN}-${TARGET}${EXT}"
done
```

---

## 3. Curl Installer — `scripts/install.sh`

```bash
#!/usr/bin/env bash
# Pedrito installer — curl -sL https://.../install.sh | sh
set -euo pipefail

PEDRITO_VERSION="${PEDRITO_VERSION:-latest}"
REPO="tu-user/pedrito"
INSTALL_DIR="${INSTALL_DIR:-/usr/local/bin}"

# ── Detección de plataforma ─────────────────────────────────────────────────
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case "$ARCH" in
  arm64|aarch64) ARCH="arm64" ;;
  x86_64|amd64)  ARCH="x64" ;;
  *) echo "Unsupported architecture: $ARCH" >&2; exit 1 ;;
esac

case "$OS" in
  darwin) OS="macos" ;;
  linux)  OS="linux" ;;
  *) echo "Unsupported OS: $OS" >&2; exit 1 ;;
esac

TARGET="${OS}-${ARCH}"

# ── Resolver versión ─────────────────────────────────────────────────────────
if [ "$PEDRITO_VERSION" = "latest" ]; then
  PEDRITO_VERSION=$(curl -sfL \
    "https://api.github.com/repos/${REPO}/releases/latest" \
    | grep '"tag_name"' | cut -d'"' -f4 | sed 's/^v//')
fi

BASE_URL="https://github.com/${REPO}/releases/download/v${PEDRITO_VERSION}"

# ── Descargar + verificar checksums ─────────────────────────────────────────
echo "Installing Pedrito v${PEDRITO_VERSION} for ${TARGET}..."

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

for BIN in "pedrito-${TARGET}" "pedrito-engram-${TARGET}" "gga-${TARGET}"; do
  echo "  Downloading ${BIN}..."
  curl -sfL "${BASE_URL}/${BIN}"       -o "${TMP}/${BIN}"
  curl -sfL "${BASE_URL}/${BIN}.sha256" -o "${TMP}/${BIN}.sha256"

  # Verificar checksum
  cd "$TMP"
  if command -v sha256sum &>/dev/null; then
    sha256sum --check "${BIN}.sha256" --status \
      || { echo "Checksum failed for ${BIN}" >&2; exit 1; }
  elif command -v shasum &>/dev/null; then
    shasum -a 256 --check "${BIN}.sha256" --status \
      || { echo "Checksum failed for ${BIN}" >&2; exit 1; }
  fi
  cd - >/dev/null

  chmod +x "${TMP}/${BIN}"
done

# ── Instalar ─────────────────────────────────────────────────────────────────
NEEDS_SUDO=""
[ ! -w "$INSTALL_DIR" ] && NEEDS_SUDO="sudo"

$NEEDS_SUDO mv "${TMP}/pedrito-${TARGET}"       "${INSTALL_DIR}/pedrito"
$NEEDS_SUDO mv "${TMP}/pedrito-engram-${TARGET}" "${INSTALL_DIR}/pedrito-engram"
$NEEDS_SUDO mv "${TMP}/gga-${TARGET}"            "${INSTALL_DIR}/gga"

echo ""
echo "✓ Pedrito v${PEDRITO_VERSION} installed to ${INSTALL_DIR}"
echo ""
echo "Next steps:"
echo "  pedrito install    # Set up your AI workspace"
```

---

## 4. Homebrew Formula — `Formula/pedrito.rb`

Este archivo vive en el tap repo (`github.com/tu-user/pedrito-tap`).
Fase 7 crea el archivo localmente + documenta cómo crear el tap repo.

```ruby
# Formula/pedrito.rb
class Pedrito < Formula
  desc "AI Agent Workspace Kit — governance meets real tooling"
  homepage "https://github.com/tu-user/pedrito"
  version "4.0.0"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/tu-user/pedrito/releases/download/v#{version}/pedrito-macos-arm64.tar.gz"
      sha256 "PLACEHOLDER_ARM64_SHA256"
    end
    on_intel do
      url "https://github.com/tu-user/pedrito/releases/download/v#{version}/pedrito-macos-x64.tar.gz"
      sha256 "PLACEHOLDER_X64_SHA256"
    end
  end

  def install
    bin.install "pedrito"
    bin.install "pedrito-engram"
    bin.install "gga"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/pedrito version")
  end
end
```

**Tar.gz para Homebrew:** Homebrew necesita un archive, no el binario suelto.
El `release.yml` debe crear `.tar.gz` con los 3 binarios juntos por plataforma macOS.

### Script para generar tar.gz en el release job (macOS only):

```bash
# Dentro del step de macOS en release.yml
cd dist-release/${{ matrix.target }}
tar czf pedrito-${{ matrix.target }}.tar.gz \
  pedrito-${{ matrix.target }} \
  pedrito-engram-${{ matrix.target }} \
  gga-${{ matrix.target }}
sha256sum pedrito-${{ matrix.target }}.tar.gz > pedrito-${{ matrix.target }}.tar.gz.sha256
```

### Workflow de actualización de la Formula

Cuando se crea un release:
1. Obtener los SHA256 de los tar.gz de macOS desde el release
2. Actualizar `Formula/pedrito.rb` en el tap repo con las URLs y checksums
3. Esto puede automatizarse con un step adicional en `release.yml` que hace un commit al tap repo (Fase 7+ enhancement)

---

## 5. `pedrito version` — versiones de componentes

```typescript
// En packages/installer/src/main.ts, subcomando `version`

async function cmdVersion(): Promise<void> {
  const engramVersion = await getEngramVersion();
  const ggaVersion = await getGGAVersion();

  console.log(`pedrito        v${VERSION}`);
  console.log(`pedrito-engram ${engramVersion}`);
  console.log(`gga            ${ggaVersion}`);
  console.log(`kit            ${await getKitVersion()}`);
}

// Obtener versión de engram: llamar /health y parsear o ejecutar pedrito-engram --version
async function getEngramVersion(): Promise<string> {
  try {
    // Si Engram está corriendo:
    const res = await fetch('http://localhost:7437/health', { signal: AbortSignal.timeout(1000) });
    const data = await res.json() as { version?: string };
    if (data.version) return `v${data.version} (running)`;
  } catch { /* not running */ }

  // Si no está corriendo, ejecutar el binario con --version
  try {
    const result = Bun.spawnSync(['pedrito-engram', 'version']);
    return result.stdout.toString().trim() || 'not found';
  } catch {
    return 'not installed';
  }
}
```

Añadir `version` subcommand a `pedrito-engram` y `gga`:
- `packages/engram/src/main.ts` → case `'version'`: `console.log(VERSION)`
- `packages/gga/src/main.ts` → subcomando `version` en Commander

---

## Estructura de archivos nuevos/modificados

```
.github/workflows/
├── build.yml              ← Existente, no modificar (sigue corriendo en cada push)
└── release.yml            ← NUEVO — solo en tags v*

scripts/
├── build-release.sh       ← NUEVO — compila 3 binarios para un target
└── install.sh             ← NUEVO — curl installer

Formula/
└── pedrito.rb             ← NUEVO — Homebrew formula (va al tap repo)

packages/installer/
├── src/version.ts         ← Modificar — usar PEDRITO_VERSION define
└── package.json           ← Modificar — añadir scripts build:<target>

packages/engram/
└── package.json           ← Modificar — añadir scripts build:<target>

packages/gga/
└── package.json           ← Modificar — añadir scripts build:<target>

package.json (root)        ← Modificar — añadir scripts build:release:*
```

---

## Decisiones de Diseño

### ¿Por qué `--define` para inyectar VERSION en lugar de leer el package.json en runtime?
Los binarios compilados con `bun build --compile` son self-contained. En runtime no tienen
acceso al filesystem del repo. El `--define` quema el valor en compile time, que es cuando
sí tenemos acceso. Es el patrón correcto para constantes en binarios.

### ¿Por qué ad-hoc signing en macOS y no Developer ID?
Developer ID requiere una Apple Developer account y un certificado de $99/año. Ad-hoc
signing (`--sign -`) satisface el requirement de Gatekeeper para binarios descargados
directamente sin pasar por el App Store. Para `brew install` el usuario acepta el tap
y Homebrew maneja el quarantine. Es suficiente para V4.

### ¿Por qué `softprops/action-gh-release` y no la CLI de gh?
`softprops/action-gh-release` maneja bien el upload de múltiples artifacts de forma
paralela, genera el release body automáticamente, y soporta prereleases via `prerelease:`.
La CLI de `gh` requeriría scripting manual más frágil.

### ¿Por qué el tap en repo separado (`pedrito-tap`) y no en este repo?
Homebrew espera que los taps sean repos con solo formulas (convención fuerte de la
comunidad). Mezclarlos en el repo principal complica el `brew update` y puede
causar rate limiting. El tap separado es mínimo: un solo archivo `Formula/pedrito.rb`.

### ¿Por qué no publicar en Homebrew core?
Homebrew core tiene requisitos de popularidad (mínimo 75 forks o 150 stars antes de
considerar). Para V4 launch, el tap propio es la vía correcta. Migrar a core es
un upgrade natural si la adopción lo justifica.

---

## Criterios de Verificación

| # | Check | Cómo verificar |
|---|---|---|
| 1 | `release.yml` existe y es válido YAML | `gh workflow list` o `yamllint` |
| 2 | Push de tag `v4.0.0-test` dispara el workflow | GitHub Actions tab |
| 3 | Workflow genera 12 binarios + 12 checksums en el release | Ver assets del release |
| 4 | `scripts/install.sh` instala en macOS ARM64 sin error | Ejecutar en máquina limpia |
| 5 | `scripts/install.sh` instala en Ubuntu x64 sin error | Ejecutar en Docker ubuntu |
| 6 | SHA256 verificado correctamente — instalar con checksum corrupto falla | Modificar checksum a mano |
| 7 | `pedrito version` muestra versiones de los 3 componentes | Ejecutar en terminal |
| 8 | Binario macOS ARM64 pasa `codesign --verify` | `codesign --verify pedrito` |
| 9 | `Formula/pedrito.rb` tiene sintaxis Ruby válida | `ruby -c Formula/pedrito.rb` |
| 10 | Binario Linux x64 corre en Ubuntu sin Bun instalado | `which bun && hash -r bun; ./pedrito version` |
