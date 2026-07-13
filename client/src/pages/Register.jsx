// src/pages/Register.jsx — Registration page with form validation
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import Alert from '../components/Alert.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate      = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert]   = useState(null);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      return setAlert({ type: 'error', message: 'Passwords do not match.' });
    }
    if (form.password.length < 6) {
      return setAlert({ type: 'error', message: 'Password must be at least 6 characters.' });
    }
    try {
      setLoading(true);
      setAlert(null);
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper page-enter flex items-center justify-center py-20 px-4" style={{ minHeight: '100vh' }}>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-60 h-60 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel rounded-3xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
              <FiUserPlus className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
            <p className="text-slate-400 text-sm">Join BookStore and start your reading journey</p>
          </div>

          {alert && <div className="mb-6"><Alert type={alert.type} message={alert.message} /></div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)}
                  placeholder="Jane Reader" className="input-field pl-11" />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com" className="input-field pl-11" />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={(e) => update('password', e.target.value)}
                  placeholder="Min 6 characters" className="input-field pl-11 pr-11" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="password" required value={form.confirm} onChange={(e) => update('confirm', e.target.value)}
                  placeholder="Repeat password" className="input-field pl-11" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-accent w-full py-3.5 text-base">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
