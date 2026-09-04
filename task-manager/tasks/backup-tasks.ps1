param(
    [string]$BackupRoot = "backups"
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $PSCommandPath
Push-Location $scriptDir
try {
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$destination = Join-Path $BackupRoot $timestamp

New-Item -ItemType Directory -Path $destination -Force | Out-Null

$files = @(
    "TASKS.md",
    "TASKS_DONE.md",
    "TASKS_POSTPONED.md",
    "TASKS_ARCHIVE.md",
    "TASK_EXECUTION_STATE.json",
    "TASK_EXECUTION_HISTORY.json",
    "TASK_TICKET_COUNTERS.json"
)

foreach ($file in $files) {
    if (Test-Path -LiteralPath $file) {
        Copy-Item -LiteralPath $file -Destination (Join-Path $destination $file) -Force
    }
}

Write-Output "Backup created: $destination"
}
finally {
    Pop-Location
}
