#!/usr/bin/env bash

set -u
set -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${SCRIPT_DIR}"

timestamp() {
  date +"%Y%m%d-%H%M%S"
}

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

validate_layout() {
  [[ -d "${ROOT_DIR}/zeus" ]] || fail "Missing 'zeus' directory. Run from qolling root."
  [[ -f "${ROOT_DIR}/zeus/pom.xml" ]] || fail "Missing zeus/pom.xml."
}

check_tools() {
  [[ -x "${ROOT_DIR}/zeus/mvnw" ]] || fail "Missing executable zeus/mvnw."
}

determine_report_dir() {
  if [[ -n "${HYGIENE_RUN_DIR:-}" ]]; then
    RUN_DIR="${HYGIENE_RUN_DIR}"
  else
    RUN_DIR="${ROOT_DIR}/${HYGIENE_REPORT_DIR:-hygiene-reports}/$(timestamp)"
  fi
  REPORT_DIR="${RUN_DIR}/backend"
  mkdir -p "${REPORT_DIR}"
  STATUS_FILE="${REPORT_DIR}/status.txt"
  : > "${STATUS_FILE}"
}

run_zeus_check() {
  local check_name="$1"
  shift

  local log_file="${REPORT_DIR}/${check_name}.log"
  echo
  echo "==> Backend check: ${check_name}"
  (
    cd "${ROOT_DIR}/zeus" || exit 1
    "$@"
  ) 2>&1 | tee "${log_file}"
  local rc="${PIPESTATUS[0]}"
  echo "${check_name}=${rc}" >> "${STATUS_FILE}"
  if [[ "${rc}" -ne 0 ]]; then
    OVERALL_RC=1
  fi
}

copy_if_present() {
  local source_file="$1"
  local target_name="$2"
  if [[ -f "${ROOT_DIR}/zeus/${source_file}" ]]; then
    cp "${ROOT_DIR}/zeus/${source_file}" "${REPORT_DIR}/${target_name}"
  fi
}

write_summary() {
  local summary_file="${REPORT_DIR}/summary.txt"
  {
    echo "Backend hygiene summary"
    echo "run_dir=${RUN_DIR}"
    echo "report_dir=${REPORT_DIR}"
    echo "status_file=${STATUS_FILE}"
    echo
    cat "${STATUS_FILE}"
    echo
    echo "Copied reports:"
    echo "- ${REPORT_DIR}/checkstyle-result.xml (if generated)"
    echo "- ${REPORT_DIR}/checkstyle.html (if generated)"
    echo "- ${REPORT_DIR}/pmd.xml (if generated)"
    echo "- ${REPORT_DIR}/pmd.html (if generated)"
    echo "- ${REPORT_DIR}/spotbugsXml.xml (if generated)"
    echo "- ${REPORT_DIR}/spotbugs.html (if generated)"
  } > "${summary_file}"

  echo
  echo "Backend hygiene reports: ${REPORT_DIR}"
  echo "Backend summary: ${summary_file}"
}

main() {
  OVERALL_RC=0
  validate_layout
  check_tools
  determine_report_dir

  run_zeus_check "01-compile" ./mvnw -B -Pquality-checks -DskipTests compile
  run_zeus_check "02-checkstyle-report" ./mvnw -B -Pquality-checks -DskipTests checkstyle:checkstyle
  run_zeus_check "03-checkstyle-check" ./mvnw -B -Pquality-checks -DskipTests checkstyle:check
  run_zeus_check "04-pmd-report" ./mvnw -B -Pquality-checks -DskipTests pmd:pmd
  run_zeus_check "05-pmd-check" ./mvnw -B -Pquality-checks -DskipTests pmd:check
  run_zeus_check "06-spotbugs-report" ./mvnw -B -Pquality-checks -DskipTests spotbugs:spotbugs
  run_zeus_check "07-spotbugs-check" ./mvnw -B -Pquality-checks -DskipTests spotbugs:check

  copy_if_present "target/checkstyle-result.xml" "checkstyle-result.xml"
  copy_if_present "target/site/checkstyle.html" "checkstyle.html"
  copy_if_present "target/pmd.xml" "pmd.xml"
  copy_if_present "target/site/pmd.html" "pmd.html"
  copy_if_present "target/spotbugsXml.xml" "spotbugsXml.xml"
  copy_if_present "target/site/spotbugs.html" "spotbugs.html"

  write_summary
  exit "${OVERALL_RC}"
}

main "$@"
