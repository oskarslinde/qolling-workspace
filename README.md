# Qolling

Qolling is a question and learning workspace with React frontends, a Spring Boot backend, browser business tests, and a small local task-manager UI.

## Project Shape

- `hera/` - frontend repository, Vite + React + Tailwind.
- `athena/` - focused-learning frontend repository for exam, specialization, and interview preparation.
- `zeus/` - backend repository, Spring Boot + MongoDB + OpenAPI.
- `business-tests/` - Playwright business-flow tests and Gherkin feature files.
- `task-manager/` - local task board UI backed by Markdown task files.
- `docs/` - cross-project human documentation and Codex project memory.

The top-level `qolling` folder is the `qolling-workspace` Git meta-repository for shared tooling, documentation, CI, and business tests. Product repositories are registered as submodules: `hera/`, `athena/`, `zeus/`, `frontend-shared/`, and `blog/`.

After cloning, enable the staged-secret scan once:

```bash
./scripts/setup-git-hooks.sh
```

## Local Start

```powershell
docker compose --env-file .env.dev up --build
```

Expected local services:

- Hera: `http://localhost:5173`
- Athena: `http://localhost:5173` from `athena` with `npm run dev`
- Zeus: `http://localhost:8080`
- Task manager: `http://localhost:4317` from `task-manager` with `npm start`

## Documentation

- [Documentation index](docs/README.md)
- [Architecture overview](docs/architecture/overview.md)
- [API contract map](docs/reference/api-contract-map.md)
- [Product UX principles](docs/product/ux-principles.md)
- [Codex project memory](docs/codex/README.md)
- [Hera docs](hera/docs/README.md)
- [Athena docs](athena/docs/README.md)
- [Zeus docs](zeus/docs/README.md)

## Verification

Project tests are intentionally run on demand. Common commands:

```powershell
cd hera; npm run test:ui:report
cd athena; npm test
cd zeus; .\mvnw -Punit-tests test
cd business-tests; npm run check:feature-coverage
cd task-manager; npm test
```
