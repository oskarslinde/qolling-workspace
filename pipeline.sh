#!/usr/bin/env bash

set -u
set -o pipefail

run_tests=true
hera_prod=false

prompt_yes_no() {
  local prompt="$1"
  local default_answer="$2"
  local answer=""

  if [[ ! -t 0 ]]; then
    echo "${prompt} ${default_answer} (non-interactive default)"
    [[ "${default_answer}" == "Y" ]]
    return
  fi

  while true; do
    if ! IFS= read -r -p "${prompt} [Y/N]: " answer; then
      answer="${default_answer}"
      echo "${default_answer}"
    fi

    case "${answer}" in
      [Yy]) return 0 ;;
      [Nn]) return 1 ;;
      *) echo "Please answer Y or N." ;;
    esac
  done
}

echo "Qolling pipeline configuration"
if prompt_yes_no "Run backend unit tests?" "Y"; then
  run_tests=true
else
  run_tests=false
fi
if prompt_yes_no "Build Hera for production?" "N"; then
  hera_prod=true
else
  hera_prod=false
fi
if [[ "${run_tests}" == true ]]; then echo "Tests: enabled"; else echo "Tests: skipped"; fi
if [[ "${hera_prod}" == true ]]; then echo "Hera: production-build"; else echo "Hera: development-server"; fi
echo
phase="init"
backend_dir=""
hera_dev_pid=""
hera_dev_port="${HERA_DEV_PORT:-5173}"

source "./scripts/hera-dev-server.sh"

cleanup() {
  if [[ -n "${hera_dev_pid}" ]] && kill -0 "${hera_dev_pid}" >/dev/null 2>&1; then
    echo
    echo "Stopping Hera dev server..."
    kill "${hera_dev_pid}" >/dev/null 2>&1 || true
    wait "${hera_dev_pid}" 2>/dev/null || true
  fi
}

trap cleanup EXIT

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
  [[ -f ".env.dev" ]] || fail_phase "Validate project layout" "Missing .env.dev in current folder."

  if [[ -d "backend" ]]; then
    backend_dir="backend"
  elif [[ -d "zeus" ]]; then
    backend_dir="zeus"
  else
    fail_phase "Validate project layout" "Neither 'backend' nor 'zeus' directory exists. Run this script from qolling root."
  fi

  [[ -d "hera" ]] || fail_phase "Validate project layout" "Missing 'hera' directory. Run from qolling root."
}

install_hera_dependencies() {
  local lockfile="hera/package-lock.json"
  local install_marker="hera/node_modules/.qolling-package-lock.sha256"
  local current_lock_checksum=""

  [[ -f "${lockfile}" ]] || fail_phase "Install Hera dependencies" "Missing ${lockfile}."
  current_lock_checksum="$(sha256sum "${lockfile}")" || fail_phase "Install Hera dependencies" "Could not checksum ${lockfile}."

  if [[ "${HERA_FORCE_INSTALL:-false}" != "true" ]] \
    && [[ -d "hera/node_modules" ]] \
    && [[ -f "${install_marker}" ]] \
    && [[ "$(<"${install_marker}")" == "${current_lock_checksum}" ]]; then
    echo "Hera dependencies already match package-lock.json; skipping npm ci."
    return 0
  fi

  (
    cd hera || exit 1
    npm ci
    printf '%s\\n' "${current_lock_checksum}" > "node_modules/.qolling-package-lock.sha256"
  ) || fail_phase "Install Hera dependencies" "Failed to install frontend dependencies in hera."
}

fix_hera_lint() {
  (
    cd hera || exit 1
    npm run lint:fix
  ) || fail_phase "Fix Hera lint issues" "npm run lint:fix failed in hera."
}

check_hera_lint() {
  (
    cd hera || exit 1
    npm run lint
  ) || fail_phase "Check Hera lint" "npm run lint failed in hera."
}

build_hera_production() {
  (
    cd hera || exit 1
    npm run build
    [[ -f "dist/index.html" ]] || exit 1
  ) || fail_phase "Build Hera production bundle" "Hera production build failed or did not create hera/dist/index.html."
  echo "Hera production bundle created in hera/dist."
}

start_hera_dev_server() {
  (
    cd hera || exit 1
    npm run dev -- --port "${hera_dev_port}" --strictPort
  ) &
  hera_dev_pid="$!"

  sleep 2

  if ! kill -0 "${hera_dev_pid}" >/dev/null 2>&1; then
    wait "${hera_dev_pid}" || true
    hera_dev_pid=""
    fail_phase "Start Hera dev server" "npm run dev exited before the pipeline could continue."
  fi

  echo "Hera dev server started in background on port ${hera_dev_port} (pid ${hera_dev_pid})."
}

check_docker() {
  if docker info >/dev/null 2>&1; then
    return 0
  fi

  echo "Docker is not reachable. Attempting to start Docker..."
  start_docker
  wait_for_docker 120 || fail_phase "Check Docker is running" "Docker is not reachable after auto-start attempt. Open Docker manually and retry."
}

start_docker() {
  local uname_out
  uname_out="$(uname -s 2>/dev/null || echo "")"

  case "${uname_out}" in
    Darwin)
      open -a Docker >/dev/null 2>&1 || true
      ;;
    MINGW*|MSYS*|CYGWIN*)
      powershell.exe -NoProfile -Command "Start-Process 'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe'" >/dev/null 2>&1 || true
      ;;
    Linux)
      if command -v systemctl >/dev/null 2>&1; then
        systemctl --user start docker-desktop >/dev/null 2>&1 || true
        sudo systemctl start docker >/dev/null 2>&1 || true
      fi
      ;;
  esac
}

wait_for_docker() {
  local timeout_seconds="$1"
  local waited=0

  while (( waited < timeout_seconds )); do
    if docker info >/dev/null 2>&1; then
      echo "Docker is ready."
      return 0
    fi

    sleep 2
    waited=$((waited + 2))
  done

  return 1
}

run_backend_maven() {
  [[ -x "./mvnw" ]] || fail_phase "${phase}" "Missing executable Maven wrapper at '${backend_dir}/mvnw'."
  ./mvnw "$@"
}

teardown_zeus_containers() {
  local ids
  ids="$(docker ps -a --filter "name=zeus" --format "{{.ID}}")" || fail_phase "Tear down existing zeus container(s)" "Failed to query containers via docker ps."

  if [[ -z "${ids}" ]]; then
    echo "No existing zeus containers found."
    return 0
  fi

  while IFS= read -r id; do
    [[ -n "${id}" ]] || continue
    echo "Removing container: ${id}"
    docker rm -f "${id}" >/dev/null || fail_phase "Tear down existing zeus container(s)" "Failed to remove container id ${id}."
  done <<< "${ids}"
}

build_backend() {
  (
    cd "${backend_dir}" || exit 1
    run_backend_maven clean package -DskipTests
  ) || fail_phase "Build backend package (skip tests)" "Maven package command failed in '${backend_dir}'."
}

apply_backend_spotless() {
  (
    cd "${backend_dir}" || exit 1
    run_backend_maven spotless:apply
  ) || fail_phase "Apply backend Spotless formatting" "Maven wrapper spotless:apply failed in '${backend_dir}'."
}

run_backend_unit_tests() {
  (
    cd "${backend_dir}" || exit 1
    run_backend_maven -Punit-tests test
  ) || fail_phase "Run backend unit tests" "Maven wrapper -Punit-tests test failed in '${backend_dir}'."
}

export_swagger_snapshots() {
  (
    cd "${backend_dir}" || exit 1
    bash ./scripts/export-swagger-from-running-zeus.sh
  ) || fail_phase "Export Swagger snapshots" "Swagger snapshot export failed in '${backend_dir}'."
}

compose_build() {
  if [[ "${hera_prod}" == true ]]; then
    docker compose --env-file .env.dev build zeus hera || fail_phase "Docker compose build" "docker compose build zeus hera failed."
  else
    docker compose --env-file .env.dev build zeus || fail_phase "Docker compose build" "docker compose build zeus failed."
  fi
}

compose_up_zeus_detached() {
  if [[ "${hera_prod}" == true ]]; then
    docker compose --env-file .env.dev up -d zeus hera || fail_phase "Docker compose up services" "docker compose up -d zeus hera failed."
  else
    docker compose --env-file .env.dev up -d zeus || fail_phase "Docker compose up zeus" "docker compose up -d zeus failed."
  fi
}

wait_for_zeus_container() {
  local timeout_seconds="${ZEUS_STARTUP_TIMEOUT_SECONDS:-180}"
  local waited=0
  local container_id=""
  local running=""
  local health=""
  local status=""

  echo "Waiting for Zeus container to be running/healthy..."

  while (( waited < timeout_seconds )); do
    container_id="$(docker compose --env-file .env.dev ps -q zeus 2>/dev/null || true)"

    if [[ -n "${container_id}" ]]; then
      running="$(docker inspect -f '{{.State.Running}}' "${container_id}" 2>/dev/null || true)"
      health="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{end}}' "${container_id}" 2>/dev/null || true)"
      status="$(docker inspect -f '{{.State.Status}}' "${container_id}" 2>/dev/null || true)"

      if [[ "${running}" == "true" && ( -z "${health}" || "${health}" == "healthy" ) ]]; then
        echo "Zeus container is up${health:+ and ${health}}."
        return 0
      fi

      if [[ "${status}" == "exited" || "${status}" == "dead" ]]; then
        fail_phase "Wait for Zeus container" "Zeus container stopped while starting (status=${status})."
      fi
    fi

    sleep 2
    waited=$((waited + 2))
  done

  fail_phase "Wait for Zeus container" "Zeus container was not running/healthy after ${timeout_seconds} seconds."
}

compose_attach_zeus() {
  docker compose --env-file .env.dev up zeus || fail_phase "Docker compose up zeus" "docker compose up zeus failed."
}

run_phase "Validate project layout" validate_layout
run_phase "Check MongoDB Atlas DNS" node ./scripts/check-mongodb-atlas-dns.mjs
run_phase "Stop existing Hera dev server" stop_existing_hera_dev_server "${hera_dev_port}"
run_phase "Install Hera dependencies" install_hera_dependencies
run_phase "Fix Hera lint issues" fix_hera_lint
run_phase "Check Hera lint" check_hera_lint
if [[ "${hera_prod}" == true ]]; then
  run_phase "Build Hera production bundle" build_hera_production
fi
run_phase "Check Docker is running" check_docker
run_phase "Tear down existing zeus container(s)" teardown_zeus_containers
run_phase "Apply backend Spotless formatting" apply_backend_spotless
if [[ "${run_tests}" == true ]]; then
  run_phase "Run backend unit tests" run_backend_unit_tests
else
  echo
  echo "==> Phase: Run backend unit tests (skipped by selection)"
fi
run_phase "Build backend package (skip tests)" build_backend
run_phase "Docker compose build" compose_build
run_phase "Docker compose up Zeus" compose_up_zeus_detached
run_phase "Wait for Zeus container" wait_for_zeus_container
run_phase "Export Swagger snapshots" export_swagger_snapshots
if [[ "${hera_prod}" == true ]]; then
  echo
  echo "Hera is served by Nginx at http://localhost:3000 and Zeus is running detached."
else
  run_phase "Start Hera dev server" start_hera_dev_server
  run_phase "Docker compose attach Zeus" compose_attach_zeus
fi

echo
echo "All phases completed successfully."
