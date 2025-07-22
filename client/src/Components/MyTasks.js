import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);  // <-- Add state for users
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const loggedInUserId = 1;

  useEffect(() => {
    // Fetch tasks
    axios.get('http://localhost:5000/api/tasks')
      .then(res => {
        const myTasks = res.data.filter(
          task => task.created_by_id === loggedInUserId || task.assigned_to_id === loggedInUserId
        );
        setTasks(myTasks);
      })
      .catch(() => alert('Failed to load tasks'));

    // Fetch users
    axios.get('http://localhost:5000/api/users')
      .then(res => setUsers(res.data))
      .catch(() => alert('Failed to load users'));
  }, []);

  const filtered = tasks.filter(task =>
    (filterPriority ? task.priority === filterPriority : true) &&
    (filterStatus ? task.status === filterStatus : true)
  );

  const sortedTasks = React.useMemo(() => {
    if (!sortConfig.key) return filtered;

    const sorted = [...filtered].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === 'due_date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filtered, sortConfig]);

  const requestSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = key => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  // Helper to get user name by id
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  };

  // 🎨 Styles (unchanged)...
  const containerStyle = {
    fontFamily: "'Segoe UI', sans-serif",
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
    cursor: 'pointer',
    userSelect: 'none',
  };

  const thTdStyle = {
    border: '1px solid #453A49',
    padding: '14px 18px',
    textAlign: 'left',
    fontSize: '1rem',
    color: '#F1F1F1',
  };

  const filterLabelStyle = {
    marginRight: '1.5rem',
    fontWeight: '600',
    color: '#F1F1F1',
  };

  const selectStyle = {
    marginLeft: '0.5rem',
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #453A49',
    fontSize: '1rem',
    backgroundColor: '#282F44',
    color: '#F1F1F1',
  };

  const editLinkStyle = {
    color: '#6D3B47',
    textDecoration: 'none',
    fontWeight: 'bold',
  };

  const deleteButtonStyle = {
    backgroundColor: '#6D3B47',
    color: '#F1F1F1',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  };

  const handleDelete = (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      axios.delete(`http://localhost:5000/api/tasks/${task.id}`)
        .then(() => {
          setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
        })
        .catch(() => alert('Failed to delete task'));
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#F1F1F1', marginBottom: '1rem' }}>My Tasks</h2>

      <div>
        <label style={filterLabelStyle}>
          Priority:
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            style={selectStyle}
          >
            <option value="">All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </label>

        <label style={filterLabelStyle}>
          Status:
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={selectStyle}
          >
            <option value="">All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </label>
      </div>

      <table style={{ ...containerStyle, backgroundColor: 'transparent', boxShadow: 'none', marginTop: '1rem' }}>
        <thead style={headerStyle}>
          <tr>
            <th style={thTdStyle} onClick={() => requestSort('title')}>Title {getSortIcon('title')}</th>
            <th style={thTdStyle}>Description</th>
            <th style={thTdStyle} onClick={() => requestSort('priority')}>Priority {getSortIcon('priority')}</th>
            <th style={thTdStyle} onClick={() => requestSort('due_date')}>Due Date {getSortIcon('due_date')}</th>
            <th style={thTdStyle} onClick={() => requestSort('status')}>Status {getSortIcon('status')}</th>
            <th style={thTdStyle}>Assigned To</th> {/* Added Assigned To column */}
            <th style={thTdStyle}>Edit</th>
            <th style={thTdStyle}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.length ? (
            sortedTasks.map(task => (
              <tr key={task.id}>
                <td style={thTdStyle}>{task.title}</td>
                <td style={thTdStyle}>{task.description || '-'}</td>
                <td style={thTdStyle}>{task.priority}</td>
                <td style={thTdStyle}>{task.due_date}</td>
                <td style={thTdStyle}>{task.status}</td>
                <td style={thTdStyle}>{getUserName(task.assigned_to_id)}</td> {/* Show user name */}
                <td style={thTdStyle}>
                  <Link to={`/tasks/edit/${task.id}`} style={editLinkStyle}>
                    Edit
                  </Link>
                </td>
                <td style={thTdStyle}>
                  <button
                    style={deleteButtonStyle}
                    onMouseOver={e => (e.target.style.backgroundColor = '#8E4C5C')}
                    onMouseOut={e => (e.target.style.backgroundColor = '#6D3B47')}
                    onClick={() => handleDelete(task)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={{ ...thTdStyle, textAlign: 'center' }} colSpan="8">
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyTasks;