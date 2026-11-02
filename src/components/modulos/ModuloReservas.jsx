import React from 'react';
import { CalendarCheck } from 'lucide-react';
import ReservasLista from '../reservations/ReservasLista';

/**
 * Módulo operativo de reservas: consulta y gestión de las reservas de mesa registradas.
 */
export default function ModuloReservas() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-superficie-profunda border border-oro/30 text-oro text-[11px] font-bold uppercase tracking-[0.2em]">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Libro de Reservas</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-texto tracking-tight">
          Reservas de Mesa
        </h1>

        <p className="text-texto-secundario text-xs sm:text-sm font-light">
          Consulta las reservas de los comensales, confirma su llegada o cancela las que ya no aplican.
        </p>
      </div>

      <ReservasLista />
    </div>
  );
}
