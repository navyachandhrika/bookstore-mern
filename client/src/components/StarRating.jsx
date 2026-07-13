// src/components/StarRating.jsx — Interactive star rating input
import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

export default function StarRating({ value, onChange, readOnly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const current = hovered || value;
  const sizeClass = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-lg';

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={`${sizeClass} transition-all duration-100 ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <FiStar
            className={star <= current ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}
            style={{ fill: star <= current ? '#fbbf24' : 'none' }}
          />
        </button>
      ))}
    </div>
  );
}
