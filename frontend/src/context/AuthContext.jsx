import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        // In a real app, you'd verify the token with the backend
        // For simplicity, we'll assume a valid token means logged in
        // A better approach would be to have a /api/auth/me endpoint
        try {
          // This is a placeholder. A real /me endpoint would return user data
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(res.data.user); // Assuming the /me endpoint returns user object
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, { email, password });
      setToken(res.data.token);
      setUser({ id: res.data.id, username: res.data.username, email: res.data.email, role: res.data.role }); // Assuming backend returns user info
      localStorage.setItem('token', res.data.token);
      return true;
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, { username, email, password });
      setToken(res.data.token);
      setUser({ id: res.data.id, username: res.data.username, email: res.data.email, role: res.data.role });
      localStorage.setItem('token', res.data.token);
      return true;
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const authContextValue = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return (
  <AuthContext.Provider value={authContextValue}>
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    console.error("useAuth harus digunakan di dalam AuthProvider");
    return {
      user: null,
      token: null,
      loading: false,
      login: () => {},
      register: () => {},
      logout: () => {},
    };
  }

  return context;
};