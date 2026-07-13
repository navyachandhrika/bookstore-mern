// src/components/Navbar.jsx — Responsive navigation bar with cart badge and mobile drawer
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiBook } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount }             = useCart();
  const navigate                  = useNavigate();
  const location                  = useLocation();

  const [isOpen,      setIsOpen]      = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); setUserMenuOpen(false); }, [location]);

  // Add scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/',     label: 'Home' },
    { to: '/books', label: 'Browse Books' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-panel shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">

          {/* ─── Logo ──────────────────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #f97316)' }}>
              <FiBook className="text-white text-sm" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ background: 'linear-gradient(135deg, #e2e8f0, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              BookStore
            </span>
          </Link>

          {/* ─── Desktop Nav Links ─────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to} to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive ? 'text-primary-400 bg-primary-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive ? 'text-accent-400 bg-accent-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`
              }>
                Admin
              </NavLink>
            )}
          </div>

          {/* ─── Right Controls ────────────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            {user && (
              <Link to="/cart" className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                <FiShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu / Auth Buttons */}
            {user ? (
              <div className="relative hidden md:block">
                <button
                  id="user-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.name?.split(' ')[0]}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-panel rounded-xl overflow-hidden shadow-xl animate-slide-up">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                      <FiUser /> My Profile
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                        <FiSettings /> Admin Panel
                      </Link>
                    )}
                    <hr className="border-white/10" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors">
                      <FiLogOut /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"    className="btn-outline py-1.5 px-4 text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary py-1.5 px-4 text-sm">Get Started</Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all">
              {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile Drawer ─────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-white/5 animate-slide-up">
          <div className="container-custom py-4 space-y-1">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive ? 'text-primary-400 bg-primary-500/10' : 'text-slate-300'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {isAdmin && <Link to="/admin" className="block px-4 py-3 rounded-lg text-sm font-medium text-accent-400">Admin Panel</Link>}
            <hr className="border-white/10 my-2" />
            {user ? (
              <>
                <Link to="/profile"  className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-300">My Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-400">Sign Out</button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login"    className="btn-outline w-full text-center py-2">Sign In</Link>
                <Link to="/register" className="btn-primary w-full text-center py-2">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
