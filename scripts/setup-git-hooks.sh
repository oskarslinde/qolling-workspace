#!/usr/bin/env bash

set -euo pipefail

workspace_root="$(git rev-parse --show-toplevel)"
git -C "${workspace_root}" config core.hooksPath .githooks

echo "Configured workspace Git hooks."
