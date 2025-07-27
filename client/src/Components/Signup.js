import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onSignup(formData);
    navigate('/login');
  };

  return (
    <div className="auth-form-wrapper page active">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <div className="auth-input-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="auth-input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="auth-input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="auth-btn">Sign Up</button>
      </form>
      <div className="auth-footer">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  );
};

export default Signup;