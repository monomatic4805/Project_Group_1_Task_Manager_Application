import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';

import Navbar from './Components/Navbar';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Home from './Components/Home';
import MyTasks from './Components/MyTasks';
import CreateTask from './Components/CreateTask';
import EditTask from './Components/EditTask';
import Logout from './Components/Logout';
import './App.css';

function AppWrapper() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const showNavbar = !['/login', '/signup', '/logout'].includes(location.pathname);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleSignup = (formData) => {
    console.log('Signup data:', formData);
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      {showNavbar && <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
        <Route
          path="/tasks"
          element={isLoggedIn ? <MyTasks /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/create"
          element={isLoggedIn ? <CreateTask /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/tasks/edit/:id"
          element={isLoggedIn ? <EditTask /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;