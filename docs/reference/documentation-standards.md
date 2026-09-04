# Qolling Documentation Standards

Purpose: keep documentation sorting, grouping, and naming consistent across current and future projects.

## Source Of Truth

- This file is the canonical documentation structure and naming standard.
- Project-specific docs (`hera/docs/`, `zeus/docs/`, `athena/docs/`) must follow this standard.
- If another helper (skill/script/checklist) disagrees with this file, this file wins.

## Directory Grouping Model

Use these roots consistently:

- `docs/architecture/`: cross-project system shape and runtime relationships.
- `docs/features/`: cross-project behavior contracts and feature flows.
- `docs/product/`: durable UX and product principles.
- `docs/reference/`: stable maps and standards (for example API map, documentation standards).
- `docs/runbooks/`: operational procedures and local/deploy workflows.
- `<project>/docs/`: project-only implementation rules (frontend-only, backend-only, or product-only for that project).

Avoid creating new top-level docs categories unless there is a strong recurring need.

## Placement Decision Rules

Choose placement by ownership and reuse:

- Put a doc in `docs/` when multiple projects use it or it defines cross-project contracts.
- Put a doc in `<project>/docs/` when it describes implementation details for one project only.
- Do not duplicate the same contract in both places. Keep one owner and link to it.

Examples:

- Cross-project API/feature mapping -> `docs/reference/` or `docs/features/`.
- Hera UI implementation conventions -> `hera/docs/`.
- Zeus backend implementation guidelines -> `zeus/docs/`.
- Athena product-specific visual system -> `athena/docs/`.

## Naming Rules

- Use kebab-case file names: `question-generation.md`, `api-contract-map.md`.
- Use concise, topic-first names. Prefer one durable topic per file.
- Keep section headings stable and predictable for scanability.
- Avoid date-based file names unless chronology is the main purpose.

## Project Docs Index Contract

Each project docs root should include `README.md` with these sections and order:

1. `<Project> Documentation` title
2. short scope statement (project-only vs cross-project)
3. `## Durable Docs`
4. `## Related Docs`
5. `## Placement Rules`

The section names above should remain stable for consistency across projects.

## Link And Update Rules

- When adding a durable doc, update the nearest index README in the same change.
- Prefer relative links between docs.
- Keep descriptions short and behavior-oriented.
- Do not manually duplicate generated truth (OpenAPI snapshots, generated dependency inventories, generated schemas).
- Keep active follow-up work in `task-manager/tasks/TASKS.md`, not in documentation files.

## New Project Bootstrap Rules

When adding a new project:

- Create `<project>/docs/README.md` immediately using the index contract.
- Link that project docs index from `docs/README.md` under project-specific docs.
- Keep project docs focused on project-only implementation standards and link back to cross-project docs where relevant.
