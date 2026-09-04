import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { parseTasks, TaskStore } from '../src/taskStore.js';

test('parseTasks reads task fields and statuses from markdown', () => {
  const tasks = parseTasks(`# Tasks

---

## Area

### 12. Improve something
- Ticket ID: \`HE-012\`
- Description: Useful work.
- Status: \`Open\`
- Likely files: \`hera/src/App.jsx\`
- Details: Keep it narrow.
- Acceptance: Tests pass.
`);

  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].id, 'HE-012');
  assert.equal(tasks[0].ticketId, 'HE-012');
  assert.equal(tasks[0].title, 'Improve something');
  assert.equal(tasks[0].status, 'Open');
  assert.equal(tasks[0].section, 'Area');
  assert.equal(tasks[0].likelyFiles, '`hera/src/App.jsx`');
  assert.equal(tasks[0].acceptance, 'Tests pass.');
});

test('parseTasks preserves multi-code-span fields and ignores section separators', () => {
  const tasks = parseTasks(`# Tasks

---

## Area

### 7. Files task
- Description: Useful work.
- Status: \`In progres\`
- Likely files: \`hera/src/App.jsx\`, \`zeus/src/main/java/**\`

---

## Next Area
`);

  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].status, 'In progress');
  assert.equal(tasks[0].likelyFiles, '`hera/src/App.jsx`, `zeus/src/main/java/**`');
  assert.deepEqual(tasks[0].extraLines, []);
});

test('TaskStore moves tasks between markdown files by status', async () => {
  const root = await mkdtemp(join(tmpdir(), 'qolling-task-store-'));
  try {
    await writeFile(join(root, 'TASKS.md'), `# Tasks

---

## Area

### 1. First task
- Description: Do it.
- Status: \`Open\`
`, 'utf8');

    const store = new TaskStore(root);
    const [task] = await store.listTasks();
    await store.updateTaskStatus(task.id, 'Done');

    const active = await readFile(join(root, 'TASKS.md'), 'utf8');
    const done = await readFile(join(root, 'TASKS_DONE.md'), 'utf8');
    const counters = JSON.parse(await readFile(join(root, 'TASK_TICKET_COUNTERS.json'), 'utf8'));

    assert.doesNotMatch(active, /First task/);
    assert.match(done, /### First task/);
    assert.match(done, /- Ticket ID: `BO-001`/);
    assert.match(done, /- Status: `Done`/);
    assert.deepEqual(counters, { BO: 1, HE: 0, ZE: 0 });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('TaskStore returns todo tasks in numeric order', async () => {
  const root = await mkdtemp(join(tmpdir(), 'qolling-task-store-'));
  try {
    await writeFile(join(root, 'TASKS.md'), `# Tasks

---

## Area

### 2. Queued task
- Description: Ready.
- Status: \`Todo\`

### 1. Earlier task
- Description: First.
- Status: \`Todo\`
`, 'utf8');

    const store = new TaskStore(root);
    const todos = await store.getTasksByStatus('Todo');

    assert.equal(todos.length, 2);
    assert.deepEqual(todos.map((task) => task.id), ['BO-002', 'BO-001']);
    assert.deepEqual(todos.map((task) => task.number), [1, 2]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('TaskStore keeps UI improvement tasks in the active markdown file', async () => {
  const root = await mkdtemp(join(tmpdir(), 'qolling-task-store-'));
  try {
    await writeFile(join(root, 'TASKS.md'), `# Tasks

---

## UI

### 1. Improve play state clarity
- Description: Make result review easier to distinguish.
- Status: \`UI improvements\`
`, 'utf8');

    const store = new TaskStore(root);
    const [task] = await store.listTasks();

    assert.equal(task.status, 'UI improvements');
    assert.equal(task.fileKey, 'active');

    const active = await readFile(join(root, 'TASKS.md'), 'utf8');
    assert.match(active, /- Status: `UI improvements`/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('TaskStore assigns persistent prefix counters by product area', async () => {
  const root = await mkdtemp(join(tmpdir(), 'qolling-task-store-'));
  try {
    await writeFile(join(root, 'TASKS.md'), `# Tasks

---

## Hera work

### 1. Hera task
- Description: UI only.
- Likely files: \`hera/src/App.jsx\`
- Status: \`Open\`

## Zeus work

### 2. Zeus task
- Description: Backend only.
- Likely files: \`zeus/src/main/java/com/example/App.java\`
- Status: \`Open\`

## Mixed work

### 3. Shared task
- Description: Touch both apps.
- Likely files: \`hera/src/App.jsx\`, \`zeus/src/main/java/com/example/App.java\`
- Status: \`Open\`
`, 'utf8');

    const store = new TaskStore(root);
    const tasks = await store.listTasks();
    const countersBefore = JSON.parse(await readFile(join(root, 'TASK_TICKET_COUNTERS.json'), 'utf8'));
    const secondRead = await store.listTasks();

    assert.deepEqual(tasks.map((task) => task.id), ['HE-001', 'ZE-001', 'BO-001']);
    assert.deepEqual(secondRead.map((task) => task.id), ['HE-001', 'ZE-001', 'BO-001']);
    assert.deepEqual(countersBefore, { BO: 1, HE: 1, ZE: 1 });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
