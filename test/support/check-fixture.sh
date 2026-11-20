#!/usr/bin/env bash
# Builds a fixture twice (framework default, then a raised browser target),
# serves the static output over HTTP and runs the Chromium mode check.
# Usage: check-fixture.sh <fixture-dir> <build-command> <output-dir> <env-name> <raised-value>
set -u
dir="$1"; build="$2"; out="$3"; envname="$4"; raised="$5"
support="$(cd "$(dirname "$0")" && pwd)"; status=0
cd "$dir" || exit 2
for label in default raised; do
  [ "${ONLY_RAISED:-}" = 1 ] && [ "$label" = default ] && continue
  value=""; [ "$label" = raised ] && value="$raised"
  rm -rf "$out"
  env "$envname=$value" NEXT_TELEMETRY_DISABLED=1 NUXT_TELEMETRY_DISABLED=1 bash -c "$build" >"/tmp/claude-0/build-$label.log" 2>&1 \
    || { echo "BUILD FAIL ($label), see /tmp/claude-0/build-$label.log"; status=1; continue; }
  python3 -m http.server 4173 --directory "$out" >/dev/null 2>&1 & server=$!
  sleep 1
  css="$(find "$out" -name '*.css' -print0 | xargs -0 cat | grep -oE '\-\-color-background:[^;}]{0,60}' | head -1)"
  echo "== $(basename "$dir") / $label: ${css:-no --color-background found}"
  node "$support/check-modes.cjs" http://127.0.0.1:4173/index.html || status=1
  kill "$server"
done
exit "$status"
