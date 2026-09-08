# AGENTS.md

## Scope And Precedence

- These rules apply to the whole workspace. A repository-local `AGENTS.md` adds only project-specific rules.
- User and system instructions override this file. When instructions conflict, follow the higher-priority source and do not preserve both variants.
- Load only the nearest applicable instructions and task-relevant references; do not read every linked document by default.

## Workspace

- The workspace root is the `qolling-workspace` Git repository for cross-project assets.
- Product repositories are `hera/`, `zeus/`, `athena/`, `frontend-shared/`, and `blog/`.
- Athena and Blog are independent products. Modify them only when the request explicitly includes them.
- Check Git status in each repository that will be edited. Check the workspace root only for root-owned files.
- If a repository to be edited has unrelated changes, stop before editing it and ask the user to resolve them.

## Start With The Minimum Context

1. Read this file and the `AGENTS.md` nearest the target files.
2. Inspect the target implementation and its nearest tests or patterns.
3. Read a linked doc only when the task needs that topic. Use `docs/README.md` or a project docs index to find it.
4. Search `docs/codex/lessons.md` by relevant keyword after a similar prior mistake; do not load the full file routinely.

## Execution Defaults

- Implement routine, well-scoped requests directly. Write or update a plan for work with architectural decisions, migrations, cross-repository coordination, or three or more substantial milestones.
- Keep scope to the request, required contract updates, and obvious safety guards. Preserve established design and code patterns.
- Diagnose from concrete evidence and fix root causes. Do not implement temporary workarounds, behavior fallbacks, compatibility shims, relaxed assertions, or hidden degraded behavior without explicit approval.
- Fix obvious behavior-preserving warnings only in files already being changed.
- For UI changes, keep paired skeletons/loading states aligned and consider smoke coverage for new pages or important flows.
- For API changes, preserve compatibility when practical and coordinate affected consumers in the same workstream.

## Plans And Delegation

- Execute an approved plan autonomously, keep its status current, and continue until completion or a real blocker.
- Test execution follows the standing permission below; a plan does not grant extra permission for destructive or deployment actions.
- Delegate only when independent parallel work or review materially improves the result and a suitable agent is available. The main agent retains architecture, integration, and final verification ownership.
- Do not make task completion depend on a particular model or unavailable specialist agent.

## Test Authorization

- Tests may be run automatically for touched code without asking again. Prefer focused tests; run broader suites when the change's risk warrants them.
- Do not run destructive operations or external deployments without explicit user approval.
- The user may disable tests for a task with a clear instruction such as `tests off`.
- The standing permission covers test suites; ordinary focused lint, formatting, type-check, compile, and build verification remain allowed within the requested task.
- Do not regenerate Swagger manually. The root `pipeline.sh` owns Swagger snapshot export.

## Git And Files

- Preserve unrelated user changes. Never use destructive Git commands unless explicitly requested.
- Work on the active branch; do not switch branches unless the user asks.
- Stage intentionally created files before handoff. Do not stage modified existing files unless asked.
- Never commit, amend, push, or rewrite history without explicit user approval.
- Never commit secrets, credentials, private keys, or environment-specific local artifacts.
- Do not edit generated files unless the task explicitly requires the owning generation workflow.

## Documentation And Memory

- Human docs live under `docs/` and each project's `docs/`; follow `docs/reference/documentation-standards.md` when creating or moving docs.
- Codex-only memory lives under `docs/codex/`. Keep it concise and link to durable docs instead of duplicating them.
- When the user corrects a recurring, project-specific mistake, record one concise prevention rule in `docs/codex/lessons.md`. Consolidate or replace stale lessons instead of accumulating variants.

## Local Tooling

- Prefer Git Bash for cross-platform scripts and PowerShell for Windows-specific work.
- Search with `rg`, excluding `node_modules`, `target`, and `dist`.
- On Windows, run Zeus with the known-good `mvn` or `cmd /c mvn` form. Use `./mvnw` from Git Bash or other Unix-like shells.
