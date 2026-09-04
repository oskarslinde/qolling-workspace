import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const STATE_FILE = 'TASK_EXECUTION_STATE.json';
const HISTORY_FILE = 'TASK_EXECUTION_HISTORY.json';

export class ExecutionStore {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.lastState = emptyState();
    this.lastHistory = [];
  }

  async readState() {
    const state = await readJsonIfExists(join(this.rootDir, STATE_FILE), this.lastState);
    this.lastState = state;
    return state;
  }

  async writeState(state) {
    this.lastState = state;
    await atomicWrite(join(this.rootDir, STATE_FILE), JSON.stringify(state, null, 2));
  }

  async readHistory() {
    const history = await readJsonIfExists(join(this.rootDir, HISTORY_FILE), this.lastHistory);
    this.lastHistory = history;
    return history;
  }

  async writeHistory(history) {
    this.lastHistory = history;
    await atomicWrite(join(this.rootDir, HISTORY_FILE), JSON.stringify(history, null, 2));
  }
}

export function emptyState() {
  return {
    running: false,
    phase: 'idle',
    startedAt: null,
    finishedAt: null,
    currentTaskId: null,
    currentTaskTitle: null,
    completedTaskIds: [],
    remainingTaskIds: [],
    totalTasks: 0,
    batchId: null,
    lastMessage: 'No execution has started yet.',
    logs: [],
  };
}

async function readJsonIfExists(path, fallback) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const raw = await readFile(path, 'utf8');
      if (!raw.trim()) {
        throw new SyntaxError('Execution state file is empty.');
      }
      return JSON.parse(raw);
    } catch (error) {
      if (error.code === 'ENOENT') return fallback;
      if (error instanceof SyntaxError) {
        if (attempt === 4) {
          return fallback;
        }
        await delay(40);
        continue;
      }
      throw error;
    }
  }

  return fallback;
}

async function atomicWrite(path, content) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, 'utf8');
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
