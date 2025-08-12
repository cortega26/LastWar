#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: $0 <goal_id> -- <command...>"
  exit 2
fi

GOAL_ID="$1"
shift
if [ "$1" != "--" ]; then
  echo "Usage: $0 <goal_id> -- <command...>"
  exit 2
fi
shift

LOCKDIR=".locks"
mkdir -p "$LOCKDIR"
LOCKFILE="$LOCKDIR/${GOAL_ID}.lock"

if [ -e "$LOCKFILE" ]; then
  echo "[lock] Goal $GOAL_ID is locked. If stale, remove $LOCKFILE"
  exit 3
fi

{
  echo "owner=$(whoami)"
  echo "pid=$$"
  echo "started=$(date -Iseconds)"
} > "$LOCKFILE"

cleanup() { rm -f "$LOCKFILE"; }
trap cleanup EXIT INT TERM

"$@"
