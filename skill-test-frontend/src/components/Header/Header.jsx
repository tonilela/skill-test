import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }
  return (
    <header className="dashboard-header flex items-center justify-between p-4 bg-blue-600">
      <h2 className='text-white font-sans' >My Dashboard</h2>
      <nav style={{display: 'flex'}}>
        <a 
          className='text-white font-sans' 
          href="#"
          onClick={handleLogout}
        >
          Logout
        </a>
      </nav>
    </header>
  );
}