// src/pages/Profile.jsx — User profile with order history accordion
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiShield, FiPackage, FiChevronDown, FiChevronUp, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyOrders } from '../services/orderService.js';

const STATUS_STYLES = {
  Pending:   'badge-warning',
  Paid:      'badge-primary',
  Shipped:   'badge-accent',
  Delivered: 'badge-success',
  Cancelled: 'badge-danger',
};

export default function Profile() {
  const { user }               = useAuth();
  const [orders,   setOrders]  = useState([]);
  const [loading,  setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggle = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  return (
    <div className="page-wrapper page-enter">
      <div className="container-custom py-10 max-w-4xl">

        {/* ─── User Card ──────────────────────────────────────────────────── */}
        <div className="glass-panel rounded-3xl p-8 mb-10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">{user?.name}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1"><FiMail /> {user?.email}</span>
                <span className="flex items-center gap-1"><FiShield /> {user?.role === 'admin' ? 'Admin' : 'Member'}</span>
                <span className="flex items-center gap-1"><FiCalendar /> Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
            {user?.role === 'admin' && (
              <Link to="/admin" className="btn-accent py-2 px-5 text-sm flex-shrink-0">Admin Panel</Link>
            )}
          </div>
        </div>

        {/* ─── Order History ──────────────────────────────────────────────── */}
        <div className="mb-6">
          <h2 className="section-title mb-2 flex items-center gap-2"><FiPackage /> Order History</h2>
          <p className="text-slate-400 text-sm">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-white font-semibold text-xl mb-2">No Orders Yet</h3>
            <p className="text-slate-400 mb-6">Start shopping and your orders will appear here.</p>
            <Link to="/books" className="btn-primary py-2 px-6"><FiBookOpen className="mr-1" /> Browse Books</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="glass-panel rounded-2xl overflow-hidden">
                {/* Order Header (click to expand) */}
                <button onClick={() => toggle(order._id)} className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div>
                      <p className="text-white font-semibold text-sm">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-slate-500 text-xs">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <span className={STATUS_STYLES[order.status] || 'badge-primary'}>{order.status}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-bold">${order.totalPrice?.toFixed(2)}</span>
                    {expanded[order._id] ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {expanded[order._id] && (
                  <div className="px-5 pb-5 animate-slide-up" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {/* Items */}
                    <div className="space-y-3 mt-4 mb-5">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img src={item.coverImageUrl || ''} alt="" className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => { e.target.src='https://via.placeholder.com/40x56/312e81/818cf8?text=📚'; }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm truncate">{item.title}</p>
                            <p className="text-slate-500 text-xs">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                          </div>
                          <p className="text-white text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Shipping + Payment */}
                    <div className="grid sm:grid-cols-2 gap-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Shipping Address</p>
                        <p className="text-slate-300 text-sm">
                          {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.zipCode}, {order.shippingAddress?.country}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Payment</p>
                        <p className="text-slate-300 text-sm">{order.paymentMethod} · {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                        <p className="text-white font-bold text-lg mt-1">Total: ${order.totalPrice?.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
