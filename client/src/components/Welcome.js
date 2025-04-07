import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Welcome.css';

const Welcome = () => {
  const { currentUser, logout, timeRemaining } = useAuth();
  const navigate = useNavigate();

  const formatTimeRemaining = (ms) => {
    if (!ms) return 'Session expired';

    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
      <div className="welcome-container">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome!</h1>
          <p className="welcome-text">Hello, {currentUser?.email}</p>

          <div className="session-timer">
            <p>Session expires in: <span>{formatTimeRemaining(timeRemaining)}</span></p>
          </div>

          <button
              className="logout-button"
              onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
  );
};

export default Welcome;