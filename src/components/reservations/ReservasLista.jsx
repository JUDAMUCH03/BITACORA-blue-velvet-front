import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, Clock, Users, MapPin, RefreshCw, Loader2, AlertCircle, CheckCircle2, XCircle, Mail, Phone } from 'lucide-react';
import bookingService, { ESTADOS_RESERVA } from '../../services/bookingService';

const ESTILOS_ESTADO = {
  [ESTADOS_RESERVA.CONFIRMADA]: { etiqueta: 'Confirmada', clase: 'insignia-verde' },
  [ESTADOS_RESERVA.PENDIENTE]: { etiqueta: 'Pendiente', clase: 'insignia-dorada' },
  [ESTADOS_RESERVA.CANCELADA]: { etiqueta: 'Cancelada', clase: 'insignia-carmesi' },
};

function formatearFecha(fecha) {
  if (!fecha) return '—';
  const [anio, mes, dia] = String(fecha).split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
}

/**
 * Listado de reservas registradas (personal). Consulta GET /reservas y se refresca
 * automáticamente cuando cambia `refreshKey` (p. ej. al crear una nueva reserva).
 */
export default function ReservasLista({ refreshKey = 0, puedeGestionar = true }) {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [procesandoId, setProcesandoId] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const lista = await bookingService.getAllBookings();
      setReservas(lista);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar, refreshKey]);

  const cambiarEstado = async (reserva, estado) => {
    if (procesandoId) return;
    setProcesandoId(reserva.id);
    setError('');
    try {
      const actualizada = await bookingService.updateBookingStatus(reserva.id, estado);
      setReservas((prev) => prev.map((r) => (r.id === actualizada.id ? actualizada : r)));
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesandoId(null);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#09101F] border border-borde space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-2 border-b border-borde">
        <h2 className="font-serif text-lg font-bold text-texto">
          Reservas registradas ({reservas.length})
        </h2>
        <button
          type="button"
          onClick={cargar}
          disabled={cargando}
          className="btn-secundario text-xs gap-2 disabled:opacity-60"
        >
          {cargando ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          <span>Actualizar</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-carmesi/10 border border-carmesi/30 text-carmesi-claro text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!cargando && !error && reservas.length === 0 && (
        <p className="py-10 text-center text-xs text-texto-tenue">
          Aún no hay reservas registradas.
        </p>
      )}

      {reservas.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-borde text-texto-secundario font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Código</th>
                <th className="py-3 px-3">Fecha y hora</th>
                <th className="py-3 px-3">Titular</th>
                <th className="py-3 px-3 text-center">Comensales</th>
                <th className="py-3 px-3">Mesa / Zona</th>
                <th className="py-3 px-3 text-center">Estado</th>
                {puedeGestionar && <th className="py-3 px-3 text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reservas.map((r) => {
                const estilo = ESTILOS_ESTADO[r.estado] || ESTILOS_ESTADO[ESTADOS_RESERVA.PENDIENTE];
                const ocupada = procesandoId === r.id;
                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-white/[0.02] transition-all duration-300 ${
                      r.estado === ESTADOS_RESERVA.CANCELADA ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3 font-mono text-champan font-bold">{r.codigo}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col gap-0.5 text-texto">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-oro" />
                          {formatearFecha(r.fecha)}
                        </span>
                        <span className="flex items-center gap-1.5 text-texto-secundario">
                          <Clock className="w-3.5 h-3.5 text-oro" />
                          {r.hora}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-texto">{r.clienteNombre}</p>
                      <p className="text-[10px] text-texto-tenue flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {r.clienteEmail}
                      </p>
                      {r.clienteTelefono && (
                        <p className="text-[10px] text-texto-tenue flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {r.clienteTelefono}
                        </p>
                      )}
                      {r.notas && <p className="text-[10px] text-texto-secundario italic mt-0.5">“{r.notas}”</p>}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1.5 font-bold text-texto">
                        <Users className="w-3.5 h-3.5 text-oro" />
                        {r.comensales}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-texto-secundario">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-oro" />
                        {r.mesaNumero ? `Mesa ${r.mesaNumero} · ` : ''}
                        {r.seatingArea}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`${estilo.clase} text-[9px] py-0.5`}>{estilo.etiqueta}</span>
                    </td>
                    {puedeGestionar && (
                      <td className="py-3.5 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {r.estado !== ESTADOS_RESERVA.CONFIRMADA && (
                            <button
                              type="button"
                              disabled={ocupada}
                              onClick={() => cambiarEstado(r, ESTADOS_RESERVA.CONFIRMADA)}
                              className="p-1.5 rounded-lg text-esmeralda hover:bg-esmeralda/10 transition-colors disabled:opacity-40"
                              title="Confirmar reserva"
                              aria-label={`Confirmar reserva ${r.codigo}`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {r.estado !== ESTADOS_RESERVA.CANCELADA && (
                            <button
                              type="button"
                              disabled={ocupada}
                              onClick={() => cambiarEstado(r, ESTADOS_RESERVA.CANCELADA)}
                              className="p-1.5 rounded-lg text-carmesi/80 hover:text-carmesi hover:bg-carmesi/10 transition-colors disabled:opacity-40"
                              title="Cancelar reserva"
                              aria-label={`Cancelar reserva ${r.codigo}`}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
