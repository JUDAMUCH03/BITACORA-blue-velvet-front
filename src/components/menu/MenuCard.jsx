import React, { useState } from 'react';
import { Sparkles, CalendarCheck, Check, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Formatea valores numéricos en Pesos Colombianos ($COP)
 */
export function formatCOP(price) {
  if (typeof price !== 'number') {
    price = Number(price) || 0;
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Tarjeta individual de la carta gastronómica de Blue Velvet
 */
export default function MenuCard({ item, onSelectDish }) {
  const [added, setAdded] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const navigate = useNavigate();

  const id = item.id || item._id;
  const nombre = item.nombre || item.name || 'Plato de Autor';
  const descripcion = item.descripcion || item.description || '';
  const categoria = item.categoria || item.category || 'General';
  const precio = item.precio || item.price || 0;
  const imagenUrl = item.imagenUrl || item.imageUrl;
  const disponible = item.disponible !== undefined ? item.disponible : true;

  const handleAction = () => {
    setAdded(true);
    if (onSelectDish) {
      onSelectDish(item);
    }
    setTimeout(() => {
      navigate('/reservas');
    }, 450);
  };

  return (
    <div className="group relative rounded-2xl velvet-glass border border-white/10 hover:border-velvet-gold/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between shadow-velvet-card">
      {/* Contenedor de Imagen y Badges */}
      <div className="relative h-52 w-full bg-gradient-to-br from-velvet-800 to-velvet-900 overflow-hidden">
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt={nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-velvet-blue/30">
            <span className="font-serif text-3xl font-bold text-velvet-gold/40">BV</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-velvet-900 via-transparent to-black/30 pointer-events-none" />

        {/* Badge de Categoría */}
        <span className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wider text-velvet-gold-light px-3 py-1 rounded-full bg-velvet-900/90 border border-velvet-gold/30 backdrop-blur-md">
          {categoria}
        </span>

        {/* Disponibilidad */}
        {!disponible && (
          <span className="absolute top-3 right-3 text-[10px] uppercase font-bold text-red-300 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-500/40">
            Agotado hoy
          </span>
        )}

        {/* Botón Ver Detalle */}
        <button
          type="button"
          onClick={() => setShowDetail(!showDetail)}
          title="Ver detalle del plato"
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-velvet-900/80 border border-white/20 text-slate-300 hover:text-velvet-gold hover:border-velvet-gold/60 flex items-center justify-center transition-colors backdrop-blur-md"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-lg font-bold text-white group-hover:text-velvet-gold transition-colors leading-snug">
              {nombre}
            </h3>
            <span className="font-serif text-base font-bold text-velvet-gold shrink-0">
              {formatCOP(precio)}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-light">
            {descripcion}
          </p>

          {showDetail && (
            <div className="p-3 rounded-xl bg-velvet-800/90 border border-velvet-gold/20 text-[11px] text-slate-300 space-y-1 animate-fadeIn">
              <p className="font-semibold text-velvet-gold">Experiencia Sensorial Blue Velvet:</p>
              <p>Materia prima seleccionada, técnica al vacío y reducción lenta de autor.</p>
              <p className="text-slate-400">Maridaje sugerido: Cava Privada o Cóctel Signature.</p>
            </div>
          )}
        </div>

        {/* Botón de Acción Rápida */}
        <div className="pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={handleAction}
            disabled={!disponible}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 ${
              added
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-velvet-gold hover:text-velvet-900 text-slate-200 border border-white/10 hover:border-velvet-gold shadow-sm'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>¡Añadido a la Reserva!</span>
              </>
            ) : (
              <>
                <CalendarCheck className="w-4 h-4 text-velvet-gold group-hover:text-velvet-900 transition-colors" />
                <span>Agregar a la Reserva</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
