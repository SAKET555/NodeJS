// routes/tasks.js
const express = require('express');
const router = express.Router();
const model = require('../models/taskModel');
const { validateTask, allowedStatuses } = require('../middleware/validate');

// Create Task
router.post('/', validateTask, (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const task = model.createTask({ title, description, status });
    return res.status(201).json({ success: true, message: 'Task created', data: task });
  } catch (err) {
    next(err);
  }
});

// Get All Tasks (supports ?status=... & ?sort=asc|desc)
router.get('/', (req, res, next) => {
  try {
    const { status, sort } = req.query;
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
    }
    if (sort && !['asc', 'desc'].includes(sort)) {
      return res.status(400).json({ success: false, message: 'Invalid sort value. Use asc or desc' });
    }
    const tasks = model.getAllTasks({ status, sort });
    return res.json({ success: true, message: 'Tasks retrieved', data: tasks });
  } catch (err) {
    next(err);
  }
});

// Get Single Task
router.get('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const task = model.getTaskById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    return res.json({ success: true, message: 'Task retrieved', data: task });
  } catch (err) {
    next(err);
  }
});

// Update Task
router.put('/:id', validateTask, (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, description, status } = req.body;
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `status must be one of: ${allowedStatuses.join(', ')}` });
    }
    const updated = model.updateTask(id, { title, description, status });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    return res.json({ success: true, message: 'Task updated', data: updated });
  } catch (err) {
    next(err);
  }
});

// Delete Task
router.delete('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const removed = model.deleteTask(id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    return res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
