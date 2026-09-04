import { randomUUID } from 'node:crypto';

export class ExecutionRunner {
  constructor({ taskStore, executionStore, onTasksChanged, onExecutionChanged }) {
    this.taskStore = taskStore;
    this.executionStore = executionStore;
    this.onTasksChanged = onTasksChanged;
    this.onExecutionChanged = onExecutionChanged;
  }

  async getSnapshot() {
    return {
      state: await this.executionStore.readState(),
      history: await this.executionStore.readHistory(),
    };
  }

  async start() {
    const existingState = await this.executionStore.readState();
    if (existingState.running) {
      const error = new Error('An execution batch is already active.');
      error.statusCode = 409;
      throw error;
    }

    const todos = await this.taskStore.getTasksByStatus('Todo');
    if (todos.length === 0) {
      const error = new Error('No Todo tasks are queued for execution.');
      error.statusCode = 400;
      throw error;
    }

    const batchId = randomUUID();
    const startedAt = new Date().toISOString();
    const currentTask = todos[0];
    const state = {
      running: true,
      phase: 'awaiting_implementation',
      startedAt,
      finishedAt: null,
      currentTaskId: currentTask.id,
      currentTaskTitle: currentTask.title,
      completedTaskIds: [],
      remainingTaskIds: todos.slice(1).map((task) => task.id),
      totalTasks: todos.length,
      batchId,
      lastMessage: `Execution batch ${batchId} started. Task ${currentTask.id} is now ready for real implementation.`,
      logs: [
        this.createLogEntry('batch_started', `Execution batch ${batchId} started with ${todos.length} todo task${todos.length === 1 ? '' : 's'}.`),
        this.createLogEntry('task_selected', `Selected task ${currentTask.id} as the current implementation target.`, currentTask),
      ],
    };

    await this.taskStore.updateTaskStatus(
      currentTask.id,
      'In progress',
      `Execution batch ${batchId} selected this task for actual implementation on ${startedAt}.`
    );
    await this.executionStore.writeState(state);
    await this.onTasksChanged();
    await this.#broadcastExecution();
    return state;
  }

  async sync() {
    const state = await this.executionStore.readState();
    if (!state.running) {
      return state;
    }

    const currentTask = await this.taskStore.getTask(state.currentTaskId);
    if (currentTask.status === 'Done') {
      return this.#advanceBatch(state, currentTask);
    }

    return state;
  }

  async #broadcastExecution() {
    await this.onExecutionChanged();
  }

  async #advanceBatch(state, completedTask) {
    const completedAt = new Date().toISOString();
    const completedTaskIds = [...state.completedTaskIds, completedTask.id];
    const remainingTaskIds = [...state.remainingTaskIds];
    const allTasks = await this.#resolveBatchTasks(remainingTaskIds);
    const nextTask = allTasks[0] ?? null;

    if (nextTask) {
      const restIds = allTasks.slice(1).map((task) => task.id);
      await this.taskStore.updateTaskStatus(
        nextTask.id,
        'In progress',
        `Execution batch ${state.batchId} selected this task for actual implementation on ${completedAt}.`
      );
      await this.executionStore.writeState({
        ...state,
        phase: 'awaiting_implementation',
        currentTaskId: nextTask.id,
        currentTaskTitle: nextTask.title,
        completedTaskIds,
        remainingTaskIds: restIds,
        lastMessage: `Task ${completedTask.id} was completed. Task ${nextTask.id} is now ready for implementation.`,
        logs: [
          ...state.logs,
          this.createLogEntry('task_completed', `Confirmed task ${completedTask.id} as done.`, completedTask),
          this.createLogEntry('task_selected', `Selected task ${nextTask.id} as the current implementation target.`, nextTask),
        ],
      });
      await this.onTasksChanged();
      await this.#broadcastExecution();
      return this.executionStore.readState();
    }

    const finishedAt = new Date().toISOString();
    const finalLogs = [
      ...state.logs,
      this.createLogEntry('task_completed', `Confirmed task ${completedTask.id} as done.`, completedTask),
      this.createLogEntry('batch_finished', `Execution batch ${state.batchId} finished at ${finishedAt}.`),
    ];
    const history = await this.executionStore.readHistory();
    history.unshift({
      batchId: state.batchId,
      startedAt: state.startedAt,
      finishedAt,
      totalTasks: state.totalTasks,
      completedTaskIds,
      tasks: completedTaskIds.map((id) => ({ id })),
      logs: finalLogs,
    });
    await this.executionStore.writeHistory(history.slice(0, 20));
    await this.executionStore.writeState({
      ...state,
      running: false,
      phase: 'completed',
      finishedAt,
      currentTaskId: null,
      currentTaskTitle: null,
      completedTaskIds,
      remainingTaskIds: [],
      lastMessage: `Execution batch ${state.batchId} finished. All queued tasks now require no further batch action.`,
      logs: finalLogs,
    });
    await this.#broadcastExecution();
    return this.executionStore.readState();
  }

  async #resolveBatchTasks(taskIds) {
    const tasks = await Promise.all(taskIds.map((id) => this.taskStore.getTask(id).catch(() => null)));
    return tasks.filter((task) => task && task.status === 'Todo');
  }

  createLogEntry(type, message, task = null) {
    return {
      at: new Date().toISOString(),
      type,
      taskId: task?.id ?? null,
      taskTitle: task?.title ?? null,
      message,
    };
  }
}
