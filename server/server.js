import pg from "pg";
const express = require('express');
const cors = require('cors');
const app = express();

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "blogapp",
    password: "PASSWORD", // insert password here
    port: 5432
});
db.connect();

app.use(cors());
app.use(express.json());

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

// Update task
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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
