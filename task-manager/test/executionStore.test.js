import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { ExecutionStore } from '../src/executionStore.js';

test('ExecutionStore falls back safely when state json is temporarily invalid', async () => {
  const root = await mkdtemp(join(tmpdir(), 'qolling-execution-store-'));
  try {
    await writeFile(join(root, 'TASK_EXECUTION_STATE.json'), '', 'utf8');
    await writeFile(join(root, 'TASK_EXECUTION_HISTORY.json'), '{', 'utf8');

    const store = new ExecutionStore(root);
    const state = await store.readState();
    const history = await store.readHistory();

    assert.equal(state.running, false);
    assert.equal(state.phase, 'idle');
    assert.deepEqual(history, []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('ExecutionStore reuses the last valid snapshot when a later read sees truncated json', async () => {
  const root = await mkdtemp(join(tmpdir(), 'qolling-execution-store-cache-'));
  try {
    const store = new ExecutionStore(root);
    const expectedState = {
      running: true,
      phase: 'awaiting_implementation',
      startedAt: '2026-04-08T10:00:00.000Z',
      finishedAt: null,
      currentTaskId: '8',
      currentTaskTitle: 'Add a collection-session page loader',
      completedTaskIds: [],
      remainingTaskIds: ['9'],
      totalTasks: 2,
      batchId: 'batch-1',
      lastMessage: 'Task 8 is active.',
      logs: [],
    };
    const expectedHistory = [
      {
        batchId: 'batch-0',
        completedTaskIds: ['7'],
      },
    ];

    await store.writeState(expectedState);
    await store.writeHistory(expectedHistory);

    assert.deepEqual(await store.readState(), expectedState);
    assert.deepEqual(await store.readHistory(), expectedHistory);

    await writeFile(join(root, 'TASK_EXECUTION_STATE.json'), '{"running": true', 'utf8');
    await writeFile(join(root, 'TASK_EXECUTION_HISTORY.json'), '[', 'utf8');

    assert.deepEqual(await store.readState(), expectedState);
    assert.deepEqual(await store.readHistory(), expectedHistory);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
