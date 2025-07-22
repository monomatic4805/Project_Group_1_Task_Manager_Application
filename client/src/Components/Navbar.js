import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#191D32', // darkest tone
    padding: '1rem 2rem',
    fontFamily: "'Poppins', sans-serif",
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    zIndex: 1000,
  };

  const navContainerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const brandStyle = {
    color: '#F1F1F1',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1.5rem',
  };

  const menuStyle = {
    listStyle: 'none',
    display: 'flex',
    gap: '1.5rem',
    margin: 0,
    padding: 0,
  };

  const linkStyle = {
    color: '#F1F1F1',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1rem',
    transition: 'color 0.2s ease',
  };

  const linkHoverStyle = {
    color: '#6D3B47', // dark rose accent on hover
  };

  const buttonBaseStyle = {
    border: 'none',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    color: '#F1F1F1',
    backgroundColor: '#6D3B47', // rich red
    transform: active ? 'scale(0.95)' : 'scale(1)',
  };

  const buttonHoverStyle = {
    backgroundColor: '#8E4C5C',
  };

  const buttonActiveStyle = {
    backgroundColor: '#A85C6D',
  };

  const buttonStyle = {
    ...buttonBaseStyle,
    ...(hover ? buttonHoverStyle : {}),
    ...(active ? buttonActiveStyle : {}),
  };

  return (
    <nav style={navStyle}>
      <div style={navContainerStyle}>
        <Link to="/" style={brandStyle}>
          Task Manager
        </Link>

        <ul style={menuStyle}>
          <li>
            <Link
              to="/tasks"
              style={linkStyle}
              onMouseEnter={e => (e.target.style.color = linkHoverStyle.color)}
              onMouseLeave={e => (e.target.style.color = linkStyle.color)}
            >
              My Tasks
            </Link>
          </li>
          <li>
            <Link
              to="/create"
              style={linkStyle}
              onMouseEnter={e => (e.target.style.color = linkHoverStyle.color)}
              onMouseLeave={e => (e.target.style.color = linkStyle.color)}
            >
              Create Task
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              style={buttonStyle}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => {
                setHover(false);
                setActive(false);
              }}
              onMouseDown={() => setActive(true)}
              onMouseUp={() => setActive(false)}
              onMouseOut={() => setActive(false)}
              aria-label="Logout"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
