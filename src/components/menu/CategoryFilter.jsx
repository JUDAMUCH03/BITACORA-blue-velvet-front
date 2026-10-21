import React from 'react';

export default function CategoryFilter({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-4">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 ${
              isActive
                ? 'bg-velvet-gold text-velvet-900 font-semibold shadow-gold-glow scale-105'
                : 'bg-velvet-800/80 text-slate-300 hover:text-white hover:bg-velvet-800 border border-white/5'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
