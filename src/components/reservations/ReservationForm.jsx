import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Sparkles, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import bookingService from '../../services/bookingService';

const DEFAULT_TIME_SLOTS = [
  '13:30', '14:00', '14:30', '15:00',
  '19:30', '20:00', '20:30', '21:00', '21:30'
];

const SEATING_AREAS = [
  { id: 'salon', name: 'Salón Principal', desc: 'Ambiente íntimo con iluminación de terciopelo' },
  { id: 'cava', name: 'Cava Privada', desc: 'Rodeado de nuestra colección de 180 etiquetas' },
  { id: 'terraza', name: 'Terraza Panorámica', desc: 'Vistas exteriores y aire fresco climatizado' },
];

export default function ReservationForm({ onSubmit, loading, error }) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    reservationDate: tomorrow,
    timeSlot: '20:30',
    guestCount: 2,
    seatingArea: 'Salón Principal',
    specialNotes: '',
  });

  const [availableSlots, setAvailableSlots] = useState(DEFAULT_TIME_SLOTS);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Consulta dinámica de franjas horarias disponibles según la fecha seleccionada
  useEffect(() => {
    let isMounted = true;
    const fetchSlots = async () => {
      if (!formData.reservationDate) return;
      setLoadingSlots(true);
      try {
        const slots = await bookingService.getAvailableSlots(formData.reservationDate);
        if (isMounted && Array.isArray(slots) && slots.length > 0) {
          setAvailableSlots(slots);
          if (!slots.includes(formData.timeSlot)) {
            setFormData((prev) => ({ ...prev, timeSlot: slots[0] }));
          }
        }
      } catch (err) {
        console.warn('Error al consultar turnos disponibles:', err);
      } finally {
        if (isMounted) setLoadingSlots(false);
      }
    };

    fetchSlots();

    return () => {
      isMounted = false;
    };
  }, [formData.reservationDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuestsChange = (increment) => {
    setFormData((prev) => {
      const nextCount = prev.guestCount + increment;
      if (nextCount < 1 || nextCount > 10) return prev;
      return { ...prev, guestCount: nextCount };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 rounded-3xl velvet-glass border border-velvet-gold/30 space-y-8">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* PASO 1: SELECCIÓN DE COMENSALES Y FECHA */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-velvet-gold/20 text-velvet-gold text-xs flex items-center justify-center font-bold">1</span>
          <span>Fecha y Número de Comensales</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
              Fecha de la Reserva
            </label>
            <div className="relative">
              <input
                type="date"
                name="reservationDate"
                min={tomorrow}
                value={formData.reservationDate}
                onChange={handleChange}
                required
                className="w-full bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-velvet-gold transition-colors"
              />
              <Calendar className="w-4 h-4 text-velvet-gold absolute right-4 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
              Comensales (Máx. 10)
            </label>
            <div className="flex items-center justify-between bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-2.5">
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-velvet-gold" />
                <span>{formData.guestCount} {formData.guestCount === 1 ? 'persona' : 'personas'}</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleGuestsChange(-1)}
                  disabled={formData.guestCount <= 1}
                  className="w-8 h-8 rounded-lg bg-velvet-900 border border-white/10 text-white hover:bg-velvet-gold hover:text-velvet-900 font-bold transition-colors disabled:opacity-30"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => handleGuestsChange(1)}
                  disabled={formData.guestCount >= 10}
                  className="w-8 h-8 rounded-lg bg-velvet-900 border border-white/10 text-white hover:bg-velvet-gold hover:text-velvet-900 font-bold transition-colors disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PASO 2: FRANJA HORARIA */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-velvet-gold/20 text-velvet-gold text-xs flex items-center justify-center font-bold">2</span>
            <span>Selecciona tu Franja Horaria</span>
          </h3>
          {loadingSlots && (
            <span className="text-xs text-velvet-gold flex items-center gap-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Consultando turnos...</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {availableSlots.map((slot) => {
            const isSelected = formData.timeSlot === slot;
            return (
              <button
                type="button"
                key={slot}
                onClick={() => setFormData((prev) => ({ ...prev, timeSlot: slot }))}
                className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-velvet-gold text-velvet-900 font-bold shadow-gold-glow scale-105'
                    : 'bg-velvet-800/80 text-slate-300 hover:text-white hover:bg-velvet-800 border border-white/5'
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* PASO 3: PREFERENCIA DE ESPACIO */}
      <div className="space-y-3">
        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-velvet-gold/20 text-velvet-gold text-xs flex items-center justify-center font-bold">3</span>
          <span>Zona y Ambiente</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SEATING_AREAS.map((area) => {
            const isSelected = formData.seatingArea === area.name;
            return (
              <button
                type="button"
                key={area.id}
                onClick={() => setFormData((prev) => ({ ...prev, seatingArea: area.name }))}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'border-velvet-gold bg-velvet-gold/10'
                    : 'border-white/10 bg-velvet-800/40 hover:bg-velvet-800/70'
                }`}
              >
                <p className={`text-xs font-bold ${isSelected ? 'text-velvet-gold' : 'text-white'}`}>
                  {area.name}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 font-light leading-snug">
                  {area.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* PASO 4: DATOS DE CONTACTO */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-velvet-gold/20 text-velvet-gold text-xs flex items-center justify-center font-bold">4</span>
          <span>Datos del Titular</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
              Nombre Completo
            </label>
            <input
              type="text"
              name="customerName"
              placeholder="Ej: Sofia Gómez"
              value={formData.customerName}
              onChange={handleChange}
              required
              className="w-full bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-velvet-gold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="customerEmail"
              placeholder="sofia@ejemplo.com"
              value={formData.customerEmail}
              onChange={handleChange}
              required
              className="w-full bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-velvet-gold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
              Teléfono de Contacto
            </label>
            <input
              type="tel"
              name="customerPhone"
              placeholder="+34 600 000 000"
              value={formData.customerPhone}
              onChange={handleChange}
              required
              className="w-full bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-velvet-gold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
            Notas Especiales o Alergias (Opcional)
          </label>
          <textarea
            name="specialNotes"
            rows="2"
            placeholder="Alergias, celebración de aniversario, preferencia de mesa tranquila..."
            value={formData.specialNotes}
            onChange={handleChange}
            className="w-full bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-velvet-gold"
          />
        </div>
      </div>

      {/* BOTÓN SUBMIT */}
      <div className="pt-4 border-t border-white/10">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-full font-bold text-velvet-900 bg-gradient-to-r from-velvet-gold via-velvet-gold-light to-velvet-gold shadow-gold-glow hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 text-base disabled:opacity-50"
        >
          {loading ? (
            <span>Validando disponibilidad...</span>
          ) : (
            <>
              <span>Confirmar Reserva Inmediata</span>
              <ArrowRight className="w-5 h-5 text-velvet-900" />
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-slate-400 mt-2">
          Sin recargo previo ni tarjeta de crédito requerida. Política de cancelación flexible.
        </p>
      </div>
    </form>
  );
}
