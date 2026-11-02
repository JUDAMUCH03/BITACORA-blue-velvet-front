import api from './api';

const DEFAULT_SLOTS = [
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
];

const ESTADOS_RESERVA = {
  PENDIENTE: 'PENDIENTE',
  CONFIRMADA: 'CONFIRMADA',
  CANCELADA: 'CANCELADA',
};

/**
 * Traduce un error HTTP en un mensaje claro para el comensal o el personal.
 */
function describirErrorReserva(error, accion) {
  const status = error?.response?.status ?? error?.status;
  const mensajeServidor = error?.response?.data?.message;

  if (!status) {
    return `${accion}: no hay conexión con el servicio. Verifica tu red e inténtalo nuevamente.`;
  }
  if (status === 401) return `${accion}: tu sesión expiró. Inicia sesión nuevamente.`;
  if (status === 403) return `${accion}: tu perfil no tiene permisos para esta operación.`;
  if (status === 400 || status === 422) return `${accion}: ${mensajeServidor || 'revisa los datos ingresados.'}`;
  return `${accion}: el servicio no pudo completar la operación. Inténtalo nuevamente.`;
}

/**
 * Normaliza una reserva del servidor al formato usado por la interfaz.
 * El identificador siempre es el generado por la base de datos.
 */
export function mapReservaServidor(r) {
  const id = r.id;
  return {
    id,
    codigo: `BV-${String(id).padStart(4, '0')}`,
    fecha: r.fecha || '',
    hora: r.hora || '',
    estado: r.estado || ESTADOS_RESERVA.PENDIENTE,
    comensales: Number(r.numeroPersonas) || 1,
    mesaNumero: r.mesaNumero ?? null,
    seatingArea: r.zona || 'Salón Principal',
    clienteNombre: r.nombreCliente || '',
    clienteEmail: r.emailCliente || '',
    clienteTelefono: r.telefono || '',
    notas: r.notas || '',
    creadoEn: r.creadoEn || null,
  };
}

/**
 * Servicio de Reservas de Mesa (Blue Velvet).
 * Toda operación se refleja en la base de datos: si el servicio rechaza o no responde,
 * el error se propaga y NUNCA se simula una reserva confirmada.
 */
export const bookingService = {
  /**
   * Franjas horarias del servicio (horario fijo de la casa)
   * @returns {Promise<string[]>}
   */
  getAvailableSlots: async () => DEFAULT_SLOTS,

  /**
   * Registra una nueva reserva (POST /reservas)
   * @param {{ fecha: string, hora: string, comensales: number, notas?: string,
   *           clienteNombre: string, clienteEmail: string, clienteTelefono?: string, seatingArea?: string }} bookingDTO
   */
  createBooking: async (bookingDTO) => {
    const payload = {
      nombreCliente: bookingDTO.clienteNombre,
      emailCliente: bookingDTO.clienteEmail,
      telefono: bookingDTO.clienteTelefono || null,
      fecha: bookingDTO.fecha,
      hora: bookingDTO.hora,
      numeroPersonas: Number(bookingDTO.comensales),
      zona: bookingDTO.seatingArea || null,
      notas: bookingDTO.notas || null,
    };

    try {
      const response = await api.post('/reservas', payload, { timeout: 25000 });
      if (!response.data || response.data.id === undefined || response.data.id === null) {
        throw new Error('Respuesta del servicio sin identificador de reserva');
      }
      return mapReservaServidor(response.data);
    } catch (error) {
      throw new Error(describirErrorReserva(error, 'No fue posible confirmar tu reserva'));
    }
  },

  /**
   * Lista todas las reservas (personal), ordenadas por fecha y hora descendente (GET /reservas)
   * @returns {Promise<Array>}
   */
  getAllBookings: async () => {
    try {
      const response = await api.get('/reservas', { timeout: 20000 });
      return Array.isArray(response.data) ? response.data.map(mapReservaServidor) : [];
    } catch (error) {
      throw new Error(describirErrorReserva(error, 'No se pudieron consultar las reservas'));
    }
  },

  /**
   * Cambia el estado de una reserva (PATCH /reservas/{id}/estado)
   * @param {number} reservaId
   * @param {'PENDIENTE'|'CONFIRMADA'|'CANCELADA'} estado
   */
  updateBookingStatus: async (reservaId, estado) => {
    try {
      const response = await api.patch(`/reservas/${reservaId}/estado`, { estado }, { timeout: 20000 });
      return mapReservaServidor(response.data);
    } catch (error) {
      throw new Error(describirErrorReserva(error, 'No se pudo actualizar la reserva'));
    }
  },

  /**
   * Cancela una reserva existente
   */
  cancelBooking: async (reservaId) => bookingService.updateBookingStatus(reservaId, ESTADOS_RESERVA.CANCELADA),
};

export { ESTADOS_RESERVA };
export default bookingService;
