#!/usr/bin/env bash
set -euo pipefail

phase="init"
backend_dir=""

fail_phase() {
  local phase_name="$1"
  local message="$2"
  echo
  echo "FAILED at phase: ${phase_name}" >&2
  echo "${message}" >&2
  exit 1
}

run_phase() {
  local phase_name="$1"
  shift
  phase="${phase_name}"
  echo
  echo "==> Phase: ${phase_name}"
  "$@" || fail_phase "${phase_name}" "Command failed: $*"
}

validate_layout() {
  if [[ -d "zeus" ]]; then
    backend_dir="zeus"
  elif [[ -d "backend" ]]; then
    backend_dir="backend"
  else
    fail_phase "Validate project layout" "Neither 'zeus' nor 'backend' directory exists. Run from qolling root."
  fi

  [[ -d "hera" ]] || fail_phase "Validate project layout" "Missing 'hera' directory. Run from qolling root."
}

build_hera() {
  (
    cd hera || exit 1
    npm run build
  ) || fail_phase "Build Hera frontend" "Hera build failed."
}

build_backend() {
  (
    cd "${backend_dir}" || exit 1
    [[ -x "./mvnw" ]] || fail_phase "Build Zeus backend" "Missing executable Maven wrapper at '${backend_dir}/mvnw'."
    ./mvnw clean package -DskipTests
  ) || fail_phase "Build Zeus backend" "Maven package failed in '${backend_dir}'."
}

compose_build() {
  docker compose --env-file .env build || fail_phase "Docker compose build" "docker compose build failed."
}

compose_up() {
  docker compose --env-file .env up || fail_phase "Docker compose up" "docker compose up failed."
}

run_phase "Validate project layout" validate_layout
run_phase "Build Hera frontend" build_hera
run_phase "Build Zeus backend (skip tests)" build_backend
run_phase "Docker compose build" compose_build
run_phase "Docker compose up" compose_up
