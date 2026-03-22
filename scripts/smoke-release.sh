#!/usr/bin/env bash
# Run a local smoke test against a compiled release target.

set -euo pipefail

TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "Usage: $0 <target>"
  echo "  Targets: macos-arm64 | macos-x64 | linux-x64 | windows-x64"
  exit 1
fi

OUTDIR="dist-release/${TARGET}"
EXT=""
if [[ "$TARGET" == "windows-x64" ]]; then
  EXT=".exe"
fi

for bin in "pedrito-${TARGET}${EXT}" "pedrito-engram-${TARGET}${EXT}" "gga-${TARGET}${EXT}"; do
  if [[ ! -f "${OUTDIR}/${bin}" ]]; then
    echo "Missing artifact: ${OUTDIR}/${bin}"
    exit 1
  fi
done

if [[ "$TARGET" == "windows-x64" ]]; then
  echo "Windows artifacts present; skipping execution smoke test on non-Windows host."
  exit 0
fi

"${OUTDIR}/pedrito-${TARGET}" version >/dev/null
"${OUTDIR}/pedrito-engram-${TARGET}" version >/dev/null
"${OUTDIR}/gga-${TARGET}" version >/dev/null

echo "Smoke test passed for ${TARGET}"
