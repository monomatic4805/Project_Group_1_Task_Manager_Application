import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loggedInUserId = 1;

  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks')
      .then(res => {
        const myTasks = res.data.filter(
          task => task.created_by_id === loggedInUserId || task.assigned_to_id === loggedInUserId
        );
        setTasks(myTasks);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load tasks');
        setLoading(false);
      });
  }, []);

  const tasksByDueDate = tasks.reduce((groups, task) => {
    const date = task.due_date || 'No Due Date';
    if (!groups[date]) groups[date] = [];
    groups[date].push(task);
    return groups;
  }, {});

  // ✨ Custom Styles Using Palette
  const containerStyle = {
    fontFamily: "'Roboto', sans-serif",
    maxWidth: '900px',
    margin: '2rem auto',
    padding: '1.5rem',
    borderRadius: '12px',
    backgroundColor: '#191D32',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    color: '#F1F1F1',
  };

  const headerStyle = {
    backgroundColor: '#282F44',
    color: '#F1F1F1',
    padding: '10px 15px',
    borderRadius: '6px',
    marginTop: '1.5rem',
    fontSize: '1.1rem',
  };

  const taskStyle = {
    border: '1px solid #453A49',
    padding: '12px 15px',
    marginTop: '8px',
    borderRadius: '6px',
    backgroundColor: '#282F44',
    color: '#F1F1F1',
  };

  const titleStyle = {
    textAlign: 'center',
    color: '#6D3B47',
    marginBottom: '1rem',
    fontWeight: '700',
    fontSize: '1.5rem',
  };

  if (loading) return <p style={{ textAlign: 'center', color: '#F1F1F1' }}>Loading tasks...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Tasks by Due Date</h2>

      {Object.keys(tasksByDueDate).length === 0 && (
        <p style={{ textAlign: 'center', color: '#F1F1F1' }}>No tasks found.</p>
      )}

      {Object.entries(tasksByDueDate).sort().map(([dueDate, tasks]) => (
        <div key={dueDate}>
          <h3 style={headerStyle}>
            {dueDate === 'No Due Date' ? dueDate : new Date(dueDate).toLocaleDateString()}
          </h3>
          {tasks.map(task => (
            <div key={task.id} style={taskStyle}>
              <strong>{task.title}</strong> — Priority: {task.priority}, Status: {task.status}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Home;