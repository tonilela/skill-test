import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Registration from './components/Registration/Registration';
import { ProtectedRoute } from './Routes/ProtectedRoute';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
  );
}

export default App;
