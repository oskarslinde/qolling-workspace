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
  [[ -d "${ROOT_DIR}/hera" ]] || fail "Missing 'hera' directory. Run from qolling root."
  [[ -f "${ROOT_DIR}/hera/package.json" ]] || fail "Missing hera/package.json."
}

check_tools() {
  command -v npm >/dev/null 2>&1 || fail "npm command not found in PATH."
}

determine_report_dir() {
  if [[ -n "${HYGIENE_RUN_DIR:-}" ]]; then
    RUN_DIR="${HYGIENE_RUN_DIR}"
  else
    RUN_DIR="${ROOT_DIR}/${HYGIENE_REPORT_DIR:-hygiene-reports}/$(timestamp)"
  fi
  REPORT_DIR="${RUN_DIR}/frontend"
  mkdir -p "${REPORT_DIR}"
  STATUS_FILE="${REPORT_DIR}/status.txt"
  : > "${STATUS_FILE}"
}

run_hera_check() {
  local check_name="$1"
  shift

  local log_file="${REPORT_DIR}/${check_name}.log"
  echo
  echo "==> Frontend check: ${check_name}"
  (
    cd "${ROOT_DIR}/hera" || exit 1
    "$@"
  ) 2>&1 | tee "${log_file}"
  local rc="${PIPESTATUS[0]}"
  echo "${check_name}=${rc}" >> "${STATUS_FILE}"
  if [[ "${rc}" -ne 0 ]]; then
    OVERALL_RC=1
  fi
}

write_summary() {
  local summary_file="${REPORT_DIR}/summary.txt"
  {
    echo "Frontend hygiene summary"
    echo "run_dir=${RUN_DIR}"
    echo "report_dir=${REPORT_DIR}"
    echo "status_file=${STATUS_FILE}"
    echo
    cat "${STATUS_FILE}"
    echo
    echo "Generated reports:"
    echo "- ${REPORT_DIR}/eslint-report.json"
    echo "- ${REPORT_DIR}/01-eslint-json.log"
    echo "- ${REPORT_DIR}/02-eslint-readable.log"
    echo "- ${REPORT_DIR}/03-typecheck.log"
  } > "${summary_file}"

  echo
  echo "Frontend hygiene reports: ${REPORT_DIR}"
  echo "Frontend summary: ${summary_file}"
}

main() {
  OVERALL_RC=0
  validate_layout
  check_tools
  determine_report_dir

  run_hera_check "01-eslint-json" npm run lint -- --format json -o "${REPORT_DIR}/eslint-report.json"
  run_hera_check "02-eslint-readable" npm run lint
  run_hera_check "03-typecheck" npm run typecheck

  write_summary
  exit "${OVERALL_RC}"
}

main "$@"
