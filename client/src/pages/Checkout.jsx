// src/pages/Checkout.jsx — Shipping address form + order summary + place order
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiPackage, FiCreditCard, FiMapPin } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { placeOrder } from '../services/orderService.js';
import Alert from '../components/Alert.jsx';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [alert, setAlert]       = useState(null);
  const [placing, setPlacing]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [orderId, setOrderId]   = useState('');

  const [form, setForm] = useState({
    address: '', city: '', zipCode: '', country: '',
    cardNumber: '', expiry: '', cvv: '',
  });

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const shipping = cartTotal > 35 ? 0 : 4.99;
  const tax      = cartTotal * 0.08;
  const total    = cartTotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart?.items?.length) return;

    try {
      setPlacing(true);
      const { data } = await placeOrder({
        shippingAddress: {
          address: form.address,
          city:    form.city,
          zipCode: form.zipCode,
          country: form.country,
        },
        paymentMethod: 'Card',
        paymentInfo: { id: `sim_${Date.now()}`, status: 'completed' },
      });
      setOrderId(data.order._id);
      setSuccess(true);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to place order.' });
    } finally {
      setPlacing(false);
    }
  };

  // ─── Success Screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="page-wrapper page-enter">
        <div className="container-custom py-20 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.3)' }}>
            <FiCheck className="text-green-400 text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Order Placed!</h1>
          <p className="text-slate-400 mb-2">Your order has been confirmed and is being processed.</p>
          <p className="text-slate-500 text-sm mb-8">Order ID: <span className="text-primary-400 font-mono">{orderId.slice(-8)}</span></p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/profile" className="btn-primary py-3 px-8">View My Orders</Link>
            <Link to="/books"   className="btn-outline py-3 px-8">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="page-wrapper">
        <div className="container-custom py-20 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-white mb-3">Your cart is empty</h1>
          <Link to="/books" className="btn-primary py-2 px-6 mt-4 inline-block">Browse Books</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper page-enter">
      <div className="container-custom py-10">
        <Link to="/cart" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <FiArrowLeft /> Back to Cart
        </Link>

        <h1 className="section-title mb-8">Checkout</h1>

        {alert && <div className="mb-6"><Alert type={alert.type} message={alert.message} dismissible onDismiss={() => setAlert(null)} /></div>}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left: Shipping + Payment */}
            <div className="lg:col-span-2 space-y-6">

              {/* Shipping Address */}
              <div className="glass-panel rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2"><FiMapPin className="text-primary-400" /> Shipping Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 text-sm mb-1.5">Street Address</label>
                    <input type="text" required value={form.address} onChange={(e) => update('address', e.target.value)}
                      placeholder="123 Book Lane" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">City</label>
                    <input type="text" required value={form.city} onChange={(e) => update('city', e.target.value)}
                      placeholder="New York" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">ZIP Code</label>
                    <input type="text" required value={form.zipCode} onChange={(e) => update('zipCode', e.target.value)}
                      placeholder="10001" className="input-field" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 text-sm mb-1.5">Country</label>
                    <input type="text" required value={form.country} onChange={(e) => update('country', e.target.value)}
                      placeholder="United States" className="input-field" />
                  </div>
                </div>
              </div>

              {/* Payment (Simulated) */}
              <div className="glass-panel rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2"><FiCreditCard className="text-accent-400" /> Payment Details</h2>
                <p className="text-slate-500 text-xs mb-4 badge-primary inline-flex">🔒 Demo mode — no real payment</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 text-sm mb-1.5">Card Number</label>
                    <input type="text" required value={form.cardNumber} onChange={(e) => update('cardNumber', e.target.value)}
                      placeholder="4242 4242 4242 4242" maxLength={19} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">Expiry</label>
                    <input type="text" required value={form.expiry} onChange={(e) => update('expiry', e.target.value)}
                      placeholder="MM/YY" maxLength={5} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">CVV</label>
                    <input type="text" required value={form.cvv} onChange={(e) => update('cvv', e.target.value)}
                      placeholder="123" maxLength={4} className="input-field" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-panel rounded-2xl p-6 sticky top-24">
                <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2"><FiPackage className="text-primary-400" /> Order Summary</h2>

                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                  {cart.items.map(({ book, quantity }) => (
                    <div key={book?._id} className="flex items-center gap-3">
                      <img src={book?.coverImageUrl} alt="" className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => { e.target.src='https://via.placeholder.com/40x56/312e81/818cf8?text=📚'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{book?.title}</p>
                        <p className="text-slate-500 text-xs">Qty: {quantity}</p>
                      </div>
                      <p className="text-white text-sm font-semibold">${(book?.price * quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <hr className="border-white/10 mb-4" />
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Subtotal</span><span className="text-white">${cartTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Shipping</span><span className={shipping === 0 ? 'text-green-400' : 'text-white'}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Tax (8%)</span><span className="text-white">${tax.toFixed(2)}</span></div>
                </div>
                <hr className="border-white/10 mb-4" />
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-white font-bold text-2xl">${total.toFixed(2)}</span>
                </div>

                <button type="submit" disabled={placing} className="btn-accent w-full py-3.5 text-base">
                  {placing ? 'Placing Order...' : `Pay $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
