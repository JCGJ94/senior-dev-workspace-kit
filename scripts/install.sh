#!/usr/bin/env sh
# scripts/install.sh — Install Pedrito binaries on macOS or Linux.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/OWNER/REPO/main/scripts/install.sh | sh
#
# Env vars (optional):
#   PEDRITO_VERSION   Pin a specific version (default: latest)
#   INSTALL_DIR       Where to install binaries (default: /usr/local/bin)
#   GITHUB_REPO       GitHub repo (default: auto-detected from script URL)
set -eu

GITHUB_REPO="${GITHUB_REPO:-josec/pedrito}"
INSTALL_DIR="${INSTALL_DIR:-/usr/local/bin}"

# ── Platform detection ────────────────────────────────────────────────────────
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Darwin) OS_NAME="macos" ;;
  Linux)  OS_NAME="linux" ;;
  *)
    echo "Error: unsupported OS '$OS'. Pedrito supports macOS and Linux."
    echo "       For Windows, download the binary from GitHub Releases directly."
    exit 1
    ;;
esac

case "$ARCH" in
  arm64|aarch64) ARCH_NAME="arm64" ;;
  x86_64|amd64)  ARCH_NAME="x64" ;;
  *)
    echo "Error: unsupported architecture '$ARCH'."
    echo "       Supported: arm64 (Apple Silicon, AWS Graviton), x86_64"
    exit 1
    ;;
esac

if [ "$OS_NAME" = "linux" ] && [ "$ARCH_NAME" = "arm64" ]; then
  echo "Error: Linux ARM64 is not yet supported. Supported platforms:"
  echo "       macos-arm64, macos-x64, linux-x64"
  exit 1
fi

TARGET="${OS_NAME}-${ARCH_NAME}"

# ── Resolve version ───────────────────────────────────────────────────────────
if [ -z "${PEDRITO_VERSION:-}" ]; then
  echo "→ Resolving latest version..."
  PEDRITO_VERSION="$(curl -fsSL "https://api.github.com/repos/${GITHUB_REPO}/releases/latest" \
    | grep '"tag_name"' \
    | sed 's/.*"tag_name": *"v\([^"]*\)".*/\1/')"
  if [ -z "$PEDRITO_VERSION" ]; then
    echo "Error: could not resolve latest version from GitHub API."
    echo "       Set PEDRITO_VERSION env var to install a specific version."
    exit 1
  fi
fi

VERSION="$PEDRITO_VERSION"
BASE_URL="https://github.com/${GITHUB_REPO}/releases/download/v${VERSION}"

echo "→ Installing Pedrito v${VERSION} for ${TARGET}..."

# ── Temp directory ────────────────────────────────────────────────────────────
TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

# ── Download + verify each binary ─────────────────────────────────────────────
download_and_verify() {
  local NAME="$1"
  local URL="${BASE_URL}/${NAME}"
  local SHA_URL="${URL}.sha256"

  echo "  → downloading ${NAME}..."
  curl -fsSL -o "${TMPDIR}/${NAME}" "$URL"
  curl -fsSL -o "${TMPDIR}/${NAME}.sha256" "$SHA_URL"

  echo "  → verifying checksum..."
  cd "$TMPDIR"
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum --check "${NAME}.sha256" --quiet
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 --check "${NAME}.sha256" --quiet
  else
    echo "Warning: neither sha256sum nor shasum found — skipping checksum verification."
  fi
  cd - > /dev/null

  chmod +x "${TMPDIR}/${NAME}"
}

download_and_verify "pedrito-${TARGET}"
download_and_verify "pedrito-engram-${TARGET}"
download_and_verify "gga-${TARGET}"

# ── Install binaries ──────────────────────────────────────────────────────────
echo "→ Installing to ${INSTALL_DIR}..."

install_binary() {
  local SRC="$1"
  local DEST_NAME="$2"
  local DEST="${INSTALL_DIR}/${DEST_NAME}"

  if [ -w "$INSTALL_DIR" ]; then
    mv "${TMPDIR}/${SRC}" "$DEST"
  else
    echo "   (sudo required for ${INSTALL_DIR})"
    sudo mv "${TMPDIR}/${SRC}" "$DEST"
  fi
  echo "   ✓ ${DEST}"
}

install_binary "pedrito-${TARGET}" "pedrito"
install_binary "pedrito-engram-${TARGET}" "pedrito-engram"
install_binary "gga-${TARGET}" "gga"

# ── Success ───────────────────────────────────────────────────────────────────
echo ""
echo "✓ Pedrito v${VERSION} installed successfully!"
echo ""
echo "  pedrito version    → verify installation"
echo "  pedrito install    → set up Pedrito in a project"
echo "  pedrito --help     → see all commands"
echo ""
