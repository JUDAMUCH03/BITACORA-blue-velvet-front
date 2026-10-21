import api from './api';
import { BookingResponseDTO } from '../dtos/bookingDTOs';

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
 * Servicio de Gestión de Reservas y Disponibilidad de Mesas (Spring Boot 3)
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
      console.warn(
        `[bookingService] Backend offline o sin turnos para ${fecha}. Utilizando turnos predeterminados.`
      );
      return DEFAULT_SLOTS;
    }
  },

  /**
   * Registra una nueva reserva en el sistema
   * @param {ReturnType<import('../dtos/bookingDTOs').CreateBookingRequestDTO>} bookingDTO
   * @returns {Promise<ReturnType<typeof BookingResponseDTO>>}
   */
  createBooking: async (bookingDTO) => {
    try {
      const response = await api.post('/reservas', bookingDTO);
      const data = response.data;

      return BookingResponseDTO(
        data.id || data._id || `BV-${Math.floor(1000 + Math.random() * 9000)}`,
        data.fecha || bookingDTO.fecha,
        data.hora || bookingDTO.hora,
        data.estado || 'CONFIRMADA',
        data.comensales || bookingDTO.comensales,
        data.total || 0,
        data.clienteNombre || 'Comensal Blue Velvet'
      );
    } catch (error) {
      if (error.isNetworkError) {
        console.warn(
          '[bookingService] Backend offline. Generando confirmación de reserva simulada (DOSW).'
        );
        return BookingResponseDTO(
          `BV-${Math.floor(1000 + Math.random() * 9000)}`,
          bookingDTO.fecha,
          bookingDTO.hora,
          'CONFIRMADA',
          bookingDTO.comensales,
          0,
          bookingDTO.clienteNombre || 'Comensal Blue Velvet'
        );
      }
      throw error;
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
    } catch (error) {
      console.warn('[bookingService] No se pudieron cargar reservas del usuario:', error.message);
      return [];
    }
  },

  /**
   * Consulta global de todas las reservas registradas (rol ADMIN / Staff)
   * @returns {Promise<Array<ReturnType<typeof BookingResponseDTO>>>}
   */
  getAllBookings: async () => {
    try {
      const response = await api.get('/reservas');
      const list = Array.isArray(response.data) ? response.data : [];
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
    } catch (error) {
      console.warn('[bookingService] Error en consulta global de reservas:', error.message);
      return [];
    }
  },

  /**
   * Cancela una reserva existente
   * @param {string|number} reservaId
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  cancelBooking: async (reservaId) => {
    try {
      // Intentar PATCH /reservas/{id}/cancelar o fallback a DELETE
      let response;
      try {
        response = await api.patch(`/reservas/${reservaId}/cancelar`);
      } catch (patchErr) {
        response = await api.delete(`/reservas/${reservaId}`);
      }
      return {
        success: true,
        message: response?.data?.message || 'Reserva cancelada exitosamente',
      };
    } catch (error) {
      console.error(`[bookingService] Error al cancelar reserva ${reservaId}:`, error);
      throw error;
    }
  },
};

export default bookingService;
