import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TasksPage from './pages/TasksPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

const App: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));

  const handleLogin = (token: string) => {
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
  };

  const handleLogout = () => {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  useEffect(() => {const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <header style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#4CAF50' }}>Todo App</h2>
          <nav>
            {accessToken ? (
              <button onClick={handleLogout} style={{ background: '#f44336', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
            ) : (
              <>
                <a href="/login" style={{ marginRight: '15px', textDecoration: 'none', color: '#007bff' }}>Login</a>
                <a href="/register" style={{ textDecoration: 'none', color: '#007bff' }}>Registrar</a>
              </>
            )}
          </nav>
        </header>

        <Routes>
          <Route path="/login" element={accessToken ? <Navigate to="/tasks" /> : <LoginPage onLoginSuccess={handleLogin} />} />
          <Route path="/register" element={accessToken ? <Navigate to="/tasks" /> : <RegisterPage />} />
          <Route
            path="/tasks"
            element={accessToken ? <TasksPage accessToken={accessToken} /> : <Navigate to="/login" />}
          />
          <Route
            path="*"
            element={accessToken ? <Navigate to="/tasks" /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;