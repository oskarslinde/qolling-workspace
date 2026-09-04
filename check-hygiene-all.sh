#!/usr/bin/env bash

set -u
set -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${SCRIPT_DIR}"

timestamp() {
  date +"%Y%m%d-%H%M%S"
}

determine_run_dir() {
  if [[ -n "${HYGIENE_RUN_DIR:-}" ]]; then
    RUN_DIR="${HYGIENE_RUN_DIR}"
  else
    RUN_DIR="${ROOT_DIR}/${HYGIENE_REPORT_DIR:-hygiene-reports}/$(timestamp)"
  fi
  mkdir -p "${RUN_DIR}"
}

run_and_capture() {
  local label="$1"
  local script_path="$2"

  echo
  echo "==> Running ${label}"
  bash "${script_path}"
  local rc=$?
  echo "${label}=${rc}" >> "${RUN_DIR}/summary.txt"
  return "${rc}"
}

write_final_summary() {
  echo
  echo "Combined hygiene run directory: ${RUN_DIR}"
  echo "Summary file: ${RUN_DIR}/summary.txt"
  echo
  cat "${RUN_DIR}/summary.txt"
}

main() {
  local backend_rc=0
  local frontend_rc=0

  determine_run_dir
  export HYGIENE_RUN_DIR="${RUN_DIR}"

  : > "${RUN_DIR}/summary.txt"
  echo "Hygiene checks summary" >> "${RUN_DIR}/summary.txt"
  echo "run_dir=${RUN_DIR}" >> "${RUN_DIR}/summary.txt"
  echo >> "${RUN_DIR}/summary.txt"

  run_and_capture "backend" "${ROOT_DIR}/check-backend-hygiene.sh" || backend_rc=$?
  run_and_capture "frontend" "${ROOT_DIR}/check-frontend-hygiene.sh" || frontend_rc=$?

  write_final_summary

  if [[ "${backend_rc}" -ne 0 || "${frontend_rc}" -ne 0 ]]; then
    exit 1
  fi
  exit 0
}

main "$@"
