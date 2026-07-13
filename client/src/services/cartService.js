// src/services/cartService.js — Shopping cart API calls
import api from './api.js';

export const getCart        = ()           => api.get('/cart');
export const addToCart      = (data)       => api.post('/cart', data);
export const updateCartItem = (data)       => api.put('/cart', data);
export const removeCartItem = (bookId)     => api.delete(`/cart/${bookId}`);
export const clearCart      = ()           => api.delete('/cart');
