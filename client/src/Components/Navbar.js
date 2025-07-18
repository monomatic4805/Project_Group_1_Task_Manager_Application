import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    //logout logic: clear auth and redirect
    localStorage.removeItem('authToken');  // if store token in localStorage
    navigate('/login'); // redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <h2>Task Manager</h2>
        </Link>

        <ul className="nav-menu">
          <li>
            <Link to="/tasks" className="nav-link">My Tasks</Link>
          </li>
          <li>
            <Link to="/create" className="nav-link">Create Task</Link>
          </li>
          <li>
            <Link to="/edit" className="nav-link">Edit Task</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;