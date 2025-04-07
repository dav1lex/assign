import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { authService } from '../services/authService';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const logoutTimerRef = useRef(null);

  const getTokenExpiryTime = (token) => {
    try {
      const decoded = jwt_decode(token);
      const expiryTimestamp = decoded.exp * 1000;
      return expiryTimestamp;
    } catch (error) {
      return null;
    }
  };

  const setupLogoutTimer = (token) => {
    if (logoutTimerRef.current) {
      clearInterval(logoutTimerRef.current);
    }

    const expiryTimestamp = getTokenExpiryTime(token);
    if (!expiryTimestamp) return;

    logoutTimerRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = expiryTimestamp - now;

      if (remaining <= 0) {
        clearInterval(logoutTimerRef.current);
        logout();
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setTimeRemaining(null);

    if (logoutTimerRef.current) {
      clearInterval(logoutTimerRef.current);
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        const expiryTimestamp = getTokenExpiryTime(token);
        const now = Date.now();

        if (expiryTimestamp && expiryTimestamp > now) {
          try {
            const response = await authService.verifyToken();
            setCurrentUser(response.user);
            setIsAuthenticated(true);
            setupLogoutTimer(token);
          } catch (error) {
            localStorage.removeItem('token');
          }
        } else {
          localStorage.removeItem('token');
        }
      }

      setIsLoading(false);
    };

    checkAuthStatus();

    return () => {
      if (logoutTimerRef.current) {
        clearInterval(logoutTimerRef.current);
      }
    };
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const { token } = response;

    localStorage.setItem('token', token);
    setCurrentUser(response.user);
    setIsAuthenticated(true);
    setupLogoutTimer(token);

    return response;
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    timeRemaining
  };

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
};