# Qolling Quick Reference

## Repositories

- `hera/`, `zeus/`, and `athena/` are git repositories.
- Check `git status` only inside those repo roots.
- The workspace root is not a git repository.

## Docs

- Human index: `docs/README.md`.
- Cross-project API map: `docs/reference/api-contract-map.md`.
- Cross-project docs standard: `docs/reference/documentation-standards.md`.
- Hera rules: `hera/docs/README.md`.
- Zeus rules: `zeus/docs/README.md`.
- Athena rules: `athena/docs/README.md` (or `athena/guidelines/` until project docs are fully bootstrapped).
- Task board: `task-manager/tasks/TASKS.md`.

## Hera Map

- Source: `hera/src/`.
- UI primitives: `hera/src/components/ui/`.
- Routes: `hera/src/config/routes.jsx`.
- API constants: `hera/src/constants/apiConstants.js`.
- Services: `hera/src/services/`.
- Design system: `hera/docs/design-system.md`.

## Zeus Map

- Source: `zeus/src/main/java/com/ednilo/app/`.
- Config: `zeus/src/main/resources/`.
- Domain-first packages: `auth`, `email`, `friend`, `messaging`, `question`, `user`.
- API contracts: `swagger.json` and `swagger.yaml`.
- Backend rules: `zeus/docs/backend-guidelines.md`.

## Default Verification Suggestions

Only run tests when the user asks. Otherwise suggest focused commands:

```powershell
cd hera; npm run lint; npm run test:ui:report
cd zeus; .\mvnw -Punit-tests test
cd task-manager; npm test
cd business-tests; npm run check:feature-coverage
```
