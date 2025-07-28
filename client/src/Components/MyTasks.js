import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);

  const loggedInUserId = 1; // Replace with actual logged-in user ID

  useEffect(() => {
    // Fetch tasks assigned to or created by logged-in user
    axios.get('http://localhost:5000/api/tasks')
      .then(res => {
        console.log("Loaded tasks:", res.data);
        const myTasks = res.data.filter(task =>
          task.created_by_id === loggedInUserId || task.assigned_to_id === loggedInUserId
        );
        setTasks(myTasks);
        setLoadingTasks(false);
      })
      .catch(err => {
        setError('Failed to load tasks');
        setLoadingTasks(false);
      });

    // Fetch users
    axios.get('http://localhost:5000/api/users')
      .then(res => {
        console.log("Loaded users:", res.data);
        setUsers(res.data);
        setLoadingUsers(false);
      })
      .catch(err => {
        setError('Failed to load users');
        setLoadingUsers(false);
      });
  }, []);

  // Get user name by ID (returns 'Unknown' if not found)
  const getUserName = (id) => {
    const user = users.find(u => u.id === id);
    return user ? user.name : 'Unknown';
  };

  // Filter tasks by priority and status
  const filteredTasks = useMemo(() => {
    return tasks.filter(task =>
      (!filterPriority || task.priority === filterPriority) &&
      (!filterStatus || task.status === filterStatus)
    );
  }, [tasks, filterPriority, filterStatus]);

  // Sort filtered tasks based on sortConfig
  const sortedTasks = useMemo(() => {
    if (!sortConfig.key) return filteredTasks;

    return [...filteredTasks].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === 'due_date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = typeof aVal === 'string' ? aVal.toLowerCase() : aVal;
        bVal = typeof bVal === 'string' ? bVal.toLowerCase() : bVal;
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTasks, sortConfig]);

  // Toggle sorting on column click
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Delete task with confirmation
  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios.delete(`http://localhost:5000/api/tasks/${id}`)
        .then(() => setTasks(prev => prev.filter(task => task.id !== id)))
        .catch(() => alert('Failed to delete task'));
    }
  };

  // Styles
  const styles = {
    container: {
      fontFamily: 'Segoe UI, sans-serif',
      maxWidth: '950px',
      margin: '2rem auto',
      padding: '2rem',
      borderRadius: '10px',
      backgroundColor: '#191D32',
      color: '#F1F1F1',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    },
    filters: {
      display: 'flex',
      gap: '2rem',
      marginBottom: '1.5rem',
    },
    select: {
      padding: '8px 12px',
      borderRadius: '6px',
      backgroundColor: '#282F44',
      color: '#F1F1F1',
      border: '1px solid #453A49',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '12px',
      borderBottom: '1px solid #444',
      cursor: 'pointer',
      backgroundColor: '#282F44',
      textAlign: 'left',
      userSelect: 'none',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #333',
    },
    button: {
      backgroundColor: '#6D3B47',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '6px',
      color: '#F1F1F1',
      cursor: 'pointer',
      fontWeight: '600',
    },
    link: {
      color: '#6D3B47',
      textDecoration: 'none',
      fontWeight: 'bold',
    },
    loading: {
      textAlign: 'center',
      fontSize: '1.2rem',
      padding: '2rem',
      color: '#bbb',
    }
  };

  if (loadingTasks || loadingUsers) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.loading}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>My Tasks</h2>

      <div style={styles.filters}>
        <label>
          Priority:
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            style={styles.select}
          >
            <option value="">All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </label>

        <label>
          Status:
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={styles.select}
          >
            <option value="">All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </label>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th} onClick={() => requestSort('title')}>
              Title {sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th style={styles.th}>Description</th>
            <th style={styles.th} onClick={() => requestSort('priority')}>
              Priority {sortConfig.key === 'priority' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th style={styles.th} onClick={() => requestSort('due_date')}>
              Due Date {sortConfig.key === 'due_date' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th style={styles.th} onClick={() => requestSort('status')}>
              Status {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th style={styles.th}>Assigned To</th>
            <th style={styles.th}>Edit</th>
            <th style={styles.th}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.length > 0 ? (
            sortedTasks.map(task => (
              <tr key={task.id}>
                <td style={styles.td}>{task.title}</td>
                <td style={styles.td}>{task.description || '-'}</td>
                <td style={styles.td}>{task.priority}</td>
                <td style={styles.td}>{task.due_date}</td>
                <td style={styles.td}>{task.status}</td>
                <td style={styles.td}>
                  {task.assigned_to_id ? getUserName(task.assigned_to_id) : 'Unassigned'}
                </td>
                <td style={styles.td}>
                  <Link to={`/tasks/edit/${task.id}`} style={styles.link}>Edit</Link>
                </td>
                <td style={styles.td}>
                  <button onClick={() => deleteTask(task.id)} style={styles.button}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ ...styles.td, textAlign: 'center' }}>
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