import React from 'react';
import { Sparkles, Utensils, Wine, Coffee, Flame } from 'lucide-react';

const CATEGORY_ICONS = {
  TODOS: Sparkles,
  ENTRADAS: Flame,
  'PLATOS FUERTES': Utensils,
  POSTRES: Coffee,
  COCTELERIA: Wine,
};

/**
 * Componente interactivo para filtrar categorías de la carta
 *
 * @param {{
 *   categories?: string[],
 *   activeCategory: string,
 *   onSelectCategory: (category: string) => void
 * }} props
 */
export default function MenuFilter({
  categories = ['TODOS', 'ENTRADAS', 'PLATOS FUERTES', 'POSTRES', 'COCTELERIA'],
  activeCategory,
  onSelectCategory,
}) {
  return (
    <div className="w-full flex items-center justify-center py-2">
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 px-2 max-w-full no-scrollbar">
        {categories.map((cat) => {
          const isSelected =
            activeCategory.toUpperCase() === cat.toUpperCase() ||
            (cat === 'TODOS' && (!activeCategory || activeCategory === 'TODOS'));

          const Icon = CATEGORY_ICONS[cat] || Sparkles;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`group flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 whitespace-nowrap ${
                isSelected
                  ? 'bg-velvet-gold text-velvet-900 shadow-gold-glow scale-105'
                  : 'bg-velvet-800/80 text-slate-300 hover:text-white hover:bg-velvet-800 border border-white/5'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isSelected ? 'text-velvet-900' : 'text-velvet-gold'
                }`}
              />
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
