// src/context/AuthContext.jsx — Global authentication state
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Restore session from localStorage ──────────────────────────────────────
  useEffect(() => {
    const savedToken = localStorage.getItem('bookstore_token');
    const savedUser  = localStorage.getItem('bookstore_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('bookstore_token');
        localStorage.removeItem('bookstore_user');
      }
    }
    setLoading(false);
  }, []);

  // ─── Login ───────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const { data } = await authService.login({ email, password });
    localStorage.setItem('bookstore_token', data.token);
    localStorage.setItem('bookstore_user',  JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  // ─── Register ────────────────────────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    const { data } = await authService.register({ name, email, password });
    localStorage.setItem('bookstore_token', data.token);
    localStorage.setItem('bookstore_user',  JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  // ─── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('bookstore_token');
    localStorage.removeItem('bookstore_user');
    setToken(null);
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
