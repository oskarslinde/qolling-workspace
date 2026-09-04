import { createServer } from 'node:http';
import { createReadStream, watch, mkdirSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TaskStore, STATUSES } from './taskStore.js';
import { ExecutionStore } from './executionStore.js';
import { ExecutionRunner } from './executionRunner.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const appDir = resolve(__dirname, '..');
const tasksDir = join(appDir, 'tasks');
mkdirSync(tasksDir, { recursive: true });

const publicDir = join(appDir, 'public');
const store = new TaskStore(tasksDir);
const executionStore = new ExecutionStore(tasksDir);
const port = Number(process.env.PORT ?? 4317);
const clients = new Set();
const runner = new ExecutionRunner({
  taskStore: store,
  executionStore,
  onTasksChanged: broadcastTasks,
  onExecutionChanged: broadcastExecution,
});

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (url.pathname === '/api/tasks' && request.method === 'GET') {
      return sendJson(response, { statuses: STATUSES, tasks: await store.listTasks() });
    }

    if (url.pathname === '/api/execution' && request.method === 'GET') {
      return sendJson(response, await runner.getSnapshot());
    }

    if (url.pathname.match(/^\/api\/tasks\/[^/]+\/status$/) && request.method === 'PATCH') {
      const id = decodeURIComponent(url.pathname.split('/')[3]);
      const body = await readJson(request);
      const task = await store.updateTaskStatus(id, body.status, body.note);
      await runner.sync();
      broadcastTasks();
      broadcastExecution();
      return sendJson(response, { task });
    }

    if (url.pathname === '/api/execute' && request.method === 'POST') {
      const state = await runner.start();
      return sendJson(response, { state }, 202);
    }

    if (url.pathname === '/api/events' && request.method === 'GET') {
      return openEvents(response);
    }

    return serveStatic(url.pathname, response);
  } catch (error) {
    sendJson(response, { error: error.message }, error.statusCode ?? 500);
  }
});

server.listen(port, () => {
  console.log(`Qolling task manager: http://localhost:${port}`);
});

watch(tasksDir, { persistent: false }, (_eventType, filename) => {
  if (filename && (filename.startsWith('TASKS') || filename.startsWith('TASK_EXECUTION'))) {
    broadcastTasks();
    broadcastExecution();
  }
});

async function broadcastTasks() {
  try {
    const payload = JSON.stringify({ statuses: STATUSES, tasks: await store.listTasks() });
    for (const client of clients) {
      client.write(`event: tasks\ndata: ${payload}\n\n`);
    }
  } catch (error) {
    console.error('Failed to broadcast tasks update:', error);
  }
}

async function broadcastExecution() {
  try {
    const payload = JSON.stringify(await runner.getSnapshot());
    for (const client of clients) {
      client.write(`event: execution\ndata: ${payload}\n\n`);
    }
  } catch (error) {
    console.error('Failed to broadcast execution update:', error);
  }
}

function openEvents(response) {
  response.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  response.write('\n');
  clients.add(response);
  response.on('close', () => clients.delete(response));
}

async function serveStatic(pathname, response) {
  const safePath = pathname === '/' ? '/index.html' : pathname;
  const filePath = resolve(publicDir, `.${safePath}`);
  if (!filePath.startsWith(publicDir)) {
    return sendJson(response, { error: 'Not found' }, 404);
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error('Not a file');
  } catch {
    return sendJson(response, { error: 'Not found' }, 404);
  }

  response.writeHead(200, { 'Content-Type': contentType(filePath) });
  createReadStream(filePath).pipe(response);
}

function contentType(path) {
  return {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
  }[extname(path)] ?? 'application/octet-stream';
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function sendJson(response, data, status = 200) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
}
