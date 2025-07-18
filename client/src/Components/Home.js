import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to Home Page</h1>
{/* planning to add more content */}
      <Link to="/tasks">My Tasks</Link>
    </div>
  );
}

export default Home;
