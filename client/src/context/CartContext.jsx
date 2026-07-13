// src/context/CartContext.jsx — Global shopping cart state
// Syncs cart with backend for authenticated users.
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as cartService from '../services/cartService.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart,    setCart]    = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // ─── Load cart when user logs in ─────────────────────────────────────────────
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user]);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await cartService.getCart();
      setCart(data || { items: [] });
    } catch (err) {
      console.error('Failed to load cart:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Add item to cart ─────────────────────────────────────────────────────────
  const addToCart = useCallback(async (bookId, quantity = 1) => {
    const { data } = await cartService.addToCart({ bookId, quantity });
    setCart(data.cart);
    return data;
  }, []);

  // ─── Update item quantity ─────────────────────────────────────────────────────
  const updateItem = useCallback(async (bookId, quantity) => {
    if (quantity < 1) return removeItem(bookId);
    const { data } = await cartService.updateCartItem({ bookId, quantity });
    setCart(data.cart);
  }, []);

  // ─── Remove item from cart ────────────────────────────────────────────────────
  const removeItem = useCallback(async (bookId) => {
    const { data } = await cartService.removeCartItem(bookId);
    setCart(data.cart);
  }, []);

  // ─── Clear cart ───────────────────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    await cartService.clearCart();
    setCart({ items: [] });
  }, []);

  // ─── Derived: total item count for badge ──────────────────────────────────────
  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  // ─── Derived: total price ──────────────────────────────────────────────────────
  const cartTotal = cart?.items?.reduce((sum, i) => {
    const price = i.book?.price || 0;
    return sum + price * i.quantity;
  }, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart, loading, cartCount, cartTotal,
      fetchCart, addToCart, updateItem, removeItem, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
