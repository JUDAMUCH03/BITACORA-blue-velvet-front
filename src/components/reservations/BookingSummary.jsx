import React from 'react';
import {
  CheckCircle,
  Calendar,
  Clock,
  Users,
  MapPin,
  Sparkles,
  RotateCcw,
  UtensilsCrossed,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Resumen de confirmación de reserva exitosa
 *
 * @param {{
 *   booking: any,
 *   onReset: () => void
 * }} props
 */
export default function BookingSummary({ booking, onReset }) {
  if (!booking) return null;

  const id = booking.id || booking._id || 'BV-8492';
  const fecha = booking.fecha || booking.reservationDate || '';
  const hora = booking.hora || booking.timeSlot || '';
  const comensales = booking.comensales || booking.guestCount || 1;
  const estado = booking.estado || booking.status || 'CONFIRMADA';
  const clienteNombre = booking.clienteNombre || booking.customerName || 'Comensal Blue Velvet';
  const seatingArea = booking.seatingArea || 'Salón Principal';

  return (
    <div className="max-w-xl mx-auto rounded-3xl p-8 velvet-glass-gold border-2 border-velvet-gold/40 text-center space-y-6 animate-fadeIn shadow-2xl">
      <div className="w-16 h-16 rounded-full bg-velvet-gold/20 border border-velvet-gold flex items-center justify-center text-velvet-gold mx-auto shadow-gold-glow animate-pulse">
        <CheckCircle className="w-9 h-9" />
      </div>

      <div className="space-y-1">
        <span className="text-xs uppercase tracking-[0.25em] text-velvet-gold font-bold">
          Reserva Confirmada
        </span>
        <h2 className="font-serif text-3xl font-bold text-white">¡Te esperamos en Blue Velvet!</h2>
        <p className="text-xs text-slate-300">
          Tu mesa ha sido asegurada con confirmación instantánea en tiempo real.
        </p>
      </div>

      {/* Tarjeta de Código y Detalles */}
      <div className="p-5 rounded-2xl bg-velvet-900/90 border border-velvet-gold/30 text-left space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              Número de Confirmación
            </p>
            <p className="font-mono text-xl font-bold text-velvet-gold">{id}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {estado}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3.5 text-xs">
          <div className="flex items-center gap-2 text-slate-200">
            <Calendar className="w-4 h-4 text-velvet-gold" />
            <span>{fecha}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <Clock className="w-4 h-4 text-velvet-gold" />
            <span>{hora}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <Users className="w-4 h-4 text-velvet-gold" />
            <span>
              {comensales} {Number(comensales) === 1 ? 'Comensal' : 'Comensales'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <MapPin className="w-4 h-4 text-velvet-gold" />
            <span>{seatingArea}</span>
          </div>
        </div>

        {clienteNombre && (
          <div className="pt-2 text-xs text-slate-400 border-t border-white/5 flex items-center justify-between">
            <span>Titular: <strong className="text-white">{clienteNombre}</strong></span>
            <span className="text-velvet-gold-light italic">Tolerancia: 15 min</span>
          </div>
        )}
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Hacer otra reserva</span>
        </button>

        <Link
          to="/menu"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-velvet-900 bg-velvet-gold hover:shadow-gold-glow transition-all"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Ver la Carta de Platos</span>
        </Link>
      </div>
    </div>
  );
}
