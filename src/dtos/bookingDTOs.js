/**
 * Contratos de datos para el sistema de reservas y turnos (Spring Boot 3)
 */

/**
 * Fábrica para el payload de creación de una nueva reserva
 * @param {string} fecha - Formato YYYY-MM-DD
 * @param {string} hora - Formato HH:mm
 * @param {number} comensales - Cantidad de personas (1 - 10)
 * @param {string} [notas=''] - Preferencias dietéticas, mesa o alérgenos
 * @param {Array<string|number>} [serviciosIds=[]] - Identificadores de platos o menús degustación preseleccionados
 * @returns {{ fecha: string, hora: string, comensales: number, notas: string, serviciosIds: Array<string|number> }}
 */
export function CreateBookingRequestDTO(
  fecha,
  hora,
  comensales,
  notas = '',
  serviciosIds = []
) {
  return {
    fecha: fecha || '',
    hora: hora || '',
    comensales: typeof comensales === 'number' ? comensales : Number(comensales) || 1,
    notas: notas || '',
    serviciosIds: Array.isArray(serviciosIds) ? serviciosIds : [],
  };
}

/**
 * Normaliza la respuesta de una reserva confirmada desde el backend
 * @param {string|number} id - Identificador único de la reserva
 * @param {string} fecha
 * @param {string} hora
 * @param {string} estado - ('CONFIRMADA' | 'PENDIENTE' | 'CANCELADA')
 * @param {number} comensales
 * @param {number} total - Total acumulado si incluye consumos anticipados
 * @param {string} clienteNombre
 * @returns {{ id: string|number, fecha: string, hora: string, estado: string, comensales: number, total: number, clienteNombre: string }}
 */
export function BookingResponseDTO(
  id,
  fecha,
  hora,
  estado,
  comensales,
  total,
  clienteNombre
) {
  return {
    id: id || '',
    fecha: fecha || '',
    hora: hora || '',
    estado: estado || 'CONFIRMADA',
    comensales: Number(comensales) || 1,
    total: typeof total === 'number' ? total : Number(total) || 0,
    clienteNombre: clienteNombre || 'Comensal Blue Velvet',
  };
}

export default {
  CreateBookingRequestDTO,
  BookingResponseDTO,
};
