import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

function TaskList({ tasks, users, onDelete }) {
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter tasks based on priority and status
  const filteredTasks = useMemo(() => {
    return tasks.filter(t =>
      (!filterPriority || t.priority === filterPriority) &&
      (!filterStatus || t.status === filterStatus)
    );
  }, [tasks, filterPriority, filterStatus]);

  // Sort filtered tasks
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

  // Toggle sorting direction or set new sort key
  const requestSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // Get username from user ID
  const getUserName = (id) => {
    const user = users.find(u => u.id === id);
    return user ? user.name : 'Unknown';
  };

  // Styles (keep it simple or adjust in your CSS)
  const styles = {
    filters: { marginBottom: '1rem' },
    select: { marginLeft: '0.5rem', padding: '6px', borderRadius: '4px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { cursor: 'pointer', borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' },
    td: { borderBottom: '1px solid #eee', padding: '8px' },
    button: { cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' },
    link: { textDecoration: 'none', color: '#3f51b5' },
  };

  return (
    <div>
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

        <label style={{ marginLeft: '1rem' }}>
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
            <th style={styles.th} onClick={() => requestSort('title')}>Title</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th} onClick={() => requestSort('priority')}>Priority</th>
            <th style={styles.th} onClick={() => requestSort('due_date')}>Due Date</th>
            <th style={styles.th} onClick={() => requestSort('status')}>Status</th>
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
                <td style={styles.td}>{getUserName(task.assigned_to_id)}</td>
                <td style={styles.td}>
                  <Link to={`/tasks/edit/${task.id}`} style={styles.link}>Edit</Link>
                </td>
                <td style={styles.td}>
                  <button onClick={() => onDelete(task.id)} style={styles.button}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '12px' }}>
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;