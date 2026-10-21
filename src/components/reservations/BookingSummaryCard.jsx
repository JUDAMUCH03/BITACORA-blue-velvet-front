import React from 'react';
import { CheckCircle, Calendar, Clock, Users, MapPin, Sparkles, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BookingSummaryCard({ booking, onNewBooking }) {
  const fecha = booking.fecha || booking.reservationDate;
  const hora = booking.hora || booking.timeSlot;
  const comensales = booking.comensales || booking.guestCount;
  const estado = booking.estado || booking.status || 'CONFIRMADA';
  const clienteNombre = booking.clienteNombre || booking.customerName || 'Invitado';
  const seatingArea = booking.seatingArea || 'Salón Principal';

  return (
    <div className="max-w-xl mx-auto rounded-3xl p-8 velvet-glass-gold border-2 border-velvet-gold/40 text-center space-y-6 animate-fadeIn shadow-2xl">
      <div className="w-16 h-16 rounded-full bg-velvet-gold/20 border border-velvet-gold flex items-center justify-center text-velvet-gold mx-auto shadow-gold-glow">
        <CheckCircle className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <span className="text-xs uppercase tracking-[0.25em] text-velvet-gold font-bold">
          Reserva Confirmada
        </span>
        <h2 className="font-serif text-3xl font-bold text-white">¡Te esperamos en Blue Velvet!</h2>
        <p className="text-xs text-slate-300">
          Hemos procesado tu reserva en MongoDB con confirmación instantánea.
        </p>
      </div>

      {/* Tarjeta de Código de Confirmación */}
      <div className="p-4 rounded-2xl bg-velvet-900/90 border border-velvet-gold/20 text-left space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">Código de Reserva</p>
            <p className="font-mono text-lg font-bold text-velvet-gold">{booking.id || 'BV-8492'}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {estado}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-velvet-gold" />
            <span>{fecha}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-velvet-gold" />
            <span>{hora}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Users className="w-4 h-4 text-velvet-gold" />
            <span>{comensales} {Number(comensales) === 1 ? 'Comensal' : 'Comensales'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-velvet-gold" />
            <span>{seatingArea}</span>
          </div>
        </div>

        {clienteNombre && (
          <div className="pt-2 text-xs text-slate-400 border-t border-white/5">
            Titular de la reserva: <span className="text-white font-medium">{clienteNombre}</span>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onNewBooking}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Hacer otra reserva</span>
        </button>

        <Link
          to="/menu"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-velvet-900 bg-velvet-gold hover:shadow-gold-glow transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explorar la Carta</span>
        </Link>
      </div>
    </div>
  );
}
