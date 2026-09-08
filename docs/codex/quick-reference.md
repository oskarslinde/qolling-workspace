# Qolling Quick Reference

Use this file only when a repository location is unfamiliar. Daily behavior rules live in `AGENTS.md`.

## Repository Map

| Repository | Purpose | Main source | Guidance |
| --- | --- | --- | --- |
| `hera/` | Social-learning frontend | `src/` | `hera/AGENTS.md`, `hera/docs/README.md` |
| `zeus/` | Shared backend and API owner | `src/main/java/com/ednilo/app/` | `zeus/AGENTS.md`, `zeus/docs/README.md` |
| `athena/` | Focused-learning product | `src/` | `athena/AGENTS.md`, `athena/docs/README.md` |
| `frontend-shared/` | Product-neutral frontend packages | package roots | `frontend-shared/AGENTS.md` |
| `blog/` | Public Astro blog | `src/` | `blog/AGENTS.md`, `blog/docs/README.md` |

The workspace root owns cross-project scripts and docs. Check Git status only in repositories whose files will change.

## Common Locations

- Hera routes: `hera/src/config/routes.tsx`
- Hera UI primitives: `hera/src/components/ui/`
- Hera API services: `hera/src/services/`
- Zeus configuration: `zeus/src/main/resources/`
- Zeus generated API snapshots: `zeus/swagger.json`, `zeus/swagger.yaml`
- Cross-project docs index: `docs/README.md`
- API integration map: `docs/reference/api-contract-map.md`
- Runbooks: `docs/runbooks/`
