// src/services/orderService.js — Orders API calls
import api from './api.js';

export const placeOrder        = (data) => api.post('/orders', data);
export const getMyOrders       = ()     => api.get('/orders/my-orders');
export const getAllOrders       = ()     => api.get('/orders');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
