const columns = ['Postponed', 'Open', 'UI improvements', 'Todo', 'In progress', 'Done', 'Archive'];
const board = document.querySelector('#board');
const connectionStatus = document.querySelector('#connectionStatus');
const taskCount = document.querySelector('#taskCount');
const refreshButton = document.querySelector('#refreshButton');
const executeButton = document.querySelector('#executeButton');
const executionPanel = document.querySelector('#executionPanel');
const executionHistoryPanel = document.querySelector('#executionHistoryPanel');
const executionHeadline = document.querySelector('#executionHeadline');
const executionMeta = document.querySelector('#executionMeta');
const currentTaskText = document.querySelector('#currentTaskText');
const progressFill = document.querySelector('#progressFill');
const executionLog = document.querySelector('#executionLog');
const executionHistory = document.querySelector('#executionHistory');
const dialog = document.querySelector('#taskDialog');
const dialogTitle = document.querySelector('#dialogTitle');
const dialogSection = document.querySelector('#dialogSection');
const dialogDetails = document.querySelector('#dialogDetails');
const dialogActions = document.querySelector('#dialogActions');

let tasks = [];
let execution = { state: null, history: [] };
let draggedTaskId = null;
let suppressNextClick = false;

refreshButton.addEventListener('click', async () => {
  await Promise.all([loadTasks(), loadExecution()]);
});
if (executeButton) {
  executeButton.addEventListener('click', executeTodoTasks);
}

connectEvents();
await Promise.all([loadTasks(), loadExecution()]);

async function loadTasks() {
  const response = await fetch('/api/tasks');
  const data = await response.json();
  tasks = data.tasks;
  renderBoard();
}

async function loadExecution() {
  const response = await fetch('/api/execution');
  execution = await response.json();
  renderExecution();
  renderBoard();
}

function renderBoard() {
  board.innerHTML = '';
  taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;

  for (const status of columns) {
    const columnTasks = tasks.filter((task) => task.status === status);
    const column = document.createElement('article');
    column.className = 'column';
    column.dataset.status = status;
    column.innerHTML = `
      <div class="column-header">
        <h2>${escapeHtml(status)}</h2>
        <span class="badge">${columnTasks.length}</span>
      </div>
      <div class="task-list"></div>
    `;

    const list = column.querySelector('.task-list');
    wireDropZone(column, list, status);

    if (columnTasks.length === 0) {
      list.innerHTML = '<div class="empty">Drop a task here</div>';
    } else {
      for (const task of columnTasks.sort((a, b) => a.number - b.number)) {
        list.appendChild(renderCard(task));
      }
    }

    board.appendChild(column);
  }
}

function renderCard(task) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'task-card';
  card.draggable = !execution.state?.running;
  card.dataset.taskId = task.id;
  card.innerHTML = `
    <span class="card-ticket-id">${escapeHtml(task.ticketId || task.id)}</span>
    <h3>${task.number}. ${escapeHtml(task.title)}</h3>
    <p>${escapeHtml(task.description || task.summary || task.details || 'No description provided.')}</p>
    <span class="card-meta">
      <span>${escapeHtml(task.section)}</span>
    </span>
  `;

  card.addEventListener('click', () => {
    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }
    openTask(task);
  });

  card.addEventListener('dragstart', (event) => {
    if (execution.state?.running) {
      event.preventDefault();
      return;
    }
    draggedTaskId = task.id;
    suppressNextClick = true;
    card.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', task.id);
  });

  card.addEventListener('dragend', () => {
    draggedTaskId = null;
    card.classList.remove('dragging');
    clearDropHighlights();
    setTimeout(() => {
      suppressNextClick = false;
    }, 0);
  });

  return card;
}

function wireDropZone(column, list, status) {
  const activate = (event) => {
    if (!draggedTaskId || execution.state?.running) return;
    event.preventDefault();
    column.classList.add('column-drop-target');
    list.classList.add('task-list-drop-target');
  };

  const deactivate = (event) => {
    if (!column.contains(event.relatedTarget)) {
      column.classList.remove('column-drop-target');
      list.classList.remove('task-list-drop-target');
    }
  };

  const drop = async (event) => {
    if (!draggedTaskId || execution.state?.running) return;
    event.preventDefault();
    clearDropHighlights();
    const task = tasks.find((candidate) => candidate.id === draggedTaskId);
    if (!task || task.status === status) return;
    connectionStatus.textContent = `Moving task ${task.id} to ${status}...`;
    await moveTask(task.id, status, { closeDialog: false });
  };

  column.addEventListener('dragover', activate);
  list.addEventListener('dragover', activate);
  column.addEventListener('dragleave', deactivate);
  list.addEventListener('dragleave', deactivate);
  column.addEventListener('drop', drop);
  list.addEventListener('drop', drop);
}

function clearDropHighlights() {
  document
    .querySelectorAll('.column-drop-target, .task-list-drop-target')
    .forEach((element) => element.classList.remove('column-drop-target', 'task-list-drop-target'));
}

function openTask(task) {
  dialogTitle.textContent = `${task.number}. ${task.title}`;
  dialogSection.textContent = `${task.section} / ${task.status}`;
  dialogDetails.innerHTML = '';
  dialogActions.innerHTML = '';

  const details = [
    ['Description', task.description],
    ['Summary', task.summary],
    ['Likely files', task.likelyFiles],
    ['Details', task.details],
    ['Acceptance', task.acceptance],
    ['Updated', task.updatedAt],
  ].filter(([, value]) => value);

  for (const [label, value] of details) {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    dialogDetails.append(dt, dd);
  }

  for (const status of columns.filter((candidate) => candidate !== task.status)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = status === 'Todo' ? 'primary' : 'secondary';
    button.textContent = `Move to ${status}`;
    button.addEventListener('click', () => moveTask(task.id, status));
    dialogActions.appendChild(button);
  }

  dialog.showModal();
}

async function moveTask(id, status, options = {}) {
  const { closeDialog = true } = options;
  const response = await fetch(`/api/tasks/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();

  if (!response.ok) {
    connectionStatus.textContent = data.error || 'Task move failed.';
    return;
  }

  if (closeDialog && dialog.open) {
    dialog.close();
  }

  connectionStatus.textContent = `Task ${id} moved to ${status}.`;
  await loadTasks();
}

async function executeTodoTasks() {
  if (!executeButton) return;
  executeButton.disabled = true;
  executeButton.textContent = 'Executing...';
  try {
    const response = await fetch('/api/execute', { method: 'POST' });
    const data = await response.json();
    if (!response.ok) {
      connectionStatus.textContent = data.error || 'Execution failed.';
      return;
    }
    execution.state = data.state;
    connectionStatus.textContent = 'Execution batch started.';
    renderExecution();
    renderBoard();
  } finally {
    if (!execution.state?.running) {
      executeButton.disabled = false;
      executeButton.textContent = 'Execute Todo';
    }
  }
}

function renderExecution() {
  const state = execution.state;
  if (!state) return;

  const completed = state.completedTaskIds.length;
  const total = state.totalTasks || 0;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  executionHeadline.textContent = state.lastMessage || 'No execution has started yet.';
  executionMeta.textContent = total === 0
    ? 'Queue is idle.'
    : `Batch ${state.batchId} | ${completed}/${total} completed${state.running ? ' | Running' : ' | Finished'}`;
  currentTaskText.textContent = state.currentTaskTitle
    ? `Current task: ${state.currentTaskId}. ${state.currentTaskTitle}`
    : state.running
      ? 'Preparing next task...'
      : 'No task is currently executing.';
  progressFill.style.width = `${percent}%`;
  if (executeButton) {
    executeButton.disabled = state.running;
    executeButton.textContent = state.running ? 'Batch Active' : 'Execute Todo';
  }

  executionLog.innerHTML = '';
  const liveLogs = [...(state.logs || [])].slice(-12).reverse();
  if (!liveLogs.length) {
    executionLog.innerHTML = '<div class="empty">No batch log entries yet</div>';
  } else {
    for (const item of liveLogs) {
      const node = document.createElement('article');
      node.className = 'log-item';
      node.innerHTML = `
        <div class="log-meta">${escapeHtml(item.at)}${item.taskId ? ` | Task ${escapeHtml(item.taskId)}` : ''}</div>
        <div>${escapeHtml(item.message)}</div>
      `;
      executionLog.appendChild(node);
    }
  }

  executionHistory.innerHTML = '';
  if (!execution.history.length) {
    executionHistoryPanel.open = false;
    executionHistory.innerHTML = '<div class="empty">No execution history yet</div>';
    return;
  }
  if (!executionHistoryPanel.hasAttribute('data-user-toggled')) {
    executionHistoryPanel.open = false;
  }

  for (const item of execution.history.slice(0, 8)) {
    const node = document.createElement('details');
    node.className = 'history-item';
    const historyLogs = [...(item.logs || [])].slice().reverse();
    const logsMarkup = historyLogs.length
      ? historyLogs.map((entry) => `
        <article class="log-item">
          <div class="log-meta">${escapeHtml(entry.at)}${entry.taskId ? ` | Task ${escapeHtml(entry.taskId)}` : ''}</div>
          <div>${escapeHtml(entry.message)}</div>
        </article>
      `).join('')
      : '<div class="empty">No saved log entries</div>';
    node.innerHTML = `
      <summary>Batch ${escapeHtml(item.batchId)} | ${item.completedTaskIds.length} completed task${item.completedTaskIds.length === 1 ? '' : 's'}</summary>
      <p><strong>Started:</strong> ${escapeHtml(item.startedAt)}</p>
      <p><strong>Finished:</strong> ${escapeHtml(item.finishedAt)}</p>
      <div class="log-list">${logsMarkup}</div>
    `;
    executionHistory.appendChild(node);
  }
}

executionHistoryPanel.addEventListener('toggle', () => {
  executionHistoryPanel.dataset.userToggled = 'true';
});

function connectEvents() {
  if (!window.EventSource) {
    connectionStatus.textContent = 'Live updates unavailable; use Refresh.';
    return;
  }

  const events = new EventSource('/api/events');
  events.addEventListener('open', () => {
    connectionStatus.textContent = 'Live updates connected.';
  });
  events.addEventListener('tasks', (event) => {
    tasks = JSON.parse(event.data).tasks;
    connectionStatus.textContent = 'Task files updated.';
    renderBoard();
  });
  events.addEventListener('execution', (event) => {
    execution = JSON.parse(event.data);
    connectionStatus.textContent = execution.state?.running ? 'Execution running.' : 'Execution state updated.';
    renderExecution();
    renderBoard();
  });
  events.addEventListener('error', () => {
    connectionStatus.textContent = 'Reconnecting live updates; Refresh still works.';
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
