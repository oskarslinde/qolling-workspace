#!/usr/bin/env bash

set -u
set -o pipefail

phase="init"
hera_dev_port="${HERA_DEV_PORT:-5173}"

source "./scripts/hera-dev-server.sh"

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
  [[ -d "zeus" ]] || fail_phase "Validate project layout" "Missing 'zeus' directory. Run from qolling root."
  [[ -d "hera" ]] || fail_phase "Validate project layout" "Missing 'hera' directory. Run from qolling root."
  [[ -d "business-tests" ]] || fail_phase "Validate project layout" "Missing 'business-tests' directory. Run from qolling root."
}

install_hera_dependencies() {
  (
    cd hera || exit 1
    npm ci
  ) || fail_phase "Install Hera dependencies" "Failed to install frontend dependencies in hera."
}

install_business_tests_dependencies() {
  (
    cd business-tests || exit 1
    if [[ -f "package-lock.json" ]]; then
      npm ci || {
        echo "npm ci failed in business-tests, retrying with npm install..."
        npm install
      }
    else
      npm install
    fi
  ) || fail_phase "Install business-tests dependencies" "Failed to install dependencies in business-tests."
}

check_docker_running() {
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

check_zeus_container_up() {
  local running
  running="$(docker ps --filter "name=qolling-zeus" --format "{{.Names}}")" || fail_phase "Check qolling-zeus container is up" "Failed to query running containers."

  if [[ -z "${running}" ]]; then
    fail_phase "Check qolling-zeus container is up" "No running container matching 'qolling-zeus' was found."
  fi

  echo "Detected running zeus container(s):"
  echo "${running}"
}

run_be_unit_tests() {
  (
    cd zeus || exit 1
    ./mvnw -Punit-tests test
  ) || fail_phase "BE unit tests" "./mvnw -Punit-tests test failed."
}

run_be_spring_tests() {
  (
    cd zeus || exit 1
    ./mvnw -Pspring-tests test
  ) || fail_phase "BE spring tests" "./mvnw -Pspring-tests test failed."
}

run_be_testcontainers_tests() {
  (
    cd zeus || exit 1
    ./mvnw -Ptestcontainers-tests test
  ) || fail_phase "BE testcontainers tests" "./mvnw -Ptestcontainers-tests test failed."
}

run_hera_tests() {
  (
    cd hera || exit 1
    npm run test:ui:report
  ) || fail_phase "Hera frontend tests" "npm run test:ui:report failed."
}

run_business_tests() {
  (
    cd business-tests || exit 1
    mapfile -t spec_files < <(find tests -maxdepth 1 -name "*.spec.ts" ! -name "screenshots.spec.ts" -print | sort)
    if [[ ${#spec_files[@]} -eq 0 ]]; then
      echo "No business Playwright specs found after excluding screenshots.spec.ts"
      exit 1
    fi
    npx playwright test "${spec_files[@]}"
  ) || fail_phase "Business tests" "Playwright business tests failed in business-tests."
}

run_phase "Validate project layout" validate_layout
run_phase "Stop existing Hera dev server" stop_existing_hera_dev_server "${hera_dev_port}"
run_phase "Install Hera dependencies" install_hera_dependencies
run_phase "Install business-tests dependencies" install_business_tests_dependencies
run_phase "Check Docker is running" check_docker_running
run_phase "Check qolling-zeus container is up" check_zeus_container_up
run_phase "BE unit tests" run_be_unit_tests
run_phase "BE spring tests" run_be_spring_tests
run_phase "BE testcontainers tests" run_be_testcontainers_tests
run_phase "Hera frontend tests" run_hera_tests
run_phase "Business tests" run_business_tests

echo
echo "All phases completed successfully."
