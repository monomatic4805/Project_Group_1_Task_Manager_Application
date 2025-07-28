import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);

  // Fetch task data and users
  useEffect(() => {
    axios.get(`http://localhost:5000/api/tasks/${id}`)
      .then(res => setTask(res.data))
      .catch(() => alert('Failed to load task data'));

    axios.get('http://localhost:5000/api/users')
      .then(res => setUsers(res.data))
      .catch(() => alert('Failed to load users'));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/tasks/${id}`, task)
      .then(() => navigate('/tasks'))
      .catch(() => alert('Failed to update task'));
  };

  if (!task) return <p style={{ textAlign: 'center', color: '#F1F1F1' }}>Loading...</p>;

  // 💅 Styles
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
    transition: 'background 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#6D3B47', marginBottom: '1rem' }}>Edit Task</h2>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle} htmlFor="title">Title:</label>
        <input
          id="title"
          name="title"
          value={task.title}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label style={labelStyle} htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={task.description || ''}
          onChange={handleChange}
          style={textareaStyle}
        />

        <label style={labelStyle} htmlFor="priority">Priority:</label>
        <select
          id="priority"
          name="priority"
          value={task.priority}
          onChange={handleChange}
          required
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
          required
          style={inputStyle}
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <label style={labelStyle} htmlFor="assigned_to_id">Assigned To:</label>
        <select
          id="assigned_to_id"
          name="assigned_to_id"
          value={task.assigned_to_id || ''}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">-- Select User --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>

        <button type="submit" style={buttonStyle}>Save</button>
      </form>
    </div>
  );
}

export default EditTask;