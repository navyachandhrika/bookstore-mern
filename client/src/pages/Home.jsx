// src/pages/Home.jsx — Landing page with hero, featured books, and genre browser
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiSearch, FiTrendingUp, FiAward, FiBookOpen } from 'react-icons/fi';
import { getBooks } from '../services/bookService.js';
import BookCard from '../components/BookCard.jsx';

const GENRES = [
  { name: 'Fiction',        emoji: '📖', color: 'from-purple-600 to-indigo-600' },
  { name: 'Science Fiction', emoji: '🚀', color: 'from-blue-600 to-cyan-600' },
  { name: 'Fantasy',        emoji: '🧙', color: 'from-emerald-600 to-teal-600' },
  { name: 'Self-Help',      emoji: '💡', color: 'from-amber-600 to-orange-600' },
  { name: 'History',        emoji: '🏛️', color: 'from-rose-600 to-pink-600' },
  { name: 'Classic',        emoji: '📜', color: 'from-slate-600 to-gray-600' },
  { name: 'Finance',        emoji: '💰', color: 'from-green-600 to-emerald-600' },
  { name: 'Memoir',         emoji: '✍️', color: 'from-violet-600 to-purple-600' },
];

const STATS = [
  { icon: FiBookOpen,   value: '12,000+', label: 'Books Available' },
  { icon: FiTrendingUp, value: '50K+',    label: 'Happy Readers'   },
  { icon: FiAward,      value: '4.8★',    label: 'Average Rating'  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await getBooks({ featured: true, limit: 4 });
        setFeatured(data.books || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/books?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="page-wrapper page-enter">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-screen flex items-center" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1e1b4b 50%, #0a0a0f 100%)' }}>
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />
        </div>

        <div className="container-custom relative z-10 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8 animate-fade-in"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
            <FiTrendingUp className="text-xs" />
            Over 12,000 books available now
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6 animate-slide-up"
            style={{ background: 'linear-gradient(135deg, #fff 30%, #818cf8 70%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Your Universe<br />of Books
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed">
            Discover, read, and own books across every genre. Get personalized recommendations, read community reviews, and build your dream library.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-xl mx-auto mb-10 animate-slide-up">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, author, genre..."
                className="input-field pl-11 py-4"
              />
            </div>
            <button type="submit" className="btn-primary py-4 px-6 whitespace-nowrap">
              Search <FiArrowRight />
            </button>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link to="/books" className="btn-primary py-3 px-8 text-base">
              Browse All Books <FiArrowRight />
            </Link>
            <Link to="/register" className="btn-outline py-3 px-8 text-base">
              Join Free
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mt-16 animate-fade-in">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-slate-500 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Books ────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'rgba(18,18,26,0.5)' }}>
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title mb-2">Featured Books</h2>
              <p className="text-slate-400 text-sm">Hand-picked titles loved by our community</p>
            </div>
            <Link to="/books?featured=true" className="btn-outline py-2 px-4 text-sm hidden sm:flex">
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="skeleton aspect-[3/4]" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map((book) => <BookCard key={book._id} book={book} />)}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/books" className="btn-outline py-2 px-6 text-sm">View All Books</Link>
          </div>
        </div>
      </section>

      {/* ── Genre Browser ─────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Browse by Genre</h2>
            <p className="text-slate-400">Find your next read in any category</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {GENRES.map(({ name, emoji, color }) => (
              <Link
                key={name}
                to={`/books?genre=${encodeURIComponent(name)}`}
                className="group relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'rgba(30,30,50,0.6)', border: '1px solid rgba(99,102,241,0.1)' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="text-4xl mb-3">{emoji}</div>
                <div className="text-white font-semibold text-sm">{name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container-custom">
          <div className="rounded-3xl p-10 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(249,115,22,0.1))', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.1), transparent 70%)' }} />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 relative">Start Your Reading Journey</h2>
            <p className="text-slate-400 mb-8 relative max-w-md mx-auto">Join thousands of readers. Create your free account today and get personalized book recommendations.</p>
            <div className="flex items-center justify-center gap-4 relative">
              <Link to="/register" className="btn-primary py-3 px-8">Create Free Account <FiArrowRight /></Link>
              <Link to="/books"    className="btn-outline py-3 px-8">Browse Books</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
