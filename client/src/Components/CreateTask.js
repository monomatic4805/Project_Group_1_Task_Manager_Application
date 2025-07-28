import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateTask() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    due_date: '',
    status: 'Open',
    assigned_to_id: '',
    created_by_id: 1, // Replace with actual logged-in user ID if available
  });

  // Fetch users on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/users')
      .then(response => setUsers(response.data))
      .catch(() => alert('Failed to fetch users'));
  }, []);

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  // Submit new task
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/tasks', task)
      .then(() => navigate('/tasks'))
      .catch(() => alert('Failed to create task'));
  };

  // Styling objects
  const containerStyle = {
    maxWidth: '520px',
    margin: '2rem auto',
    padding: '2rem',
    borderRadius: '10px',
    backgroundColor: '#191D32',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    fontFamily: "'Roboto', sans-serif",
    color: '#F1F1F1',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.4rem',
    marginTop: '1.25rem',
    fontWeight: '600',
    color: '#F1F1F1',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #453A49',
    backgroundColor: '#282F44',
    color: '#F1F1F1',
    fontSize: '1rem',
  };

  const textareaStyle = {
    ...inputStyle,
    height: '90px',
    resize: 'vertical',
  };

  const buttonStyle = {
    marginTop: '2rem',
    padding: '12px 24px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#6D3B47',
    color: '#F1F1F1',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    transition: 'background 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#6D3B47', marginBottom: '1rem' }}>Create Task</h2>
      <form onSubmit={handleSubmit}>

        <label style={labelStyle} htmlFor="title">Title:</label>
        <input
          id="title"
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Title"
          required
          style={inputStyle}
        />

        <label style={labelStyle} htmlFor="description">Description (optional):</label>
        <textarea
          id="description"
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Add a description"
          style={textareaStyle}
        />

        <label style={labelStyle} htmlFor="priority">Priority:</label>
        <select
          id="priority"
          name="priority"
          value={task.priority}
          onChange={handleChange}
          style={inputStyle}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <label style={labelStyle} htmlFor="due_date">Due Date:</label>
        <input
          id="due_date"
          type="date"
          name="due_date"
          value={task.due_date}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label style={labelStyle} htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={task.status}
          onChange={handleChange}
          style={inputStyle}
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        {/* Assigned To dropdown */}
        <label style={labelStyle} htmlFor="assigned_to_id">Assign To:</label>
        <select
          id="assigned_to_id"
          name="assigned_to_id"
          value={task.assigned_to_id}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">-- Select User --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name /* or user.username depending on API */}
            </option>
          ))}
        </select>

        <button type="submit" style={buttonStyle}>Create Task</button>
      </form>
    </div>
  );
}

export default CreateTask;