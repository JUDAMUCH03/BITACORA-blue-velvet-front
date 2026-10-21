import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DishCard({ dish }) {
  const name = dish.nombre || dish.name || 'Plato de Autor';
  const category = dish.categoria || dish.category || 'General';
  const price = typeof dish.precio === 'number' ? dish.precio : (dish.price || 0);
  const description = dish.descripcion || dish.description || '';
  const imageUrl = dish.imagenUrl || dish.imageUrl || '';
  const isChefRecommendation = dish.isChefRecommendation || false;
  const allergens = dish.allergens || dish.alergenos || [];

  return (
    <div className="group relative rounded-2xl velvet-glass border border-white/10 hover:border-velvet-gold/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between">
      {/* Imagen decorativa del plato o placeholder gastronómico */}
      <div className="relative h-48 w-full bg-gradient-to-br from-velvet-800 to-velvet-900 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-velvet-blue/30">
            <span className="font-serif text-3xl font-bold text-velvet-gold/40">BV</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-velvet-900 via-transparent to-black/30" />

        {/* Badge de Recomendación del Chef */}
        {isChefRecommendation && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-velvet-gold/90 text-velvet-900 text-xs font-bold shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sugerencia del Chef</span>
          </div>
        )}

        {/* Categoría */}
        <span className="absolute bottom-3 left-3 text-[11px] font-semibold uppercase tracking-wider text-velvet-gold-light px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10">
          {category}
        </span>
      </div>

      {/* Contenido del plato */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-lg font-bold text-white group-hover:text-velvet-gold transition-colors">
              {name}
            </h3>
            <span className="font-serif text-lg font-bold text-velvet-gold shrink-0">
              ${price.toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-light">
            {description}
          </p>
        </div>

        {/* Alérgenos y CTA */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          {allergens && allergens.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {allergens.map((alg, i) => (
                <span
                  key={i}
                  className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded"
                >
                  {alg}
                </span>
              ))}
            </div>
          )}

          <Link
            to="/reservas"
            className="w-full inline-flex items-center justify-center py-2 px-3 rounded-lg text-xs font-medium text-slate-300 bg-white/5 hover:bg-velvet-gold hover:text-velvet-900 transition-colors"
          >
            Reservar mesa para degustar
          </Link>
        </div>
      </div>
    </div>
  );
}
