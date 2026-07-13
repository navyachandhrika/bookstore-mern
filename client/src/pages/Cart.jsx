// src/pages/Cart.jsx — Shopping cart page with quantity controls and totals
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowLeft, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { useState } from 'react';

export default function Cart() {
  const { cart, loading, cartTotal, updateItem, removeItem } = useCart();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState({});

  const handleQtyChange = async (bookId, newQty) => {
    setUpdating((u) => ({ ...u, [bookId]: true }));
    try {
      if (newQty < 1) await removeItem(bookId);
      else            await updateItem(bookId, newQty);
    } finally {
      setUpdating((u) => ({ ...u, [bookId]: false }));
    }
  };

  const handleRemove = async (bookId) => {
    setUpdating((u) => ({ ...u, [bookId]: true }));
    try { await removeItem(bookId); }
    finally { setUpdating((u) => ({ ...u, [bookId]: false })); }
  };

  const shipping = cartTotal > 35 ? 0 : 4.99;
  const tax      = cartTotal * 0.08;
  const total    = cartTotal + shipping + tax;

  if (loading) return (
    <div className="page-wrapper flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!cart?.items?.length) return (
    <div className="page-wrapper">
      <div className="container-custom py-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold text-white mb-3">Your Cart is Empty</h1>
        <p className="text-slate-400 mb-8">Add some books to get started!</p>
        <Link to="/books" className="btn-primary py-3 px-8">Browse Books <FiArrowRight /></Link>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper page-enter">
      <div className="container-custom py-10">
        <Link to="/books" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <FiArrowLeft /> Continue Shopping
        </Link>

        <h1 className="section-title mb-8">Shopping Cart <span className="text-slate-500 font-normal text-2xl">({cart.items.length} items)</span></h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map(({ book, quantity }) => (
              <div key={book?._id} className={`glass-panel rounded-2xl p-5 flex gap-4 transition-opacity ${updating[book?._id] ? 'opacity-60' : 'opacity-100'}`}>
                {/* Cover */}
                <Link to={`/books/${book?._id}`} className="flex-shrink-0">
                  <img
                    src={book?.coverImageUrl || ''}
                    alt={book?.title}
                    className="w-20 h-28 object-cover rounded-xl"
                    onError={(e) => { e.target.src='https://via.placeholder.com/80x112/312e81/818cf8?text=📚'; }}
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link to={`/books/${book?._id}`} className="text-white font-semibold hover:text-primary-400 transition-colors line-clamp-2">
                    {book?.title}
                  </Link>
                  <p className="text-slate-400 text-sm mt-1">{book?.author}</p>
                  <p className="text-white font-bold text-lg mt-2">${book?.price?.toFixed(2)}</p>

                  <div className="flex items-center gap-3 mt-3">
                    {/* Quantity */}
                    <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(99,102,241,0.3)' }}>
                      <button onClick={() => handleQtyChange(book?._id, quantity - 1)} className="px-3 py-1.5 text-white hover:bg-white/5 transition-colors font-bold">−</button>
                      <span className="px-4 py-1.5 text-white font-semibold text-sm">{quantity}</span>
                      <button onClick={() => handleQtyChange(book?._id, quantity + 1)} disabled={quantity >= book?.stock}
                        className="px-3 py-1.5 text-white hover:bg-white/5 transition-colors font-bold disabled:opacity-30">+</button>
                    </div>
                    <button onClick={() => handleRemove(book?._id)} className="text-red-400 hover:text-red-300 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right flex-shrink-0">
                  <p className="text-slate-400 text-xs mb-1">Subtotal</p>
                  <p className="text-white font-bold text-lg">${(book?.price * quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-panel rounded-2xl p-6 sticky top-24">
              <h2 className="text-white font-bold text-lg mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-slate-500 text-xs">Free shipping on orders over $35</p>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tax (8%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
              </div>

              <hr className="border-white/10 mb-4" />
              <div className="flex justify-between items-center mb-6">
                <span className="text-white font-bold text-lg">Total</span>
                <span className="text-white font-bold text-2xl">${total.toFixed(2)}</span>
              </div>

              <button onClick={() => navigate('/checkout')} className="btn-accent w-full py-3.5 text-base">
                <FiShoppingBag /> Proceed to Checkout
              </button>
              <Link to="/books" className="block text-center text-slate-400 hover:text-white text-sm mt-4 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
