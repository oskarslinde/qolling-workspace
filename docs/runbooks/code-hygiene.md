# Code Hygiene Runbook

Use the root hygiene scripts from Git Bash or Linux when preparing a change. They are wrappers around project-specific checks and report into `hygiene-reports/`.

## Commands

```bash
./check-frontend-hygiene.sh
./check-backend-hygiene.sh
./check-hygiene.sh
```

## Scope

- Frontend hygiene covers Hera source checks.
- Backend hygiene covers Zeus source checks.
- Root hygiene runs both.

## Notes

- Prefer `rg` for searches and avoid `node_modules`, `target`, and `dist`.
- Use the Maven wrapper for Zeus commands when present.
- Do not run tests unless the current user request explicitly asks for that run.
