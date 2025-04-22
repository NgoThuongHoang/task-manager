const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Subtask = require('../models/Subtask');

// Get all tasks with subtasks
router.get('/', async (req, res) => {
  const tasks = await Task.findAll({ include: 'subtasks' });
  res.json(tasks);
});

// Create new task
router.post('/', async (req, res) => {
  const { title, deadline } = req.body;
  const task = await Task.create({ title, deadline });
  res.json(task);
});

// Add subtask to a task
router.post('/:taskId/subtasks', async (req, res) => {
  const { taskId } = req.params;
  const { title, deadline } = req.body;
  const subtask = await Subtask.create({ title, deadline, taskId });
  res.json(subtask);
});

// Update task or subtask
router.put('/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const model = type === 'task' ? Task : Subtask;
  const item = await model.findByPk(id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  await item.update(req.body);
  res.json(item);
});

// Delete task or subtask
router.delete('/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const model = type === 'task' ? Task : Subtask;
  const item = await model.findByPk(id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  await item.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = router;