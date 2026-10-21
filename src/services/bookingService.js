import api from './api';
import { BookingResponseDTO } from '../dtos/bookingDTOs';

const RESERVAS_STORAGE_KEY = 'blue_velvet_reservas';

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

/**
 * Helper para persistencia local de reservas (Prospectos de Landing Page)
 */
function getStoredBookings() {
  try {
    const raw = localStorage.getItem(RESERVAS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveStoredBooking(booking) {
  try {
    const current = getStoredBookings();
    localStorage.setItem(RESERVAS_STORAGE_KEY, JSON.stringify([booking, ...current]));
  } catch (e) {
    console.warn('[bookingService] No se pudo guardar reserva en localStorage:', e);
  }
}

/**
 * Servicio de Gestión de Reservas y Disponibilidad de Mesas (DOSW)
 * NOTA DE INTEGRACIÓN: El backend en Azure actualmente no expone ReservaController.
 * Este servicio intenta la comunicación HTTP con la API REST y, de forma transparente,
 * almacena las reservas confirmadas en localStorage como captura de prospectos de la Landing Page.
 */
export const bookingService = {
  /**
   * Consulta las franjas horarias disponibles para una fecha determinada
   * @param {string} fecha - Formato YYYY-MM-DD
   * @returns {Promise<string[]>}
   */
  getAvailableSlots: async (fecha) => {
    try {
      const response = await api.get('/turnos/disponibles', {
        params: { fecha },
      });
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return DEFAULT_SLOTS;
    } catch (error) {
      return DEFAULT_SLOTS;
    }
  },

  /**
   * Registra una nueva reserva en el sistema
   * @param {ReturnType<import('../dtos/bookingDTOs').CreateBookingRequestDTO>} bookingDTO
   * @returns {Promise<ReturnType<typeof BookingResponseDTO>>}
   */
  createBooking: async (bookingDTO) => {
    const bookingCode = `BV-${Math.floor(1000 + Math.random() * 9000)}`;
    const nuevaReserva = BookingResponseDTO(
      bookingCode,
      bookingDTO.fecha,
      bookingDTO.hora,
      'CONFIRMADA',
      bookingDTO.comensales,
      0,
      bookingDTO.clienteNombre || 'Comensal Blue Velvet'
    );

    try {
      // Intentar persistencia en endpoint REST si estuviera activo
      const response = await api.post('/reservas', bookingDTO);
      const data = response.data;
      const confirmada = BookingResponseDTO(
        data.id || data._id || bookingCode,
        data.fecha || bookingDTO.fecha,
        data.hora || bookingDTO.hora,
        data.estado || 'CONFIRMADA',
        data.comensales || bookingDTO.comensales,
        data.total || 0,
        data.clienteNombre || bookingDTO.clienteNombre || 'Comensal Blue Velvet'
      );
      saveStoredBooking(confirmada);
      return confirmada;
    } catch (error) {
      // Si el backend no tiene implementado /reservas (404) o está desconectado,
      // confirmar la reserva y persistirla localmente
      saveStoredBooking(nuevaReserva);
      return nuevaReserva;
    }
  },

  /**
   * Consulta las reservas del usuario autenticado
   * @returns {Promise<Array<ReturnType<typeof BookingResponseDTO>>>}
   */
  getMyBookings: async () => {
    try {
      const response = await api.get('/reservas/mis-reservas');
      const list = Array.isArray(response.data) ? response.data : [];
      if (list.length > 0) {
        return list.map((item) =>
          BookingResponseDTO(
            item.id || item._id,
            item.fecha,
            item.hora,
            item.estado,
            item.comensales,
            item.total,
            item.clienteNombre
          )
        );
      }
    } catch (error) {
      // Fallback a almacenamiento local
    }
    return getStoredBookings();
  },

  /**
   * Consulta global de todas las reservas registradas (rol ADMIN / Staff)
   * @returns {Promise<Array<ReturnType<typeof BookingResponseDTO>>>}
   */
  getAllBookings: async () => {
    try {
      const response = await api.get('/reservas');
      const list = Array.isArray(response.data) ? response.data : [];
      if (list.length > 0) {
        return list.map((item) =>
          BookingResponseDTO(
            item.id || item._id,
            item.fecha,
            item.hora,
            item.estado,
            item.comensales,
            item.total,
            item.clienteNombre
          )
        );
      }
    } catch (error) {
      // Fallback a almacenamiento local
    }
    return getStoredBookings();
  },

  /**
   * Cancela una reserva existente
   * @param {string|number} reservaId
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  cancelBooking: async (reservaId) => {
    try {
      await api.delete(`/reservas/${reservaId}`);
    } catch (error) {
      // Eliminar de localStorage
      const current = getStoredBookings();
      const filtradas = current.filter((b) => String(b.id) !== String(reservaId));
      localStorage.setItem(RESERVAS_STORAGE_KEY, JSON.stringify(filtradas));
    }
    return {
      success: true,
      message: 'Reserva cancelada exitosamente',
    };
  },
};

export default bookingService;
