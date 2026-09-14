# Codex Blocker Registry

Record recurring environment, tooling, or permission blockers here when a task needs a safe alternate path. This is a shared diagnostic log, not a replacement for authoritative workspace rules or a list of transient task failures.

## Entry Format

- **Area:** affected tool or workflow
- **Symptom:** the observable failure
- **Cause or constraint:** confirmed cause, if known
- **Safe alternate path:** the approved way to continue
- **Follow-up:** only when an enduring configuration or policy change is needed

## Entries

### Maven test run blocked by sandbox filesystem identity handling

- **Area:** focused Maven tests in the Qolling workspace.
- **Symptom:** the initial focused Maven run is blocked before tests begin because the sandbox cannot validate the workspace filesystem identity.
- **Cause or constraint:** the workspace Git directory may be owned by a different Windows security identifier than the process running Codex.
- **Safe alternate path:** rerun the same focused test selection using the workspace's approved test permission. For a read-only Git inspection, use a command-scoped `safe.directory` override; do not change global Git configuration merely to inspect status.
- **Follow-up:** record new variants only if the failure message, affected workflow, or safe recovery differs materially.
