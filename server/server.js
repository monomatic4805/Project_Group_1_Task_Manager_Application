const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock task data
let tasks = [
  {
    id: 1,
    title: "Sample Task",
    priority: "High",
    due_date: "2025-08-01",
    status: "Open",
    assigned_to_id: 1,
    created_by_id: 1,
  },
];

// ✅ Updated mock user data with `username`
let users = [
  { id: 1, username: "Rizelle Nolasco" },
  { id: 2, username: "Bob Smith" },
  { id: 3, username: "Charlie Davis" },
];

// ========== TASK ROUTES ========== //

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Get task by ID
app.get('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

// Create new task
app.post('/api/tasks', (req, res) => {
  const newTask = {
    ...req.body,
    id: tasks.length + 1,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update a task by ID
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: "Task not found" });

  tasks[index] = { ...tasks[index], ...req.body };
  res.json(tasks[index]);
});

// Delete task by ID
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: "Task not found" });

  tasks.splice(index, 1);
  res.status(204).send();
});

// ========== USER ROUTES ========== //

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// ========== SERVER START ========== //

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));