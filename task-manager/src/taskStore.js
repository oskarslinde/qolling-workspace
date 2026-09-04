import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export const STATUSES = ['Postponed', 'Open', 'UI improvements', 'Todo', 'In progress', 'Done', 'Archive'];
const COUNTER_FILE = 'TASK_TICKET_COUNTERS.json';
const TICKET_PREFIXES = ['BO', 'HE', 'ZE'];

const FILES = {
  active: 'TASKS.md',
  postponed: 'TASKS_POSTPONED.md',
  done: 'TASKS_DONE.md',
  archive: 'TASKS_ARCHIVE.md',
};

const STATUS_FILE = {
  Postponed: 'postponed',
  Open: 'active',
  'UI improvements': 'active',
  Todo: 'active',
  'In progress': 'active',
  Done: 'done',
  Archive: 'archive',
};

const FILE_TITLES = {
  active: {
    title: 'Tasks',
    intro: [
      'This file consolidates active Qolling follow-up work.',
      '',
      'Completed tasks move to [`TASKS_DONE.md`](/abs/path/C:/Users/user/java/qolling/task-manager/tasks/TASKS_DONE.md).',
      'Postponed tasks move to [`TASKS_POSTPONED.md`](/abs/path/C:/Users/user/java/qolling/task-manager/tasks/TASKS_POSTPONED.md).',
      '',
      'Status values used here:',
      '- `Open`',
      '- `UI improvements`',
      '- `Todo`',
      '- `In progress`',
    ],
  },
  postponed: {
    title: 'Postponed Tasks',
    intro: ['This file contains tasks moved out of `TASKS.md` because their status was `Postponed`.'],
  },
  done: {
    title: 'Done Tasks',
    intro: ['This file contains tasks moved out of `TASKS.md` because their status was `Done`.'],
  },
  archive: {
    title: 'Archived Tasks',
    intro: ['This file contains tasks archived out of the active task workflow.'],
  },
};

export class TaskStore {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  async listTasks() {
    const tasks = await this.#loadTasks();
    return tasks;
  }

  async updateTaskStatus(taskId, status, note) {
    assertStatus(status);
    const allTasks = await this.#loadTasks();
    const task = allTasks.find((candidate) => candidate.id === taskId);

    if (!task) {
      const error = new Error(`Task ${taskId} was not found.`);
      error.statusCode = 404;
      throw error;
    }

    task.status = status;
    task.fileKey = STATUS_FILE[status];
    task.updatedAt = new Date().toISOString();
    if (note) {
      task.extraLines.push(`- Execution log: ${note}`);
    }

    await this.#writeTasks(allTasks);
    return task;
  }

  async getTasksByStatus(status) {
    assertStatus(status);
    return (await this.#loadTasks())
      .filter((task) => task.status === status)
      .sort((a, b) => a.number - b.number);
  }

  async getTask(taskId) {
    const task = (await this.#loadTasks())
      .find((candidate) => candidate.id === taskId);

    if (!task) {
      const error = new Error(`Task ${taskId} was not found.`);
      error.statusCode = 404;
      throw error;
    }

    return task;
  }

  async #readAllFiles() {
    const entries = {};
    for (const [key, filename] of Object.entries(FILES)) {
      entries[key] = {
        key,
        path: join(this.rootDir, filename),
        content: await readIfExists(join(this.rootDir, filename), renderEmptyFile(key)),
      };
    }
    return entries;
  }

  async #loadTasks() {
    const files = await this.#readAllFiles();
    const tasks = Object.values(files).flatMap(({ key, content }) => parseTasks(content, key));
    const countersPath = join(this.rootDir, COUNTER_FILE);
    const counters = normalizeCounters(await readJsonIfExists(countersPath, defaultCounters()));

    let changed = false;
    for (const task of tasks) {
      if (task.ticketId) {
        const { prefix, value } = parseTicketId(task.ticketId);
        if (prefix && value) {
          counters[prefix] = Math.max(counters[prefix], value);
        }
        continue;
      }

      const prefix = inferTicketPrefix(task);
      counters[prefix] += 1;
      task.ticketId = formatTicketId(prefix, counters[prefix]);
      task.id = task.ticketId;
      changed = true;
    }

    if (changed) {
      await this.#writeTasks(tasks);
    }

    await atomicWrite(countersPath, JSON.stringify(counters, null, 2));
    return tasks;
  }

  async #writeTasks(tasks) {
    const byFile = Object.fromEntries(Object.keys(FILES).map((key) => [key, []]));
    for (const task of tasks) {
      byFile[task.fileKey].push(task);
    }

    for (const [key, fileTasks] of Object.entries(byFile)) {
      const fullPath = join(this.rootDir, FILES[key]);
      await atomicWrite(fullPath, renderFile(key, fileTasks));
    }
  }
}

export function parseTasks(markdown, fileKey = 'active') {
  const tasks = [];
  const lines = markdown.split(/\r?\n/);
  let section = 'General';
  let current = null;
  let autoNumber = 1;

  for (const line of lines) {
    const sectionMatch = line.match(/^## (.+)$/);
    const taskMatch = line.match(/^###\s+(?:(\d+)\.\s+)?(.+)$/);

    if (sectionMatch) {
      section = sectionMatch[1].trim();
      current = null;
      continue;
    }

    if (taskMatch) {
      const explicitNumber = taskMatch[1] ? Number(taskMatch[1]) : null;
      const taskNumber = explicitNumber ?? autoNumber;
      autoNumber = Math.max(autoNumber, taskNumber + 1);
      current = {
        id: String(taskNumber),
        ticketId: '',
        number: taskNumber,
        title: taskMatch[2].trim(),
        section,
        status: defaultStatusForFile(fileKey),
        fileKey,
        description: '',
        summary: '',
        likelyFiles: '',
        details: '',
        acceptance: '',
        updatedAt: '',
        extraLines: [],
      };
      tasks.push(current);
      continue;
    }

    if (!current) {
      continue;
    }

    if (line.trim() === '---') {
      current = null;
      continue;
    }

    const fieldMatch = line.match(/^- ([^:]+):\s*(.*)$/);
    if (!fieldMatch) {
      if (line.trim()) current.extraLines.push(line);
      continue;
    }

    const field = fieldMatch[1].trim().toLowerCase();
    const value = fieldMatch[2].trim();
    if (field === 'description') current.description = value;
    else if (field === 'status') current.status = normalizeStatus(stripEnclosingTicks(value));
    else if (field === 'ticket id') {
      current.ticketId = stripEnclosingTicks(value);
      current.id = current.ticketId;
    }
    else if (field === 'summary') current.summary = value;
    else if (field === 'likely files') current.likelyFiles = value;
    else if (field === 'details') current.details = value;
    else if (field === 'acceptance') current.acceptance = value;
    else if (field === 'updated') current.updatedAt = value;
    else current.extraLines.push(line);
  }

  for (const task of tasks) {
    assertStatus(task.status);
    task.fileKey = STATUS_FILE[task.status];
  }

  return tasks;
}

export function renderFile(fileKey, tasks) {
  const grouped = groupTasks(tasks);
  const parts = [renderEmptyFile(fileKey)];

  for (const [section, sectionTasks] of grouped) {
    parts.push(`## ${section}`);
    parts.push('');
    for (const task of sectionTasks.sort((a, b) => a.number - b.number)) {
      parts.push(renderTask(task));
      parts.push('');
    }
  }

  return `${parts.join('\n').replace(/\n+$/u, '')}\n`;
}

function renderTask(task) {
  const lines = [`### ${task.title}`];
  if (task.ticketId) lines.push(`- Ticket ID: \`${task.ticketId}\``);
  if (task.description) lines.push(`- Description: ${task.description}`);
  lines.push(`- Status: \`${task.status}\``);
  if (task.summary) lines.push(`- Summary: ${task.summary}`);
  if (task.likelyFiles) lines.push(`- Likely files: ${task.likelyFiles}`);
  if (task.details) lines.push(`- Details: ${task.details}`);
  if (task.acceptance) lines.push(`- Acceptance: ${task.acceptance}`);
  if (task.updatedAt) lines.push(`- Updated: ${task.updatedAt}`);
  lines.push(...task.extraLines);
  return lines.join('\n');
}

function groupTasks(tasks) {
  const map = new Map();
  for (const task of tasks.sort((a, b) => a.number - b.number)) {
    if (!map.has(task.section)) map.set(task.section, []);
    map.get(task.section).push(task);
  }
  return map;
}

function renderEmptyFile(fileKey) {
  const meta = FILE_TITLES[fileKey];
  return [`# ${meta.title}`, '', ...meta.intro, '', '---', ''].join('\n');
}

function defaultStatusForFile(fileKey) {
  if (fileKey === 'postponed') return 'Postponed';
  if (fileKey === 'done') return 'Done';
  if (fileKey === 'archive') return 'Archive';
  return 'Open';
}

function normalizeStatus(status) {
  if (status.toLowerCase() === 'in progres') return 'In progress';
  const match = STATUSES.find((candidate) => candidate.toLowerCase() === status.toLowerCase());
  return match ?? status;
}

function assertStatus(status) {
  if (!STATUSES.includes(status)) {
    const error = new Error(`Unsupported task status: ${status}`);
    error.statusCode = 400;
    throw error;
  }
}

function stripEnclosingTicks(value) {
  return value.replace(/^`([^`]+)`$/u, '$1');
}

function inferTicketPrefix(task) {
  const haystack = `${task.section}\n${task.title}\n${task.description}\n${task.likelyFiles}`.toLowerCase();
  const hasHera = haystack.includes('hera');
  const hasZeus = haystack.includes('zeus');

  if (hasHera && !hasZeus) return 'HE';
  if (hasZeus && !hasHera) return 'ZE';
  return 'BO';
}

function formatTicketId(prefix, value) {
  return `${prefix}-${String(value).padStart(3, '0')}`;
}

function parseTicketId(ticketId) {
  const match = ticketId.match(/^(BO|HE|ZE)-(\d+)$/u);
  if (!match) {
    return { prefix: null, value: 0 };
  }

  return { prefix: match[1], value: Number(match[2]) };
}

function defaultCounters() {
  return { BO: 0, HE: 0, ZE: 0 };
}

function normalizeCounters(counters) {
  const normalized = defaultCounters();
  for (const prefix of TICKET_PREFIXES) {
    normalized[prefix] = Number.isInteger(counters?.[prefix]) ? counters[prefix] : 0;
  }
  return normalized;
}

async function readIfExists(path, fallback) {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

async function atomicWrite(path, content) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, 'utf8');
}

async function readJsonIfExists(path, fallback) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    if (error instanceof SyntaxError) return fallback;
    throw error;
  }
}
