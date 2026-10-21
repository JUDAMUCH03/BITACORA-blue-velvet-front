import { useState } from 'react';
import { bookingService } from '../services/bookingService';
import { CreateBookingRequestDTO } from '../dtos/bookingDTOs';

/**
 * Custom Hook para gestionar el ciclo de vida y estado de reservas
 */
export function useReservation() {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Envía la reserva estandarizando los campos al DTO
   */
  const submitReservation = async (reservationData) => {
    setLoading(true);
    setError(null);
    try {
      const fecha = reservationData.fecha || reservationData.reservationDate;
      const hora = reservationData.hora || reservationData.timeSlot;
      const comensales = reservationData.comensales || reservationData.guestCount;
      const notas = reservationData.notas || reservationData.specialNotes || '';
      const serviciosIds = reservationData.serviciosIds || [];

      const dto = CreateBookingRequestDTO(fecha, hora, comensales, notas, serviciosIds);

      // Conservar propiedades de contacto si vienen en el formulario
      dto.clienteNombre = reservationData.customerName || reservationData.clienteNombre;
      dto.seatingArea = reservationData.seatingArea;

      const result = await bookingService.createBooking(dto);
      setSuccessData(result);
      return result;
    } catch (err) {
      const msg = err.message || 'Error al procesar la reserva';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSuccessData(null);
    setError(null);
    setLoading(false);
  };

  return {
    loading,
    successData,
    error,
    submitReservation,
    reset,
  };
}

export default useReservation;
