# Codex Execution Bundles

Use these bundles to execute common tasks directly without a planning phase.  
Each bundle defines default scope, steps, and output expectations.

## Bundle A: UI Tweak (Single Page or Component)

Use when:
- The request is visual/layout/copy behavior on an existing page or component.

Default scope:
- Touch only the target page/component and directly related style/helper files.
- Do not redesign unrelated sections.

Execution steps:
1. Locate target component(s) and nearest existing pattern.
2. Implement smallest change that satisfies requested behavior.
3. Update related tests only if the user asks to run or update tests.
4. Provide manual test steps for user verification.

Deliverable format:
- Files changed.
- What changed in UI behavior.
- Commands user can run to verify.

## Bundle B: API Contract Adjustment (FE + BE)

Use when:
- The request changes a field, endpoint payload, or data mapping across Hera and Zeus.

Default scope:
- Update backend DTO/service/controller and frontend service/consumer mapping.
- Keep compatibility with existing fields where feasible.

Execution steps:
1. Confirm current contract in Zeus and current consumer in Hera.
2. Implement backend contract/data change.
3. Implement frontend normalization/usage update.
4. Update docs if contract map/checklist is affected.
5. Provide manual verification commands for FE and BE.

Deliverable format:
- Contract before/after in one short paragraph.
- Files changed in Zeus and Hera.
- Manual verification commands.

## Bundle C: PlayPage UX Iteration

Use when:
- The request targets `hera/src/pages/PlayPage/**` or `hera/src/features/play/**`.

Default scope:
- Keep existing play loop behavior intact (`QUESTION -> RESULT -> NEXT`).
- Preserve accessibility attributes and reduced-motion behavior.
- Keep layout within current shared width and avoid adding vertical clutter unless requested.

Execution steps:
1. Implement UX tweak in Play components/hooks.
2. Ensure no regressions in transition/loading/error states.
3. Keep new UI additive and removable (small, isolated component where possible).
4. Provide focused manual checks for question, result, transition, and empty/error paths.

Deliverable format:
- Behavior change summary.
- Files changed.
- Manual steps for play-flow verification.

## Bundle D: Navigation/Layout Cleanup

Use when:
- The request removes/changes shell-level layout controls (headers, back buttons, breadcrumbs, spacing).

Default scope:
- Start with shared layout components (`PageShell`, wrappers), then clean stale page props.
- Remove dead code paths and obsolete service/hook wiring tied to removed layout features.

Execution steps:
1. Update shared shell/wrapper.
2. Remove stale props/usages across pages.
3. Remove dead hooks/services/constants tied to removed feature.
4. Provide focused manual checks for representative pages.

Deliverable format:
- Shared component changes.
- Cleanup/deletion list.
- Manual checks for representative routes.

## Bundle E: Safe Refactor (No Behavior Change)

Use when:
- The request is cleanup, naming, extraction, or duplication removal.

Default scope:
- No intentional behavior changes.
- Keep API signatures unchanged unless explicitly requested.

Execution steps:
1. Refactor in small coherent slices.
2. Keep call sites synchronized.
3. Avoid opportunistic unrelated rewrites.
4. Provide a quick behavior-equivalence checklist for user validation.

Deliverable format:
- Refactor intent and non-goals.
- Files changed.
- Behavior-equivalence verification steps.
