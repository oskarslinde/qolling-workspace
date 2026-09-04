#!/usr/bin/env bash

set -u
set -o pipefail

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
  echo
  echo "==> Phase: ${phase_name}"
  "$@" || fail_phase "${phase_name}" "Command failed: $*"
}

validate_layout() {
  [[ -d "zeus" ]] || fail_phase "Validate project layout" "Missing 'zeus' directory. Run from qolling root."
  [[ -d "hera" ]] || fail_phase "Validate project layout" "Missing 'hera' directory. Run from qolling root."
}

install_hera_dependencies() {
  (
    cd hera || exit 1
    npm ci
  ) || fail_phase "Install Hera dependencies" "Failed to install frontend dependencies in hera."
}

backend_coverage_gate() {
  (
    cd zeus || exit 1
    ./mvnw -Punit-tests verify
  ) || fail_phase "Backend coverage gate (JaCoCo)" "./mvnw -Punit-tests verify failed."
}

frontend_coverage_gate() {
  (
    cd hera || exit 1
    npm run test:ui:coverage
  ) || fail_phase "Frontend coverage gate (Vitest)" "npm run test:ui:coverage failed."
}

print_artifact_paths() {
  echo
  echo "Coverage artifacts:"
  echo "Backend HTML: zeus/target/site/jacoco/index.html"
  echo "Frontend HTML: hera/coverage/index.html"
  echo "Frontend LCOV: hera/coverage/lcov.info"
}

run_phase "Validate project layout" validate_layout
run_phase "Stop existing Hera dev server" stop_existing_hera_dev_server "${hera_dev_port}"
run_phase "Install Hera dependencies" install_hera_dependencies
run_phase "Backend coverage gate (JaCoCo)" backend_coverage_gate
run_phase "Frontend coverage gate (Vitest)" frontend_coverage_gate
run_phase "Print artifact paths" print_artifact_paths

echo
echo "Coverage verification completed successfully."
