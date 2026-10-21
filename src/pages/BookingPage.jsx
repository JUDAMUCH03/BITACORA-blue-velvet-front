import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  Clock,
  Wine,
  Users,
  Calendar,
  AlertCircle,
  Loader2,
  ArrowRight,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { useBooking } from '../hooks/useBooking';
import { useAuth } from '../hooks/useAuth';
import TimeSlotPicker from '../components/reservations/TimeSlotPicker';
import BookingSummary from '../components/reservations/BookingSummary';

const SEATING_AREAS = [
  { id: 'salon', name: 'Salón Principal', desc: 'Ambiente íntimo con iluminación de terciopelo' },
  { id: 'cava', name: 'Cava Privada', desc: 'Rodeado de nuestra colección de 180 etiquetas' },
  { id: 'terraza', name: 'Terraza Panorámica', desc: 'Vistas exteriores y aire fresco climatizado' },
];

export default function BookingPage() {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const {
    availableSlots,
    loadingSlots,
    submitting,
    bookingSuccess,
    error,
    fetchSlots,
    createReservation,
    resetBooking,
  } = useBooking();

  const { user } = useAuth();

  const [fecha, setFecha] = useState(tomorrow);
  const [hora, setHora] = useState('20:30');
  const [comensales, setComensales] = useState(2);
  const [seatingArea, setSeatingArea] = useState('Salón Principal');
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [notas, setNotas] = useState('');
  const [clientValidationError, setClientValidationError] = useState('');

  // Rellenar automáticamente datos si hay sesión activa
  useEffect(() => {
    if (user) {
      if (user.nombre || user.name) {
        setClienteNombre(user.nombre || user.name);
      }
      if (user.correo || user.email) {
        setClienteEmail(user.correo || user.email);
      }
    }
  }, [user]);

  // Consultar turnos disponibles cuando cambia la fecha
  useEffect(() => {
    if (fecha) {
      fetchSlots(fecha).then((slots) => {
        if (slots && slots.length > 0 && !slots.includes(hora)) {
          setHora(slots[0]);
        }
      });
    }
  }, [fecha, fetchSlots]);

  const handleGuestsChange = (increment) => {
    setComensales((prev) => {
      const next = prev + increment;
      if (next < 1 || next > 10) return prev;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientValidationError('');

    if (!clienteNombre.trim()) {
      setClientValidationError('Por favor ingresa el nombre completo del titular.');
      return;
    }

    if (!clienteEmail.trim() || !/^\S+@\S+\.\S+$/.test(clienteEmail.trim())) {
      setClientValidationError('Por favor ingresa un correo electrónico válido para confirmar la reserva.');
      return;
    }

    try {
      await createReservation({
        fecha,
        hora,
        comensales,
        clienteNombre,
        clienteEmail,
        clienteTelefono,
        seatingArea,
        notas,
      });
    } catch (err) {
      // Manejado por el hook
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* HEADER DE LA PÁGINA */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-velvet-800 border border-velvet-gold/30 text-xs font-semibold text-velvet-gold">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Reserva Digital en Tiempo Real</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Asegura tu Mesa en Blue Velvet
        </h1>

        <p className="text-slate-300 text-sm sm:text-base font-light">
          Selecciona tu día, franja horaria y número de comensales. Recibirás tu confirmación
          instantánea con validación de disponibilidad y aforo.
        </p>
      </div>

      {/* RENDERIZADO CONDICIONAL: CONFIRMACIÓN EXITOSA vs FORMULARIO DE RESERVA */}
      {bookingSuccess ? (
        <BookingSummary booking={bookingSuccess} onReset={resetBooking} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORMULARIO DE DOS PASOS EN 2 COLUMNAS */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 p-8 rounded-3xl velvet-glass border border-velvet-gold/30 space-y-8 shadow-2xl"
          >
            {/* Mensajes de Alerta */}
            {(clientValidationError || error) && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm animate-fadeIn">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{clientValidationError || error}</span>
              </div>
            )}

            {/* =================================================== */}
            {/* PASO 1: SELECCIÓN DE FECHA Y HORARIO */}
            {/* =================================================== */}
            <div className="space-y-5">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
                <span className="w-6 h-6 rounded-full bg-velvet-gold/20 text-velvet-gold text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>Fecha y Franja Horaria</span>
              </h3>

              <div className="space-y-4">
                {/* Selector de Fecha */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                    Fecha de la Experiencia
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={tomorrow}
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      required
                      className="w-full bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-velvet-gold transition-colors"
                    />
                    <Calendar className="w-4 h-4 text-velvet-gold absolute right-4 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Selector Modular TimeSlotPicker */}
                <TimeSlotPicker
                  slots={availableSlots}
                  selectedSlot={hora}
                  onSelectSlot={setHora}
                  loading={loadingSlots}
                />
              </div>
            </div>

            {/* =================================================== */}
            {/* PASO 2: COMENSALES, ZONA Y DATOS DEL TITULAR */}
            {/* =================================================== */}
            <div className="space-y-5 pt-2">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
                <span className="w-6 h-6 rounded-full bg-velvet-gold/20 text-velvet-gold text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>Comensales, Ambiente y Datos de Contacto</span>
              </h3>

              {/* Selector de Comensales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                    Número de Comensales (Máx. 10)
                  </label>
                  <div className="flex items-center justify-between bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-2.5">
                    <span className="text-sm font-semibold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-velvet-gold" />
                      <span>{comensales} {comensales === 1 ? 'persona' : 'personas'}</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleGuestsChange(-1)}
                        disabled={comensales <= 1}
                        className="w-8 h-8 rounded-lg bg-velvet-900 border border-white/10 text-white hover:bg-velvet-gold hover:text-velvet-900 font-bold transition-colors disabled:opacity-30"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGuestsChange(1)}
                        disabled={comensales >= 10}
                        className="w-8 h-8 rounded-lg bg-velvet-900 border border-white/10 text-white hover:bg-velvet-gold hover:text-velvet-900 font-bold transition-colors disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selector de Zona */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                    Preferencia de Ubicación
                  </label>
                  <select
                    value={seatingArea}
                    onChange={(e) => setSeatingArea(e.target.value)}
                    className="w-full bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-velvet-gold"
                  >
                    {SEATING_AREAS.map((a) => (
                      <option key={a.id} value={a.name} className="bg-velvet-900 text-white">
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Datos del Titular */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Sofia Gómez"
                      value={clienteNombre}
                      onChange={(e) => setClienteNombre(e.target.value)}
                      required
                      className="w-full bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-velvet-gold"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="sofia@ejemplo.com"
                      value={clienteEmail}
                      onChange={(e) => setClienteEmail(e.target.value)}
                      required
                      className="w-full bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-velvet-gold"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                    Teléfono Celular
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+57 300 000 0000"
                      value={clienteTelefono}
                      onChange={(e) => setClienteTelefono(e.target.value)}
                      className="w-full bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-velvet-gold"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Notas Especiales */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                  Notas Especiales o Alergias (Opcional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Alergias, celebración de ocasión especial, preferencia de mesa tranquila..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="w-full bg-velvet-800/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-velvet-gold"
                />
              </div>
            </div>

            {/* BOTÓN CONFIRMAR CON SUBMITTING STATE */}
            <div className="pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full font-bold text-velvet-900 bg-gradient-to-r from-velvet-gold via-velvet-gold-light to-velvet-gold shadow-gold-glow hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 text-base disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-velvet-900" />
                    <span>Confirmando reserva en tiempo real...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar Reserva Inmediata</span>
                    <ArrowRight className="w-5 h-5 text-velvet-900" />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2">
                Reserva digital con confirmación instantánea sin recargo anticipado.
              </p>
            </div>
          </form>

          {/* PANEL LATERAL DE GARANTÍAS Y POLÍTICAS */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl velvet-glass border border-white/10 space-y-4">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-velvet-gold" />
                <span>Garantía Blue Velvet</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-velvet-gold shrink-0 mt-0.5" />
                  <span>Mesa reservada en exclusiva durante toda la franja del servicio.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Wine className="w-4 h-4 text-velvet-gold shrink-0 mt-0.5" />
                  <span>Degustación de bienvenida de cortesía para todos los comensales.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-velvet-gold shrink-0 mt-0.5" />
                  <span>Tolerancia de cortesía de 15 minutos sobre la hora reservada.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-velvet-gold shrink-0 mt-0.5" />
                  <span>Para grupos de más de 8 personas, consulta nuestros menús ejecutivos para eventos.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-velvet-blue/30 to-velvet-800/80 border border-velvet-gold/20 space-y-2">
              <p className="text-xs font-semibold text-velvet-gold uppercase tracking-wider">
                Código de Vestimenta
              </p>
              <h4 className="font-serif text-base font-bold text-white">Elegante Casual</h4>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                Recomendamos vestimenta acorde al entorno de alta gastronomía para garantizar la
                armonía de la experiencia para todos los invitados.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
