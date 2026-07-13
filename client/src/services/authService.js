// src/services/authService.js — Auth API calls
import api from './api.js';

export const register = (data)   => api.post('/auth/register', data);
export const login    = (data)   => api.post('/auth/login', data);
export const getMe    = ()       => api.get('/auth/me');
