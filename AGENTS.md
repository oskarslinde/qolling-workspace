# AGENTS.md

## Scope

These instructions apply to the full Qolling repository unless a deeper `AGENTS.md` adds more specific rules.

## Repository Layout

- The top-level `qolling` folder is the `qolling-workspace` Git meta-repository for cross-project assets.
- `hera/`, `zeus/`, `athena/`, `frontend-shared/`, and `blog/` are git repositories in this workspace.
- `hera/`: Qolling social-learning frontend.
- `athena/`: separate focused-learning frontend/product.
- `zeus/`: shared Spring Boot backend and API contract source.
- `frontend-shared/`: publishable product-neutral frontend packages, such as shared config and future headless logic.
- `blog/`: standalone public Astro blog site.
- Check `git status` at the workspace root for root-owned assets, and inside a product repository for product-specific changes.

## Repository Scope Protection

- Athena and Blog are independent repositories. Do not modify either repository unless the task explicitly includes it in scope.

## Shell and CLI Preferences

- Prefer Git Bash for local shell commands in this workspace unless a command is Windows- or PowerShell-specific.
- For Zeus Maven commands on Windows, use the command form already known to work in this workspace (for example `mvn "..."` or `cmd /c mvn ...`) instead of trying `./mvnw.cmd` first.
- Prefer the Maven wrapper (`./mvnw`) for Zeus Maven commands from Git Bash or other non-Windows shells when it is present. Prefer updating Unix-oriented scripts to call the wrapper instead of raw `mvn`.

## Useful CLI Tools

- `rg` for text search. Prefer it over `grep`.
- `fd` or `fdfind` for file discovery.
- `tree -L 3` for structure overview.
- `jq` for JSON output.
- `yq` for YAML files.
- `bat` for readable file previews.
- `ast-grep` or `sg` for syntax-aware search/refactoring.
- `semgrep` for semantic code scanning when a rule or pattern benefits from deeper static analysis.
- `sd` for simple search/replace.
- `fzf` for fuzzy navigation.
- `tokei` or `cloc` for codebase size overview.
- `httpie` or `xh` for API calls.
- `delta` for readable Git diffs.
- `bash -n` for shell script syntax checks.
- `shellcheck` for shell script linting.
- `hadolint` for Dockerfiles.
- `docker compose`, `docker ps`, and `docker inspect` for local container lifecycle and readiness checks.
- `node --check` for JavaScript/ESM CLI syntax checks.
- `just` or `make` for reusable project commands.

Avoid:
- Searching inside `node_modules`.
- Searching inside `target`.
- Searching inside `dist`.
- Editing generated files unless explicitly requested.

## Documentation And Task Capture

- Human-facing docs live under `docs/`, `hera/docs/`, `zeus/docs/`, `athena/docs/`, `frontend-shared/docs/`, and `blog/docs/`.
- Documentation sorting/grouping/naming and placement consistency must follow `docs/reference/documentation-standards.md` for existing and new projects.
- Codex-facing project memory lives under `docs/codex/`.
- Treat `task-manager/tasks/TASKS.md` as the primary place for actionable follow-up work.
- When implementation or review uncovers a critical, high, or medium-priority follow-up, add it proactively to `task-manager/tasks/TASKS.md` instead of only mentioning it in chat.
- Do not proactively add low-priority follow-up items to task-manager unless the user asks for full backlog capture.
- New task entries should include a clear title, status, short description, likely files, and concrete acceptance criteria.

## Self-Improvement Capture

- When the user corrects a recurring workflow, quality, or implementation mistake, create or update `docs/codex/lessons.md` with the pattern and a concrete prevention rule.
- Keep lessons concise and project-specific. Do not add generic advice that would not change future behavior.
- Review relevant lessons before starting similar future work.

## Task Manager Execution Clarifications

- Before executing a task via `$task-manager execute`, ask clarifying questions first when any requirement or implementation choice is ambiguous.
- Prefer concise numbered answer options when asking those clarifications, and include a final option that explicitly allows a different user-provided answer.

## Test Execution Preference

- Do not run tests in any project unless the user explicitly asks for that run in the current turn.
- Instead, provide the relevant test command suggestions so the user can run them manually.
- Do not run standalone Swagger regeneration as a separate manual follow-up. `pipeline.sh` owns Swagger
  snapshot export; use that pipeline when Swagger artifacts need to be refreshed.

## Plan execution

When executing an approved implementation plan:

- Work through all milestones autonomously.
- Do not stop after each milestone to request permission to continue.
- Keep the plan file updated as work progresses.
- Run relevant tests after each meaningful milestone.
- Fix regressions before moving forward.
- Continue until the defined completion criteria are satisfied.
- Ask the user only when blocked by missing information, destructive actions,
  or a genuinely ambiguous architectural decision.

## Model and agent routing

The main agent acts as technical lead and orchestrator. Delegate work according
to complexity while retaining ownership of the overall plan, architecture,
task decomposition, conflict resolution, and final verification.

Use the `planner` agent for architecture, feature planning, ambiguous
requirements, data-model or cross-service changes, and important technical
decisions. Use `reviewer` for final implementation review, security-sensitive
changes, large refactors, and architecture validation.

Use `implementer` for approved plan items, normal business logic, API changes,
UI implementation, and integration work. Use `worker` for file exploration,
simple tests, repetitive edits, renames, formatting, boilerplate, and
straightforward documentation changes.

Do not use a high-cost agent for mechanical work when a lower-tier agent can
reliably complete it. If a lower-tier agent discovers ambiguity or architectural
implications, return the task to the parent agent instead of guessing.

## Fast Execution Defaults

- Prefer direct implementation over planning when the request maps to a known bundle in `docs/codex/execution-bundles.md`.
- Use plan mode or an explicit written plan for non-trivial work that has 3+ meaningful steps, architectural decisions, cross-repo coordination, migrations, or unclear verification needs.
- If implementation reveals that the original approach is wrong, risky, or materially incomplete, stop and re-plan before continuing.
- Do not ask clarifying questions for routine UI/API/refactor requests when these defaults cover the decision.
- Preserve existing design system and coding style unless the user explicitly asks for a redesign or architecture change.
- Keep scope minimal: implement only what the user asked plus required contract updates and obvious guardrails.
- For UI work, default to the shared `PageShell` width and existing component primitives unless the user asks for a different layout.
- For loading/error behavior, default to existing page patterns (`Spinner`/`AsyncSection`/`Alert`) already used nearby.
- For API changes, keep backward compatibility where feasible and avoid contract-breaking renames unless explicitly requested.
- If a task is still ambiguous after applying these defaults, ask exactly one concise question.
- If you change a UI that has a skeleton loader, update the corresponding skeleton loader in the same work so structure, hierarchy, and spacing remain aligned.
- When adding a new page or important UI feature, proactively decide whether the Hera smoke suite should cover it. If it should, add or update the smoke coverage in the same implementation without asking for separate permission.

## Quality and Verification

- For non-trivial changes, pause before finalizing and ask whether there is a simpler, more elegant implementation with less risk or surface area.
- If a fix feels temporary, hacky, or workaround-like, do not implement it without explicit user approval. Prefer the root-cause fix.
- Before reporting done, review the diff and challenge it as a staff engineer would: correctness, maintainability, scope control, and testability.
- When relevant, compare intended behavior before and after the change, especially for refactors, bug fixes, and API/UI behavior changes.
- For bug reports, investigate from concrete evidence such as logs, errors, failing behavior, or tests where available, then fix the root cause without requiring unnecessary hand-holding from the user.

## Git Status Guardrail

- If `git status` shows unrelated changes in any repo you need to touch, stop before making code changes in that repo and ask the user to push or otherwise resolve those changes first.
- Treat this as a hard pause for implementation work, not as permission to edit around the unrelated changes.
- When Codex intentionally creates new files inside a repository root, automatically add those files to version control with `git add` before reporting the work complete.

## Workaround Approval Rule

- Very important: do not implement temporary, risky, or "freaky" workarounds without the user's explicit prior permission in the same thread.
- If you think a workaround is necessary, pause and ask for explicit approval before making any such change.
- Do not mask missing or invalid runtime configuration by hiding features, filtering options, substituting providers, or otherwise changing product behavior unless the user explicitly asks for that approach. Fix the configuration path or report the exact missing configuration instead.

## Fallback Behavior Approval Rule

- Do not add or enable fallback behavior (for example: alternate credentials, bypass flows, relaxed assertions, mock substitutions, silent retries, or degraded-path logic) without explicit user approval in the same thread.
- This rule applies equally to production code and to test code.
- If a fallback seems helpful, stop and ask first instead of implementing it proactively.

## Automatic Warning Cleanup

- Automatically fix obvious IDE/compiler warnings in touched files without requiring explicit user prompts.
- Keep these warning fixes behavior-preserving and minimal (for example: unused fields/imports/locals, dead private code).
- Do not use workaround-style changes to silence warnings; if a workaround is considered, follow the workaround approval rule.

## Execution Bundles

- Use `docs/codex/execution-bundles.md` as the default no-plan execution playbook for common task types.
