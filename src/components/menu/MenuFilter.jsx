import React from 'react';
import { Sparkles, Flame, Wine, GlassWater, Sprout } from 'lucide-react';

const CATEGORY_CONFIG = {
  TODOS: { etiqueta: 'Todos', icono: Sparkles },
  COCTEL_AUTOR: { etiqueta: 'Firmas de Autor', icono: Flame },
  DESTILADO_PREMIUM: { etiqueta: 'Destilados Premium', icono: Wine },
  MOCKTAIL: { etiqueta: 'Mocktails 0.0%', icono: GlassWater },
  BOTANICO: { etiqueta: 'Mixología Botánica', icono: Sprout },
};

const DEFAULT_CATEGORIES = [
  'TODOS',
  'COCTEL_AUTOR',
  'DESTILADO_PREMIUM',
  'MOCKTAIL',
  'BOTANICO',
];

/**
 * Filtro exclusivo de coctelería y destilados botánicos para Blue Velvet
 *
 * @param {{
 *   categories?: string[],
 *   activeCategory: string,
 *   onSelectCategory: (category: string) => void
 * }} props
 */
export default function MenuFilter({
  categories = DEFAULT_CATEGORIES,
  activeCategory,
  onSelectCategory,
}) {
  return (
    <div className="w-full flex items-center justify-center py-2">
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 px-2 max-w-full no-scrollbar">
        {categories.map((catKey) => {
          const isSelected =
            activeCategory?.toUpperCase() === catKey.toUpperCase() ||
            (catKey === 'TODOS' && (!activeCategory || activeCategory === 'TODOS'));

          const conf = CATEGORY_CONFIG[catKey] || { etiqueta: catKey, icono: Sparkles };
          const Icon = conf.icono;

          return (
            <button
              key={catKey}
              type="button"
              onClick={() => onSelectCategory(catKey)}
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
              <span>{conf.etiqueta}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
