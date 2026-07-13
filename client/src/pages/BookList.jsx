// src/pages/BookList.jsx — Book listing with sidebar filters, search, and pagination
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getBooks } from '../services/bookService.js';
import BookCard from '../components/BookCard.jsx';

const GENRES    = ['Fiction', 'Science Fiction', 'Fantasy', 'Self-Help', 'History', 'Classic', 'Finance', 'Memoir'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese'];
const SORTS     = [
  { value: '-createdAt', label: 'Newest First'    },
  { value: 'price',      label: 'Price: Low→High' },
  { value: '-price',     label: 'Price: High→Low' },
  { value: '-rating',    label: 'Top Rated'        },
  { value: 'title',      label: 'Title A→Z'        },
];

export default function BookList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [books,      setBooks]      = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading,    setLoading]    = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  // Filter state synced to URL params
  const [filters, setFilters] = useState({
    search:   searchParams.get('search')   || '',
    genre:    searchParams.get('genre')    || '',
    language: searchParams.get('language') || '',
    sort:     searchParams.get('sort')     || '-createdAt',
    page:     Number(searchParams.get('page')) || 1,
  });

  const fetchBooks = useCallback(async (f) => {
    try {
      setLoading(true);
      const params = { ...f, limit: 12 };
      if (!params.search)   delete params.search;
      if (!params.genre)    delete params.genre;
      if (!params.language) delete params.language;

      const { data } = await getBooks(params);
      setBooks(data.books || []);
      setPagination(data.pagination || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks(filters);
    // Sync to URL
    const params = {};
    if (filters.search)   params.search   = filters.search;
    if (filters.genre)    params.genre    = filters.genre;
    if (filters.language) params.language = filters.language;
    if (filters.sort !== '-createdAt') params.sort = filters.sort;
    if (filters.page > 1) params.page = filters.page;
    setSearchParams(params, { replace: true });
  }, [filters]);

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  const clearFilters = () => setFilters({ search: '', genre: '', language: '', sort: '-createdAt', page: 1 });

  const hasFilters = filters.search || filters.genre || filters.language;

  const Sidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Genre</h3>
        <div className="space-y-1">
          <button onClick={() => updateFilter('genre', '')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${!filters.genre ? 'bg-primary-500/20 text-primary-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            All Genres
          </button>
          {GENRES.map((g) => (
            <button key={g} onClick={() => updateFilter('genre', g)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${filters.genre === g ? 'bg-primary-500/20 text-primary-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-white/5" />

      <div>
        <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Language</h3>
        <div className="space-y-1">
          <button onClick={() => updateFilter('language', '')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${!filters.language ? 'bg-primary-500/20 text-primary-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            All Languages
          </button>
          {LANGUAGES.map((l) => (
            <button key={l} onClick={() => updateFilter('language', l)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${filters.language === l ? 'bg-primary-500/20 text-primary-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="w-full btn-outline py-2 text-sm flex items-center gap-2">
          <FiX /> Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="page-wrapper page-enter">
      <div className="container-custom py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-2">Browse Books</h1>
          <p className="text-slate-400 text-sm">
            {loading ? 'Loading...' : `${pagination.total || 0} books found`}
            {filters.genre && <span> in <strong className="text-primary-400">{filters.genre}</strong></span>}
          </p>
        </div>

        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search titles, authors..."
              className="input-field pl-11"
            />
          </div>
          <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}
            className="select-field w-full sm:w-48 text-sm">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button onClick={() => setShowFilter(!showFilter)} className="lg:hidden btn-outline py-2 px-4 text-sm flex items-center gap-2">
            <FiFilter /> Filters {hasFilters && <span className="w-2 h-2 rounded-full bg-primary-400" />}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="glass-panel rounded-2xl p-6 sticky top-24">
              <Sidebar />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {showFilter && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowFilter(false)} />
              <div className="relative ml-auto w-72 h-full glass-panel overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-bold">Filters</h2>
                  <button onClick={() => setShowFilter(false)}><FiX className="text-slate-400" /></button>
                </div>
                <Sidebar />
              </div>
            </div>
          )}

          {/* Books Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden">
                    <div className="skeleton aspect-[3/4]" />
                    <div className="p-4 space-y-2">
                      <div className="skeleton h-4 w-3/4" />
                      <div className="skeleton h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-white font-semibold text-xl mb-2">No Books Found</h3>
                <p className="text-slate-400 mb-6">Try adjusting your search or filters.</p>
                <button onClick={clearFilters} className="btn-primary py-2 px-6">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {books.map((book) => <BookCard key={book._id} book={book} />)}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                      disabled={filters.page <= 1}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <FiChevronLeft className="text-lg" />
                    </button>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button key={i+1} onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                          filters.page === i + 1 ? 'btn-primary py-0 px-0' : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}>
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                      disabled={filters.page >= pagination.totalPages}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <FiChevronRight className="text-lg" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
