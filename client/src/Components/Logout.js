import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

function Logout({ onLogout }) {
    const navigate = useNavigate();
  
  
    useEffect(() => {
      // Call on Logout to clear login
      if (onLogout) {
        onLogout();
      }
      // Wait 2 seconds, then redirect to login page
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000);
  
  
      return () => clearTimeout(timer);
    }, [navigate, onLogout]);
  
  
    return (
      <div>
        <h2>You have logged out successfully.</h2>
        <p>Redirecting to login page...</p>
      </div>
    );
  }
  
  
  export default Logout;  