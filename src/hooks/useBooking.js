import { useState, useCallback } from 'react';
import bookingService from '../services/bookingService';
import { CreateBookingRequestDTO } from '../dtos/bookingDTOs';

/**
 * Custom Hook para gestionar el flujo completo de reserva de mesas
 * Maneja consulta de turnos, validación de formulario y confirmación de reserva
 *
 * @returns {{
 *   availableSlots: string[],
 *   loadingSlots: boolean,
 *   submitting: boolean,
 *   bookingSuccess: any | null,
 *   error: string | null,
 *   fetchSlots: (fecha: string) => Promise<string[]>,
 *   createReservation: (formData: any) => Promise<any>,
 *   resetBooking: () => void
 * }}
 */
export function useBooking() {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Consulta las franjas horarias libres para una fecha dada
   */
  const fetchSlots = useCallback(async (fecha) => {
    if (!fecha) return [];
    setLoadingSlots(true);
    setError(null);
    try {
      const slots = await bookingService.getAvailableSlots(fecha);
      setAvailableSlots(slots);
      return slots;
    } catch (err) {
      console.warn('[useBooking] Error al consultar franjas horarias:', err);
      setError('No se pudieron cargar los turnos disponibles para la fecha seleccionada.');
      return [];
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  /**
   * Valida campos mínimos y envía la solicitud de reserva al backend
   */
  const createReservation = useCallback(async (formData) => {
    setError(null);

    // Validación de campos obligatorios
    const fecha = formData.fecha || formData.reservationDate;
    const hora = formData.hora || formData.timeSlot;
    const comensales = Number(formData.comensales || formData.guestCount);
    const clienteNombre = formData.clienteNombre || formData.customerName;
    const clienteEmail = formData.clienteEmail || formData.customerEmail;

    if (!fecha) {
      const msg = 'Debes seleccionar una fecha para tu reserva.';
      setError(msg);
      throw new Error(msg);
    }

    if (!hora) {
      const msg = 'Debes seleccionar una franja horaria disponible.';
      setError(msg);
      throw new Error(msg);
    }

    if (!comensales || comensales < 1 || comensales > 10) {
      const msg = 'El número de comensales debe estar entre 1 y 10 personas.';
      setError(msg);
      throw new Error(msg);
    }

    if (!clienteNombre || clienteNombre.trim().length < 3) {
      const msg = 'Por favor ingresa el nombre completo del titular de la reserva.';
      setError(msg);
      throw new Error(msg);
    }

    if (!clienteEmail || !/^\S+@\S+\.\S+$/.test(clienteEmail)) {
      const msg = 'Por favor ingresa un correo electrónico válido para la confirmación.';
      setError(msg);
      throw new Error(msg);
    }

    setSubmitting(true);
    try {
      const dto = CreateBookingRequestDTO(
        fecha,
        hora,
        comensales,
        formData.notas || formData.specialNotes || '',
        formData.serviciosIds || []
      );

      // Metadatos de contacto y preferencia de espacio
      dto.clienteNombre = clienteNombre.trim();
      dto.clienteEmail = clienteEmail.trim();
      dto.clienteTelefono = formData.clienteTelefono || formData.customerPhone || '';
      dto.seatingArea = formData.seatingArea || 'Salón Principal';

      const result = await bookingService.createBooking(dto);
      setBookingSuccess(result);
      return result;
    } catch (err) {
      console.error('[useBooking] Error al procesar reserva:', err);
      const msg = err.message || 'No fue posible confirmar tu reserva. Intenta nuevamente.';
      setError(msg);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  /**
   * Resetea el estado de confirmación para una nueva reserva
   */
  const resetBooking = useCallback(() => {
    setBookingSuccess(null);
    setError(null);
    setSubmitting(false);
  }, []);

  return {
    availableSlots,
    loadingSlots,
    submitting,
    bookingSuccess,
    error,
    fetchSlots,
    createReservation,
    resetBooking,
  };
}

export default useBooking;
