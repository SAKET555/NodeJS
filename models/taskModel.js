// models/taskModel.js
// Simple in-memory store with optional file persistence.

const fs = require('fs');
const path = require('path');
const fileStore = require('../utils/fileStore');

const DATA_FILE = path.join(__dirname, '..', 'tasks.json');

let tasks = [];
let nextId = 1;

// Load persisted tasks if file exists (bonus)
if (fs.existsSync(DATA_FILE)) {
  try {
    const data = fileStore.read(DATA_FILE);
    if (Array.isArray(data)) {
      tasks = data;
      const maxId = tasks.reduce((m, t) => Math.max(m, t.id || 0), 0);
      nextId = maxId + 1;
    }
  } catch (err) {
    console.error('Could not read tasks.json — starting with empty store');
  }
}

function persist() {
  try {
    fileStore.write(DATA_FILE, tasks);
  } catch (err) {
    console.error('Error persisting tasks:', err.message);
  }
}

function createTask({ title, description, status = 'pending' }) {
  const newTask = {
    id: nextId++,
    title,
    description,
    status,
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  persist();
  return newTask;
}

function getAllTasks({ status, sort }) {
  let result = [...tasks];
  if (status) {
    result = result.filter(t => t.status === status);
  }
  if (sort === 'asc') {
    result.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sort === 'desc') {
    result.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return result;
}

function getTaskById(id) {
  return tasks.find(t => t.id === id);
}

function updateTask(id, { title, description, status }) {
  const task = getTaskById(id);
  if (!task) return null;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  persist();
  return task;
}

function deleteTask(id) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  persist();
  return true;
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
};
