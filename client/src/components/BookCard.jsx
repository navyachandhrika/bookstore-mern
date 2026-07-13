// src/components/BookCard.jsx — Book grid card with hover effects
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useState } from 'react';

export default function BookCard({ book }) {
  const { user }     = useAuth();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added,  setAdded]  = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user || adding) return;
    try {
      setAdding(true);
      await addToCart(book._id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const stars = Math.round(book.rating || 0);

  return (
    <Link to={`/books/${book._id}`} className="card group block">
      {/* Cover Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-dark-700">
        <img
          src={book.coverImageUrl || '/covers/placeholder.png'}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400/312e81/818cf8?text=📚'; }}
        />
        {/* Genre badge overlay */}
        <div className="absolute top-3 left-3">
          <span className="badge-primary text-xs">{book.genre}</span>
        </div>
        {/* Stock badge */}
        {book.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="badge-danger text-sm px-3 py-1">Out of Stock</span>
          </div>
        )}
        {book.featured && book.stock > 0 && (
          <div className="absolute top-3 right-3">
            <span className="badge-accent text-xs">Featured</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 mb-1 group-hover:text-primary-400 transition-colors">
          {book.title}
        </h3>
        <p className="text-slate-400 text-xs mb-2">{book.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1,2,3,4,5].map((s) => (
            <FiStar key={s} className={`text-xs ${s <= stars ? 'star-filled fill-yellow-400' : 'star-empty'}`} />
          ))}
          <span className="text-slate-500 text-xs ml-1">({book.numReviews || 0})</span>
        </div>

        {/* Price + Cart Button */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-white font-bold text-base">${book.price?.toFixed(2)}</span>
          {user && book.stock > 0 && (
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                added
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'btn-primary py-1.5 px-3 text-xs'
              }`}
            >
              <FiShoppingCart className="text-xs" />
              {added ? 'Added!' : adding ? '...' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
