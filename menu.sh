#!/usr/bin/env bash

set -euo pipefail

scripts_dir="./scripts"
script_glob_root="./*.sh"
last_run_file=".menu-last-script"

fzf_bin=""
if command -v fzf.exe >/dev/null 2>&1; then
  fzf_bin="fzf.exe"
elif command -v fzf >/dev/null 2>&1; then
  fzf_bin="fzf"
else
  echo "Error: fzf is not installed or not on PATH."
  echo "Install fzf, then run this launcher again."
  exit 1
fi

allow_non_tty=false
if [[ "${FZF_DEFAULT_OPTS-}" == *"--filter"* ]]; then
  allow_non_tty=true
fi

if ! [ -t 0 ] || ! [ -t 1 ]; then
  if [ "$allow_non_tty" != true ]; then
    echo "Error: interactive terminal required."
    echo "Run this script from an open Git Bash terminal with: ./menu.sh"
    exit 1
  fi
fi

shopt -s nullglob
scripts=($script_glob_root "$scripts_dir"/*.sh)
shopt -u nullglob

filtered_scripts=()
for script in "${scripts[@]}"; do
  if [[ "$script" != "./menu.sh" ]]; then
    filtered_scripts+=("$script")
  fi
done
scripts=("${filtered_scripts[@]}")

if [ "${#scripts[@]}" -eq 0 ]; then
  echo "No scripts found in $scripts_dir"
  exit 1
fi

describe_script() {
  local script="$1"
  local name
  name="$(basename "$script")"
  case "$name" in
    hera-dev-server.sh) echo "Start Hera dev server with local port/process checks" ;;
    verify-dependencies.sh) echo "Run dependency hygiene checks across repos" ;;
    verify-coverage.sh) echo "Validate test coverage thresholds and reports" ;;
    pipeline.sh) echo "Run interactive pipeline flow and deploy sequence" ;;
    run-tests.sh) echo "Run all configured test suites" ;;
    deploy-only.sh) echo "Deploy Zeus + Hera with no npm install" ;;
    deploy-refresh.sh) echo "EC2-style refresh deploy (includes git pull)" ;;
    deploy-refresh-ec2.sh) echo "EC2 refresh deploy with custom Zeus Dockerfile (includes git pull)" ;;
    check-hygiene-all.sh) echo "Run combined backend + frontend hygiene checks" ;;
    check-frontend-hygiene.sh) echo "Run frontend hygiene checks only" ;;
    check-backend-hygiene.sh) echo "Run backend hygiene checks only" ;;
    *) echo "Run $name" ;;
  esac
}

menu_items=()
max_script_len=0
for script in "${scripts[@]}"; do
  if [ "${#script}" -gt "$max_script_len" ]; then
    max_script_len="${#script}"
  fi
done

for script in "${scripts[@]}"; do
  padded_script="$(printf "%-${max_script_len}s" "$script")"
  menu_items+=("$padded_script"$'\t'"$(describe_script "$script")")
done

last_executed_script=""
if [ -f "$last_run_file" ]; then
  last_executed_script="$(tr -d '\r' < "$last_run_file")"
fi

if [[ -n "$last_executed_script" ]]; then
  menu_items+=("LAST_EXECUTED"$'\t'"Last executed: $last_executed_script")
fi

set +e
selected_item=$(
  printf '%s\n' "${menu_items[@]}" \
  | "$fzf_bin" --no-mouse --prompt="Select script: " --delimiter=$'\t' --with-nth=1,2
)
fzf_status=$?
set -e

selected_item="$(printf '%s' "$selected_item" | tr -d '\r')"
selected_script="${selected_item%%$'\t'*}"
selected_script="${selected_script%"${selected_script##*[![:space:]]}"}"

if [ "$fzf_status" -ne 0 ] || [[ -z "${selected_script}" ]]; then
  echo "No script selected"
  exit 0
fi

if [[ "$selected_script" == "LAST_EXECUTED" ]]; then
  if [[ -z "$last_executed_script" ]]; then
    echo "No last executed script recorded yet."
    exit 0
  fi
  selected_script="$last_executed_script"
fi

echo "Running: $selected_script"
printf '%s\n' "$selected_script" > "$last_run_file"
bash "$selected_script"
