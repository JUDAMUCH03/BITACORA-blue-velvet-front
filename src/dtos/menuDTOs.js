/**
 * Contratos de datos para el menú y catálogo de servicios gastronómicos
 */

/**
 * Fábrica para estandarizar un ítem de la carta/menú
 * @param {string|number} id
 * @param {string} nombre
 * @param {string} descripcion
 * @param {number} precio
 * @param {string} categoria - ('Entradas' | 'Platos Fuertes' | 'Postres' | 'Coctelería de Autor')
 * @param {string} imagenUrl
 * @param {boolean} [disponible=true]
 * @returns {{ id: string|number, nombre: string, descripcion: string, precio: number, categoria: string, imagenUrl: string, disponible: boolean }}
 */
export function MenuItemDTO(
  id,
  nombre,
  descripcion,
  precio,
  categoria,
  imagenUrl,
  disponible = true
) {
  return {
    id: id || '',
    nombre: nombre || '',
    descripcion: descripcion || '',
    precio: typeof precio === 'number' ? precio : Number(precio) || 0,
    categoria: categoria || 'General',
    imagenUrl: imagenUrl || '',
    disponible: Boolean(disponible),
  };
}

export default {
  MenuItemDTO,
};
