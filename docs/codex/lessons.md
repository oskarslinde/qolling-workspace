# Lessons

## Keep Workspace Tooling Rules Concrete

- Pattern: When asked to add workflow/tooling preferences to `AGENTS.md`, include the exact tool list and explicit exclusions instead of compressing them too much.
- Prevention rule: Preserve user-provided CLI preference lists when they are actionable, then add only small project-specific additions such as Semgrep, Git Bash, Maven wrapper usage, and generated-directory guardrails.

## Remember Qolling Git Boundaries

- Pattern: The Qolling workspace root at `C:\Users\user\java\qolling` is not a git repository; repository roots currently include `hera/`, `zeus/`, `athena/`, `frontend-shared/`, and `blog/`.
- Prevention rule: Do not run or re-run root-level `git status` for Qolling. Check `git status` only inside the repo roots that the work will touch, and pause before code edits if that repo has unrelated changes.

## Keep Workspace Maps Updated Everywhere

- Pattern: After adding new repos, I updated some workspace guidance but left older `AGENTS.md` files and repo-local guidance inconsistent.
- Prevention rule: When the workspace topology changes, update root `AGENTS.md`, every stale repo-local `AGENTS.md`, and add repo-local `AGENTS.md` for new repositories in the same workstream.

## Capture Corrections In The Right Place

- Pattern: User corrections about repo-wide operating rules belong in `AGENTS.md`, while corrections about Codex's recurring workflow mistakes belong in `docs/codex/lessons.md`.
- Prevention rule: When corrected, update both files when both layers are affected instead of only answering in chat or relying on session memory.

## Stage Newly Created Files Automatically

- Pattern: I previously treated adding newly created files to version control as optional unless the user asked for it explicitly.
- Prevention rule: When I intentionally create files inside a Qolling repository root, stage those new files with `git add` as part of the normal completion flow.

## Never Commit Without Explicit User Approval

- Pattern: I instructed delegated agents to commit implementation changes even though the user had not asked for commits.
- Prevention rule: Leave all implementation changes uncommitted by default. Staging newly created files when required is allowed, but commit, amend, push, or rewrite history only when the user explicitly requests it.

## Avoid Repeating Mongo Tooling Assumptions

- Pattern: During Zeus data debugging, I repeated the same friction by assuming a missing tool path (`mongosh` not installed) before using the already-available Python fallback.
- Prevention rule: For Mongo inspection tasks in Qolling, first try Python with `pymongo` (and install `pymongo` only if import fails), then only mention `mongosh` as optional. Do not pause on `mongosh` availability.

## Correlate Data Origins Before Challenging The User

- Pattern: When a user identifies a UI flow as the origin of bad data, I argued from current code shape instead of first correlating the affected documents with local generated/import artifacts.
- Prevention rule: For Qolling data-origin investigations, compare IDs, timestamps, image names, payload fields, and local export/import files before ruling a source in or out. State evidence gently and distinguish "UI entry point" from the underlying import/generation mechanism.

## Reuse Hera As Athena Reference Without Coupling

- Pattern: Athena and Hera can converge later, but feature work may accidentally diverge when Athena ignores proven Hera flows.
- Prevention rule: For Athena implementation decisions, reference equivalent Hera behavior where applicable for merge readiness, but do not cross-wire runtime dependencies or merge the codebases unless explicitly requested.

## Capture Repeated UI Corrections Immediately

- Pattern: During Hera collection editor work, I waited for the user to ask about lessons after repeated corrections instead of capturing the pattern proactively.
- Prevention rule: After the second correction on the same UI/workflow area, update this lessons file before continuing implementation, with a concrete prevention rule tied to the repeated mistake.

## Verify API Response Shape Before Wiring Pagination

- Pattern: I wired Hera Add questions pagination to `totalPages`, but Zeus question paging returns `totalElements` and `hasNext`, so the pager hid itself.
- Prevention rule: Before adding pagination against an existing endpoint, inspect the actual service/DTO contract and mirror an existing caller such as `ViewMyQuestionsPage` instead of assuming common page fields.

## Avoid No-Op Visual Tweaks

- Pattern: I changed collection card title size from `text-ui` to `text-base`, but both resolve to effectively the same size in Hera, so the user saw no visual change.
- Prevention rule: Before claiming a visual sizing fix, verify the relevant Tailwind token values or use an explicit different size class that is guaranteed to change the rendered result.

## Keep Metadata Saves Separate From Membership Updates

- Pattern: Hera Save details resent `questionIds` and `state`, causing Zeus to revalidate collection membership and risking unintended state changes.
- Prevention rule: For edit forms with separate controls for metadata, membership, and publishing, send only the fields owned by the clicked action and add a regression test that forbids unrelated payload fields.

## Keep Durable Zeus Scripts In Zeus

- Pattern: I split deployment scripts at the workspace root after a temporary copy there, even though Zeus owns the deployment scripts.
- Prevention rule: Treat `zeus/scripts/` as the canonical home for durable Zeus deployment tooling; root-level copies are only ad hoc convenience copies when the user explicitly asks for one.

## Use The Known-Good Zeus Maven Path On Windows

- Pattern: I repeatedly tried the Zeus Maven wrapper on Windows, hit `Cannot start maven from wrapper` before Maven launched, and only then switched to the Windows `mvn` command form that already works in this workspace.
- Prevention rule: For Zeus Maven commands from Windows shells, start with the known-good `mvn` / `cmd /c mvn` form instead of testing `./mvnw.cmd` first; reserve the wrapper preference for Git Bash or other non-Windows shells.

## Do Not Add Compatibility Shims For Planned Model Changes

- Pattern: I added overloaded DTO constructors that silently supplied a missing new field instead of updating the explicit call sites.
- Prevention rule: When an early-phase model or contract intentionally gains a required field, update every production and test constructor call to state the intended value; do not add legacy or compatibility overloads unless the user explicitly asks.
