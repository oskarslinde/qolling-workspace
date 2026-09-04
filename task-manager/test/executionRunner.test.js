import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { ExecutionRunner } from '../src/executionRunner.js';
import { ExecutionStore } from '../src/executionStore.js';
import { TaskStore } from '../src/taskStore.js';

async function readIfExists(path) {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return '';
    }
    throw error;
  }
}

test('ExecutionRunner starts a batch with the first todo task and advances only after real completion', async () => {
  const root = await mkdtemp(join(tmpdir(), 'qolling-execution-runner-'));
  try {
    await writeFile(join(root, 'TASKS.md'), `# Tasks

---

## Area

### 2. Second task
- Description: Two.
- Status: \`Todo\`

### 1. First task
- Description: One.
- Status: \`Todo\`
`, 'utf8');

    const taskStore = new TaskStore(root);
    const executionStore = new ExecutionStore(root);
    let taskBroadcasts = 0;
    let executionBroadcasts = 0;
    const runner = new ExecutionRunner({
      taskStore,
      executionStore,
      onTasksChanged: async () => {
        taskBroadcasts += 1;
      },
      onExecutionChanged: async () => {
        executionBroadcasts += 1;
      },
    });

    const started = await runner.start();
    assert.equal(started.running, true);
    assert.equal(started.currentTaskId, 'BO-002');
    assert.deepEqual(started.remainingTaskIds, ['BO-001']);

    let state = await executionStore.readState();
    let active = await readFile(join(root, 'TASKS.md'), 'utf8');
    let done = await readIfExists(join(root, 'TASKS_DONE.md'));

    assert.equal(state.phase, 'awaiting_implementation');
    assert.match(active, /### First task[\s\S]*- Status: `In progress`/);
    assert.match(active, /### Second task[\s\S]*- Status: `Todo`/);
    assert.doesNotMatch(done, /First task/);

    await taskStore.updateTaskStatus('BO-002', 'Done');
    state = await runner.sync();
    active = await readFile(join(root, 'TASKS.md'), 'utf8');
    done = await readFile(join(root, 'TASKS_DONE.md'), 'utf8');

    assert.equal(state.running, true);
    assert.equal(state.currentTaskId, 'BO-001');
    assert.deepEqual(state.completedTaskIds, ['BO-002']);
    assert.match(active, /### Second task[\s\S]*- Status: `In progress`/);
    assert.match(done, /- Ticket ID: `BO-002`/);

    await taskStore.updateTaskStatus('BO-001', 'Done');
    state = await runner.sync();
    const history = await executionStore.readHistory();
    done = await readFile(join(root, 'TASKS_DONE.md'), 'utf8');

    assert.equal(state.running, false);
    assert.equal(state.phase, 'completed');
    assert.deepEqual(state.completedTaskIds, ['BO-002', 'BO-001']);
    assert.ok(state.logs.length >= 5);
    assert.equal(history.length, 1);
    assert.deepEqual(history[0].completedTaskIds, ['BO-002', 'BO-001']);
    assert.ok(history[0].logs.length >= 5);
    assert.match(done, /- Ticket ID: `BO-002`/);
    assert.match(done, /- Ticket ID: `BO-001`/);
    assert.ok(taskBroadcasts >= 2);
    assert.ok(executionBroadcasts >= 3);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
