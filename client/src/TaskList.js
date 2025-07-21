import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TaskList.css'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let updated = [...tasks];

    if (statusFilter) updated = updated.filter(t => t.status === statusFilter);
    if (priorityFilter) updated = updated.filter(t => t.priority === priorityFilter);

    if (sortKey) {
      updated.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
        else return aVal < bVal ? 1 : -1;
      });
    }

    setFilteredTasks(updated);
    setCurrentPage(1); // Reset page on change
  }, [tasks, statusFilter, priorityFilter, sortKey, sortOrder]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
      toast.error('Failed to fetch tasks.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axios.delete(`/api/tasks/${id}`);
      toast.success('Task deleted!');
      fetchTasks(); 
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete task.');
    }
  };

  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const startIndex = (currentPage - 1) * tasksPerPage;
  const currentTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <div className="task-list-container">
      <h2>Task List</h2>
      <ToastContainer />

      {}
      <div className="filters">
        <label>Status:</label>
        <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
          <option value="">All</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <label>Priority:</label>
        <select onChange={(e) => setPriorityFilter(e.target.value)} value={priorityFilter}>
          <option value="">All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {loading && <p>Loading tasks...</p>}
      {error && <p>Failed to fetch tasks.</p>}

      {!loading && !error && (
        <>
          <table className="task-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('title')}>Title</th>
                <th onClick={() => handleSort('description')}>Description</th>
                <th onClick={() => handleSort('due_date')}>Due Date</th>
                <th onClick={() => handleSort('priority')}>Priority</th>
                <th onClick={() => handleSort('status')}>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.due_date}</td>
                  <td>{task.priority}</td>
                  <td>{task.status}</td>
                  <td>{task.assigned_to}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(task.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {}
          <div className="pagination">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Previous
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={currentPage === idx + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskList;
