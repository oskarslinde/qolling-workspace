#!/usr/bin/env bash

get_listening_pids_on_port() {
  local port="$1"

  if command -v lsof >/dev/null 2>&1; then
    lsof -ti tcp:"${port}" 2>/dev/null | sort -u
    return 0
  fi

  if command -v fuser >/dev/null 2>&1; then
    fuser "${port}/tcp" 2>/dev/null | tr ' ' '\n' | sed '/^$/d' | sort -u
    return 0
  fi

  if command -v netstat >/dev/null 2>&1; then
    netstat -ano 2>/dev/null | awk -v port=":${port}" '
      $0 ~ port && $0 ~ /LISTEN|LISTENING/ { print $NF }
    ' | sed '/^$/d' | sort -u
  fi
}

stop_pid() {
  local pid="$1"
  local uname_out
  uname_out="$(uname -s 2>/dev/null || echo "")"

  case "${uname_out}" in
    MINGW*|MSYS*|CYGWIN*)
      taskkill.exe //PID "${pid}" //T //F >/dev/null 2>&1 || kill "${pid}" >/dev/null 2>&1 || true
      ;;
    *)
      kill "${pid}" >/dev/null 2>&1 || true
      ;;
  esac
}

stop_existing_hera_dev_server() {
  local port="$1"
  local pids
  pids="$(get_listening_pids_on_port "${port}")"

  if [[ -z "${pids}" ]]; then
    echo "No existing Hera dev server found on port ${port}."
    return 0
  fi

  echo "Stopping existing process(es) on Hera dev port ${port}:"
  echo "${pids}"

  while IFS= read -r pid; do
    [[ -n "${pid}" ]] || continue
    stop_pid "${pid}"
  done <<< "${pids}"

  sleep 2

  pids="$(get_listening_pids_on_port "${port}")"
  if [[ -n "${pids}" ]]; then
    echo "Port ${port} is still in use by: ${pids}" >&2
    return 1
  fi
}
