// src/services/bookService.js — Books and reviews API calls
import api from './api.js';

export const getBooks       = (params) => api.get('/books', { params });
export const getBookById    = (id)     => api.get(`/books/${id}`);
export const createBook     = (data)   => api.post('/books', data);
export const updateBook     = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook     = (id)     => api.delete(`/books/${id}`);
export const getBookReviews = (id)     => api.get(`/books/${id}/reviews`);
export const addReview      = (id, data) => api.post(`/books/${id}/reviews`, data);
