#!/usr/bin/env bash
# scripts/build-release.sh — Compile Pedrito binaries for a target platform.
#
# Usage: ./scripts/build-release.sh <target>
#   target: macos-arm64 | macos-x64 | linux-x64 | windows-x64
#
# Output: dist-release/<target>/
#   pedrito-<target>              (or .exe on Windows)
#   pedrito-engram-<target>
#   gga-<target>
#   *.sha256                      (SHA-256 checksums)
#   pedrito-<target>.tar.gz       (macOS only, for Homebrew)
#   pedrito-<target>.tar.gz.sha256

set -euo pipefail

TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "Usage: $0 <target>"
  echo "  Targets: macos-arm64 | macos-x64 | linux-x64 | windows-x64"
  exit 1
fi

case "$TARGET" in
  macos-arm64|macos-x64|linux-x64|windows-x64) ;;
  *)
    echo "Error: unsupported target '$TARGET'"
    echo "  Targets: macos-arm64 | macos-x64 | linux-x64 | windows-x64"
    exit 1
    ;;
esac

# Read version from root package.json
VERSION=$(node -p "require('./package.json').version" 2>/dev/null \
  || bun -e "console.log(require('./package.json').version)" 2>/dev/null \
  || echo "5.0.0")

echo "▶ Building Pedrito v${VERSION} for ${TARGET}..."

OUTDIR="dist-release/${TARGET}"
mkdir -p "$OUTDIR"

BUN_TARGET="bun-${TARGET}"
DEFINE="PEDRITO_VERSION=\"${VERSION}\""

EXT=""
if [[ "$TARGET" == "windows-x64" ]]; then
  EXT=".exe"
fi

# ── installer (pedrito CLI) ──────────────────────────────────────────────────
echo "  → pedrito"
bun build packages/installer/src/cli.ts \
  --compile \
  --target="${BUN_TARGET}" \
  --define "${DEFINE}" \
  --outfile "${OUTDIR}/pedrito-${TARGET}${EXT}"

# ── engram ───────────────────────────────────────────────────────────────────
echo "  → pedrito-engram"
bun build packages/engram/src/main.ts \
  --compile \
  --target="${BUN_TARGET}" \
  --define "${DEFINE}" \
  --outfile "${OUTDIR}/pedrito-engram-${TARGET}${EXT}"

# ── gga ──────────────────────────────────────────────────────────────────────
echo "  → gga"
bun build packages/gga/src/main.ts \
  --compile \
  --target="${BUN_TARGET}" \
  --define "${DEFINE}" \
  --outfile "${OUTDIR}/gga-${TARGET}${EXT}"

# ── chmod (non-Windows) ──────────────────────────────────────────────────────
if [[ "$TARGET" != "windows-x64" ]]; then
  chmod +x "${OUTDIR}/pedrito-${TARGET}"
  chmod +x "${OUTDIR}/pedrito-engram-${TARGET}"
  chmod +x "${OUTDIR}/gga-${TARGET}"

  if [[ "$TARGET" == macos-* ]] && command -v codesign >/dev/null 2>&1; then
    echo "  → ad-hoc codesigning macOS binaries"
    codesign --force --sign - "${OUTDIR}/pedrito-${TARGET}" >/dev/null 2>&1 || true
    codesign --force --sign - "${OUTDIR}/pedrito-engram-${TARGET}" >/dev/null 2>&1 || true
    codesign --force --sign - "${OUTDIR}/gga-${TARGET}" >/dev/null 2>&1 || true
  fi
fi

# ── SHA-256 checksums ────────────────────────────────────────────────────────
echo "  → generating checksums"
cd "$OUTDIR"
for f in pedrito-${TARGET}${EXT} pedrito-engram-${TARGET}${EXT} gga-${TARGET}${EXT}; do
  if command -v sha256sum &>/dev/null; then
    sha256sum "$f" > "${f}.sha256"
  else
    shasum -a 256 "$f" > "${f}.sha256"
  fi
done

# ── tar.gz for Homebrew (macOS only) ─────────────────────────────────────────
if [[ "$TARGET" == macos-* ]]; then
  echo "  → creating tar.gz for Homebrew"
  TARBALL="pedrito-${TARGET}.tar.gz"
  tar -czf "${TARBALL}" \
    "pedrito-${TARGET}" \
    "pedrito-engram-${TARGET}" \
    "gga-${TARGET}"
  if command -v sha256sum &>/dev/null; then
    sha256sum "${TARBALL}" > "${TARBALL}.sha256"
  else
    shasum -a 256 "${TARBALL}" > "${TARBALL}.sha256"
  fi
fi

cd - > /dev/null
echo "✓ Build complete → ${OUTDIR}/"
ls -lh "${OUTDIR}/"
