# Optional Execution Bundles

Use this file only when a request matches one of these recurring shapes. Root and project `AGENTS.md` files remain authoritative.

## UI Tweak

- Scope: target component/page, paired styles, skeleton, and nearest tests.
- Preserve shared primitives, accessibility, responsive behavior, and existing async states.
- Handoff: user-visible change, files, and permitted or suggested verification.

## API Contract Change

- Inspect the Zeus contract and every affected consumer before editing.
- Update Zeus DTO/controller behavior, Hera mapping, focused tests, and the API map when its documented shape changes.
- Refresh generated snapshots only through `pipeline.sh`.

## Play Flow Change

- Preserve the `QUESTION -> RESULT -> NEXT` state model unless the request changes it.
- Check loading, transition, error, empty, keyboard, and reduced-motion behavior.
- Keep changes inside the existing Play feature boundary where practical.

## Navigation Or Layout Cleanup

- Start at shared shell/layout components, then remove obsolete props and dead wiring from callers.
- Check representative desktop and mobile routes.

## Behavior-Preserving Refactor

- Keep public contracts stable, update call sites together, and avoid unrelated cleanup.
- State the invariant that proves before/after behavior is equivalent.
