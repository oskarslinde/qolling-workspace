# Code Hygiene Runbook

Use the root hygiene scripts from Git Bash or Linux for an explicitly requested full-workspace or release-level hygiene check. Routine changes should use focused project checks. The scripts report into `hygiene-reports/`.

## Commands

```bash
./check-frontend-hygiene.sh
./check-backend-hygiene.sh
./check-hygiene-all.sh
```

## Scope

- Frontend hygiene covers Hera source checks.
- Backend hygiene covers Zeus source checks.
- Root hygiene runs both.

## Notes

- Prefer `rg` for searches and avoid `node_modules`, `target`, and `dist`.
- Use the Maven command appropriate to the active shell as documented in the workspace instructions.
