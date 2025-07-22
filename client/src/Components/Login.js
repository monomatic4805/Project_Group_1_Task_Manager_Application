import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  // function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent default form submission

    // basic validation: check if username and password are not empty
    if (username.trim() && password.trim()) {
      onLoginSuccess(); // call callback on successful login
      navigate('/');    // redirect to home page
    } else {
      alert('please enter both username and password.'); // alert if inputs empty
    }
  };

  return (
    <div className="auth-form-wrapper page active">
      <h1>Login</h1>

      {/* login form */}
      <form onSubmit={handleSubmit}>
        <div className="auth-input-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="enter your username"
            value={username} // controlled input bound to state
            onChange={(e) => setUsername(e.target.value)} // update username on change
            required
          />
        </div>

        <div className="auth-input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="enter your password"
            value={password} // controlled input bound to state
            onChange={(e) => setPassword(e.target.value)} // update password on change
            required
          />
        </div>

        {/* submit button */}
        <button type="submit" className="auth-btn">Log In</button>
      </form>

      {/* link to signup page */}
      <div className="auth-footer">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default Login;