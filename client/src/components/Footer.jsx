// src/components/Footer.jsx — Site footer
import { Link } from 'react-router-dom';
import { FiBook, FiGithub, FiTwitter, FiMail } from 'react-icons/fi';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t" style={{ borderColor: 'rgba(99,102,241,0.15)', background: 'rgba(10,10,15,0.9)' }}>
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #f97316)' }}>
                <FiBook className="text-white text-sm" />
              </div>
              <span className="font-bold text-lg" style={{ background: 'linear-gradient(135deg, #e2e8f0, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                BookStore
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your universe of books. Discover titles across every genre, read reviews from fellow bibliophiles, and build your perfect reading list.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"><FiGithub /></a>
              <a href="#" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"><FiTwitter /></a>
              <a href="#" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"><FiMail /></a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Explore</h3>
            <ul className="space-y-2">
              {[{ to: '/books', label: 'All Books' }, { to: '/books?genre=Fiction', label: 'Fiction' }, { to: '/books?genre=Science Fiction', label: 'Sci-Fi' }, { to: '/books?genre=Fantasy', label: 'Fantasy' }].map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-slate-400 hover:text-primary-400 text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Account</h3>
            <ul className="space-y-2">
              {[{ to: '/login', label: 'Sign In' }, { to: '/register', label: 'Register' }, { to: '/profile', label: 'My Orders' }, { to: '/cart', label: 'Shopping Cart' }].map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-slate-400 hover:text-primary-400 text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-white/5 my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© {year} BookStore. Built with MERN Stack.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 text-xs">MongoDB · Express · React · Node.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
