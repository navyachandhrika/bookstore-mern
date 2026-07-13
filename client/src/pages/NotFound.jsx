// src/pages/NotFound.jsx — 404 page
import { Link } from 'react-router-dom';
import { FiHome, FiBookOpen } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="page-wrapper page-enter flex items-center justify-center" style={{ minHeight: '100vh' }}>
      <div className="text-center px-4">
        <div className="text-9xl font-bold mb-4" style={{ background: 'linear-gradient(135deg, #6366f1, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          404
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/"      className="btn-primary py-3 px-6"><FiHome /> Home</Link>
          <Link to="/books" className="btn-outline py-3 px-6"><FiBookOpen /> Browse Books</Link>
        </div>
      </div>
    </div>
  );
}
