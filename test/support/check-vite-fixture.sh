#!/usr/bin/env bash
# Builds a Vite-based fixture with Vite's default CSS target and with a raised
# target, serves each build over HTTP and runs the Chromium mode check.
# Usage: check-vite-fixture.sh <fixture-dir>
set -u
dir="$1"; support="$(cd "$(dirname "$0")" && pwd)"; status=0
cd "$dir" || exit 2
for case in "default:" "raised:chrome123,safari17.5,firefox120"; do
  label="${case%%:*}"; target="${case#*:}"
  CSS_TARGET="$target" npx vite build >/dev/null 2>&1 || { echo "BUILD FAIL ($label)"; status=1; continue; }
  python3 -m http.server 4173 --directory dist >/dev/null 2>&1 & server=$!
  sleep 1
  echo "== $(basename "$dir") / $label target: $(grep -oE '\-\-color-background:[^;}]{0,60}' dist/assets/*.css | head -1)"
  node "$support/check-modes.cjs" http://127.0.0.1:4173/index.html || status=1
  kill "$server"
done
exit "$status"
