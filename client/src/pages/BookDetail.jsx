// src/pages/BookDetail.jsx — Full book details, add to cart, and reviews
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiArrowLeft, FiTag, FiGlobe, FiUser } from 'react-icons/fi';
import { getBookById, addReview } from '../services/bookService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import StarRating from '../components/StarRating.jsx';
import Alert from '../components/Alert.jsx';

export default function BookDetail() {
  const { id }          = useParams();
  const { user }        = useAuth();
  const { addToCart }   = useCart();
  const navigate        = useNavigate();

  const [book,    setBook]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty,     setQty]     = useState(1);
  const [adding,  setAdding]  = useState(false);
  const [alert,   setAlert]   = useState(null);

  // Review form state
  const [rating,  setRating]  = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const { data } = await getBookById(id);
      setBook(data);
    } catch {
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBook(); }, [id]);

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    try {
      setAdding(true);
      await addToCart(book._id, qty);
      setAlert({ type: 'success', message: `"${book.title}" added to your cart!` });
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to add to cart.' });
    } finally {
      setAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      setSubmitting(true);
      await addReview(id, { rating, comment });
      setComment('');
      setRating(5);
      setAlert({ type: 'success', message: 'Review submitted successfully!' });
      await fetchBook();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to submit review.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="page-wrapper">
      <div className="container-custom py-10">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="skeleton rounded-3xl aspect-[3/4]" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-5 w-1/2" />
            <div className="skeleton h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!book) return null;
  const stars = Math.round(book.rating || 0);

  return (
    <div className="page-wrapper page-enter">
      <div className="container-custom py-10">

        {/* Back */}
        <Link to="/books" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <FiArrowLeft /> Back to Books
        </Link>

        {alert && <div className="mb-6"><Alert type={alert.type} message={alert.message} dismissible onDismiss={() => setAlert(null)} /></div>}

        {/* ── Book Info ───────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Cover */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl" style={{ background: 'linear-gradient(135deg, #6366f1, #f97316)' }} />
              <img
                src={book.coverImageUrl || 'https://via.placeholder.com/400x550/312e81/818cf8?text=📚'}
                alt={book.title}
                className="relative rounded-3xl w-full shadow-2xl"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x550/312e81/818cf8?text=📚'; }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="badge-primary">{book.genre}</span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}>
                <FiGlobe className="mr-1" /> {book.language}
              </span>
              {book.stock === 0 && <span className="badge-danger">Out of Stock</span>}
              {book.featured && <span className="badge-accent">⭐ Featured</span>}
            </div>

            <h1 className="text-4xl font-bold text-white leading-tight mb-2">{book.title}</h1>
            <p className="text-primary-400 text-lg mb-1 flex items-center gap-2"><FiUser /> {book.author}</p>

            {/* Rating */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <FiStar key={s} className={`text-lg ${s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`}
                    style={{ fill: s <= stars ? '#fbbf24' : 'none' }} />
                ))}
              </div>
              <span className="text-white font-semibold">{book.rating?.toFixed(1) || '0.0'}</span>
              <span className="text-slate-500 text-sm">({book.numReviews || 0} reviews)</span>
            </div>

            <p className="text-slate-300 leading-relaxed mb-6">{book.description}</p>

            {/* Price & Stock */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-white">${book.price?.toFixed(2)}</span>
              <span className={`text-sm font-medium ${book.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity + Cart */}
            {book.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(99,102,241,0.3)' }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-white hover:bg-white/5 transition-colors text-lg font-bold">−</button>
                  <span className="px-5 py-3 text-white font-semibold">{qty}</span>
                  <button onClick={() => setQty(Math.min(book.stock, qty + 1))} className="px-4 py-3 text-white hover:bg-white/5 transition-colors text-lg font-bold">+</button>
                </div>
                <button onClick={handleAddToCart} disabled={adding} className="btn-primary flex-1 py-3">
                  <FiShoppingCart /> {adding ? 'Adding...' : user ? 'Add to Cart' : 'Sign in to Buy'}
                </button>
              </div>
            )}

            {book.stock === 0 && (
              <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <p className="text-red-400 text-sm font-medium">This book is currently out of stock.</p>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <FiTag className="text-slate-500 text-sm" />
              {[book.genre, book.language, book.author].map((tag) => (
                <span key={tag} className="text-slate-500 text-xs px-2 py-1 rounded-md bg-white/5">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Reviews ──────────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Review Form */}
          <div className="lg:col-span-1">
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5">Write a Review</h2>
              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Your Rating</label>
                    <StarRating value={rating} onChange={setRating} size="lg" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      placeholder="Share your thoughts about this book..."
                      className="input-field resize-none"
                      required
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-400 text-sm mb-4">Sign in to leave a review.</p>
                  <Link to="/login" className="btn-primary py-2 px-6 text-sm">Sign In</Link>
                </div>
              )}
            </div>
          </div>

          {/* Review List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-white font-bold text-lg">
              Reviews <span className="text-slate-500 font-normal text-sm">({book.reviews?.length || 0})</span>
            </h2>
            {book.reviews?.length === 0 ? (
              <div className="glass-panel rounded-2xl p-10 text-center">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-slate-400">No reviews yet. Be the first!</p>
              </div>
            ) : (
              book.reviews?.map((review) => (
                <div key={review._id} className="glass-panel rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                        {(review.userName || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{review.userName}</p>
                        <p className="text-slate-500 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <FiStar key={s} className={`text-sm ${s <= review.rating ? 'text-yellow-400' : 'text-slate-600'}`}
                          style={{ fill: s <= review.rating ? '#fbbf24' : 'none' }} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
