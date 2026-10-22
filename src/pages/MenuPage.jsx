import React from 'react';
import { Sparkles, CalendarCheck, Loader2, Wine, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMenu, MENU_CATEGORIES } from '../hooks/useMenu';
import MenuFilter from '../components/menu/MenuFilter';
import MenuCard from '../components/menu/MenuCard';

export default function MenuPage() {
  const { items, loading, error, activeCategory, setActiveCategory, refreshMenu } = useMenu('TODOS');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* HEADER DE LA CARTA */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-velvet-800 border border-velvet-gold/30 text-xs font-semibold text-velvet-gold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mixología Sensorial & Coctelería de Autor · Precios en $COP</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Nuestra Carta de Coctelería de Autor
        </h1>

        <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
          Cada formulación es un diálogo entre técnica de vanguardia, botánicos seleccionados de origen
          y destilados premium. Explora nuestras creaciones y preselecciona tus cócteles favoritos.
        </p>
      </div>

      {/* BARRA DE FILTROS HORIZONTAL */}
      <MenuFilter
        categories={MENU_CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* MANEJO COMPLETO DE ESTADOS: ERROR */}
      {error && (
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center max-w-lg mx-auto text-amber-200 text-sm space-y-3">
          <div className="flex items-center justify-center gap-2 font-semibold">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <span>Aviso de sincronización</span>
          </div>
          <p className="text-xs text-slate-300">{error}</p>
          <button
            type="button"
            onClick={refreshMenu}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-velvet-gold text-velvet-900 font-bold text-xs hover:shadow-gold-glow transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reintentar conexión</span>
          </button>
        </div>
      )}

      {/* MANEJO COMPLETO DE ESTADOS: LOADING (TARJETAS ESQUELETO & SPINNER) */}
      {loading ? (
        <div className="space-y-8">
          <div className="py-8 flex flex-col items-center justify-center space-y-2 text-velvet-gold">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs uppercase tracking-widest text-slate-400">
              Preparando la carta de autor...
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl velvet-glass border border-white/5 overflow-hidden animate-pulse h-96 flex flex-col justify-between p-6 space-y-4"
              >
                <div className="h-44 bg-velvet-800 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-4 bg-velvet-800 rounded w-3/4" />
                  <div className="h-3 bg-velvet-800 rounded w-full" />
                  <div className="h-3 bg-velvet-800 rounded w-2/3" />
                </div>
                <div className="h-10 bg-velvet-800 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ) : items.length === 0 ? (
        /* MANEJO DE ESTADO VACÍO AMIGABLE */
        <div className="py-20 text-center velvet-glass rounded-3xl max-w-xl mx-auto p-8 space-y-4 border border-white/10">
          <div className="w-14 h-14 rounded-full bg-velvet-800 border border-velvet-gold/30 flex items-center justify-center text-velvet-gold mx-auto">
            <Wine className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white">
            No se encontraron cócteles en esta categoría
          </h3>
          <p className="text-xs text-slate-300">
            Nuestros maestros mixólogos renuevan continuamente las recetas botánicas. Por favor selecciona otra categoría o revisa la carta completa.
          </p>
          <button
            type="button"
            onClick={() => setActiveCategory('TODOS')}
            className="px-6 py-2.5 rounded-full bg-velvet-gold text-velvet-900 font-bold text-xs shadow-gold-glow hover:scale-105 transition-transform"
          >
            Ver todas las creaciones
          </button>
        </div>
      ) : (
        /* CUADRÍCULA DE CÓCTELES CON MENUCARD */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((dish) => (
            <MenuCard key={dish.id || dish._id} item={dish} />
          ))}
        </div>
      )}

      {/* BANNER CTA INFERIOR */}
      <div className="rounded-3xl p-8 velvet-glass-gold border border-velvet-gold/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="font-serif text-2xl font-bold text-white">
            ¿Deseas degustar estas creaciones de autor?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Reserva tu mesa en línea para garantizar disponibilidad y asesoría personalizada de nuestro mixólogo jefe.
          </p>
        </div>

        <Link
          to="/reservas"
          className="shrink-0 inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-velvet-900 bg-gradient-to-r from-velvet-gold via-velvet-gold-light to-velvet-gold shadow-gold-glow hover:scale-105 active:scale-95 transition-all text-sm"
        >
          <CalendarCheck className="w-4 h-4 text-velvet-900" />
          <span>Asegurar Mesa Ahora</span>
        </Link>
      </div>
    </div>
  );
}
