# Task Manager

Lightweight local browser UI for reviewing and moving Qolling Markdown task files. The canonical task board lives in `tasks/`.

## Run Locally

```powershell
npm start
```

Then open:

```text
http://localhost:4317
```

Use a different port if needed:

```powershell
$env:PORT=4320; npm start
```

## Board Flow

The board shows these workflow columns:

- `Postponed`
- `Open`
- `UI improvements`
- `Todo`
- `In progress`
- `Done`
- `Archive`

Click a task to review details in a modal, then move it to the needed status. The browser receives live updates through server-sent events when the task files change; manual refresh is still available as a fallback.

`Execute Todo` starts a real execution batch for the current `Todo` queue by moving only the next task into `In progress`. It does not mark tasks `Done` automatically and it does not run arbitrary code or shell commands from the browser.

## Execution Visibility

The top execution panel shows:

- whether a batch is running
- the current task selected for implementation
- completed versus total queued tasks within the batch
- a progress bar
- recent execution batch history

Execution state is persisted in:

- `TASK_EXECUTION_STATE.json`
- `TASK_EXECUTION_HISTORY.json`

Batch progression now depends on real task updates:

- `Execute Todo` starts a batch and selects the next task
- when that task is actually moved to `Done`, the next queued batch task is moved to `In progress`
- the batch finishes only after the last queued task is truly marked `Done`

## Tests

```powershell
npm test
```

## Task Files

Task tracking files live in `tasks/`:

- `tasks/TASKS.md`: active work with `Open`, `UI improvements`, `Todo`, and `In progress` statuses.
- `tasks/TASKS_DONE.md`: completed work.
- `tasks/TASKS_POSTPONED.md`: deferred or postponed work.
- `tasks/TASKS_ARCHIVE.md`: archived work.

When updating task status, keep this grouping intact by moving tasks between these files.
