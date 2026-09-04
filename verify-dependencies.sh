#!/usr/bin/env bash

set -u
set -o pipefail

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

dependency_check_args() {
  if [[ -n "${NVD_API_KEY:-}" ]]; then
    echo "-DnvdApiKey=${NVD_API_KEY}"
  else
    echo ""
  fi
}

print_nvd_key_status() {
  if [[ -n "${NVD_API_KEY:-}" ]]; then
    echo "Using NVD API key from NVD_API_KEY environment variable."
  else
    echo "WARNING: NVD_API_KEY is not set. Dependency DB update can be very slow."
  fi
}

validate_layout() {
  [[ -d "zeus" ]] || fail_phase "Validate project layout" "Missing 'zeus' directory. Run from qolling root."
  [[ -f "zeus/pom.xml" ]] || fail_phase "Validate project layout" "Missing zeus/pom.xml."
  [[ -f "zeus/dependency-check-suppressions.xml" ]] || fail_phase "Validate project layout" "Missing zeus/dependency-check-suppressions.xml."
}

check_maven_available() {
  [[ -x "zeus/mvnw" ]] || fail_phase "Check Maven wrapper availability" "Missing executable zeus/mvnw."
}

collect_version_updates() {
  (
    cd zeus || exit 1
    mkdir -p target
    ./mvnw -Pdependency-audit -DskipTests versions:display-dependency-updates versions:display-plugin-updates | tee target/versions-updates.txt
  ) || fail_phase "Collect dependency and plugin updates" "Failed to collect updates via versions-maven-plugin."
}

run_vulnerability_scan() {
  (
    cd zeus || exit 1
    local nvd_arg
    nvd_arg="$(dependency_check_args)"
    if [[ -n "${nvd_arg}" ]]; then
      ./mvnw -Pdependency-audit -DskipTests "${nvd_arg}" dependency-check:check
    else
      ./mvnw -Pdependency-audit -DskipTests dependency-check:check
    fi
  ) || fail_phase "Run OWASP dependency scan" "dependency-check scan failed. Review zeus/target/dependency-check-report.html."
}

print_artifact_paths() {
  echo
  echo "Dependency audit artifacts:"
  echo "Version updates: zeus/target/versions-updates.txt"
  echo "OWASP HTML report: zeus/target/dependency-check-report.html"
  echo "OWASP JSON report: zeus/target/dependency-check-report.json"
}

run_phase "Validate project layout" validate_layout
run_phase "Check Maven wrapper availability" check_maven_available
run_phase "Check NVD API key status" print_nvd_key_status
run_phase "Collect dependency and plugin updates" collect_version_updates
run_phase "Run OWASP dependency scan" run_vulnerability_scan
run_phase "Print artifact paths" print_artifact_paths

echo
echo "Dependency audit completed."
