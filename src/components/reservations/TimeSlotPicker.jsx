import React from 'react';
import { Clock, Loader2 } from 'lucide-react';

/**
 * Selector interactivo de franjas horarias
 *
 * @param {{
 *   slots?: string[],
 *   selectedSlot: string,
 *   onSelectSlot: (slot: string) => void,
 *   loading?: boolean,
 *   disabledSlots?: string[]
 * }} props
 */
export default function TimeSlotPicker({
  slots = [],
  selectedSlot,
  onSelectSlot,
  loading = false,
  disabledSlots = [],
}) {
  const defaultSlots = [
    '13:30', '14:00', '14:30', '15:00',
    '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  const currentSlots = slots.length > 0 ? slots : defaultSlots;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-wider text-slate-300 font-medium flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-velvet-gold" />
          <span>Franja Horaria de Servicio</span>
        </label>
        {loading && (
          <span className="text-xs text-velvet-gold flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Consultando turnos...</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
        {currentSlots.map((slot) => {
          const isSelected = selectedSlot === slot;
          const isDisabled = disabledSlots.includes(slot);

          return (
            <button
              type="button"
              key={slot}
              disabled={isDisabled || loading}
              onClick={() => onSelectSlot(slot)}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                isSelected
                  ? 'bg-velvet-gold text-velvet-900 font-bold shadow-gold-glow scale-105 ring-1 ring-velvet-gold'
                  : isDisabled
                  ? 'bg-velvet-900/60 text-slate-600 border border-white/5 cursor-not-allowed line-through'
                  : 'bg-velvet-800/80 text-slate-200 hover:text-white hover:bg-velvet-800 border border-white/10 hover:border-velvet-gold/40'
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}
