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

/*
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
*/

let tasks = [];
db.query("SELECT * FROM tasks", (err, res) => {
    if (err) {
        console.error("Error executing query on tasks", err.stack);
    } else {
        tasks = res.rows;
    }
    db.end();
});

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
    ...req.body // ,
    // id: tasks.length + 1,
  };
  // tasks.push(newTask);

  db.query("INSERT INTO tasks " +
    "(creator_username, assigned_to, title, description, priority, status, due_date) " +
    "VALUES ($1, $2, $3, $4, $5, $6, $7)",
    newTask.created_by_id, newTask.assign_to_id, newTask.title, newTask.description,
    newTask.priority, newTask.status, newTask.due_date,
    (err, res) => {
    if (err) {
        console.error("Error executing query on tasks", err.stack);
    } else {
        res.status(201).json(newTask);
    }
    db.end();
});

  // res.status(201).json(newTask);
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
