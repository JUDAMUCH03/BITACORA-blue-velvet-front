import api from './api';
import { MenuItemDTO } from '../dtos/menuDTOs';

/**
 * Catálogo mock de platos y servicios de Blue Velvet con precios en Pesos Colombianos ($COP)
 */
export const FALLBACK_MENU_ITEMS = [
  MenuItemDTO(
    'd1',
    'Tartar de Atún Rojo con Emulsión de Trufa',
    'Lomo de atún rojo de almadraba marinado en soja añeja, yema curada en mirin, caviar cítrico y crujiente de alga nori.',
    78000,
    'Entradas',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    true
  ),
  MenuItemDTO(
    'd2',
    'Carpaccio de Vieira y Caviar Oscietra',
    'Láminas finas de viera salvaje, vinagreta de fruta de la pasión, perlas de caviar Oscietra y brotes de shiso morado.',
    82000,
    'Entradas',
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
    true
  ),
  MenuItemDTO(
    'd3',
    'Solomillo Rossini al Oporto Reserva',
    'Corte de solomillo de ternera madurada 45 días, foie gras mi-cuit caramelizado, reducción sedosa de Oporto y milhojas de patata trufada.',
    125000,
    'Platos Fuertes',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    true
  ),
  MenuItemDTO(
    'd4',
    'Lubina Salvaje con Risotto de Azafrán',
    'Suprema de lubina sellada a la plancha, piel crujiente, risotto al dente aromatizado con azafrán de La Mancha y jugo de hinojo asado.',
    110000,
    'Platos Fuertes',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    true
  ),
  MenuItemDTO(
    'd5',
    'Texturas de Chocolate Amargo al 70%',
    'Mousse aireada de cacao ecuatoriano, bizcocho esponjoso bañado en licor de café, crumble de avellana dorada y helado de vainilla Bourbon.',
    38000,
    'Postres',
    'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80',
    true
  ),
  MenuItemDTO(
    'd6',
    'Esfera de Frambuesa y Rosa Silvestre',
    'Cúpula fina de isomalt con ganache montada de rosas, gel de frambuesas silvestres y nieve nitrogenada de yogur griego.',
    35000,
    'Postres',
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    true
  ),
  MenuItemDTO(
    'd7',
    'Velvet Signature Smoked Old Fashioned',
    'Bourbon infusionado con haba tonka, bitter artesanal de cacao, sirope de azúcar mascabado y ahumado en campana con madera de roble.',
    48000,
    'Coctelería de Autor',
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    true
  ),
  MenuItemDTO(
    'd8',
    'Clover Club Blue Velvet Edition',
    'Gin artesanal macerado con moras silvestres, licor de violetas, reducción de frambuesa, clara espumosa y polvo de oro comestible.',
    45000,
    'Coctelería de Autor',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    true
  ),
];

/**
 * Normaliza nombres de categorías para búsquedas tolerantes
 */
function normalizeCategory(categoryStr) {
  if (!categoryStr) return '';
  return categoryStr
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Servicio de Gestión de la Carta y Catálogo Gastronómico
 */
export const menuService = {
  /**
   * Obtiene la lista de ítems de la carta con soporte de filtro por categoría
   * @param {string} [categoria]
   * @returns {Promise<Array<ReturnType<typeof MenuItemDTO>>>}
   */
  getMenuItems: async (categoria) => {
    const normalizedCat = normalizeCategory(categoria);
    const isAll = !categoria || normalizedCat === 'todos';

    try {
      let rawData = [];
      try {
        const res = await api.get('/menu');
        if (Array.isArray(res.data) && res.data.length > 0) {
          rawData = res.data;
        }
      } catch (err) {
        try {
          const resServ = await api.get('/servicios');
          if (Array.isArray(resServ.data) && resServ.data.length > 0) {
            rawData = resServ.data;
          }
        } catch (_) {}
      }

      // Si el backend en la nube no tiene productos registrados o está en frío, activar catálogo demo
      if (rawData.length === 0) {
        rawData = FALLBACK_MENU_ITEMS;
      }

      const parsedItems = rawData.map((item) =>
        MenuItemDTO(
          item.id || item._id,
          item.nombre || item.name,
          item.descripcion || item.description,
          item.precio || item.price,
          item.categoria || item.category,
          item.imagenUrl || item.imageUrl,
          item.disponible !== undefined ? item.disponible : true
        )
      );

      if (!isAll) {
        return parsedItems.filter((i) =>
          normalizeCategory(i.categoria).includes(normalizedCat)
        );
      }
      return parsedItems;
    } catch (error) {
      console.warn(
        `[menuService] Fallback resiliente activo (${error.message}). Utilizando catálogo mock ($COP).`
      );

      if (!isAll) {
        return FALLBACK_MENU_ITEMS.filter((item) => {
          const itemCat = normalizeCategory(item.categoria);
          return (
            itemCat === normalizedCat ||
            itemCat.includes(normalizedCat) ||
            normalizedCat.includes(itemCat)
          );
        });
      }
      return FALLBACK_MENU_ITEMS;
    }
  },

  /**
   * Obtiene el detalle de un plato o servicio por su identificador
   * @param {string|number} id
   * @returns {Promise<ReturnType<typeof MenuItemDTO>>}
   */
  getMenuItemById: async (id) => {
    try {
      let item = null;
      try {
        const res = await api.get(`/menu/${id}`);
        item = res.data;
      } catch (e) {
        const resServ = await api.get(`/servicios/${id}`);
        item = resServ.data;
      }

      return MenuItemDTO(
        item.id || item._id,
        item.nombre || item.name,
        item.descripcion || item.description,
        item.precio || item.price,
        item.categoria || item.category,
        item.imagenUrl || item.imageUrl,
        item.disponible
      );
    } catch (error) {
      console.warn(`[menuService] Fallback al buscar ítem id=${id}`);
      const fallbackItem = FALLBACK_MENU_ITEMS.find((i) => String(i.id) === String(id));
      if (fallbackItem) return fallbackItem;
      throw error;
    }
  },

  /**
   * Crea un nuevo plato o servicio en la carta (requiere rol ADMIN)
   * @param {ReturnType<typeof MenuItemDTO>} itemDTO
   * @returns {Promise<ReturnType<typeof MenuItemDTO>>}
   */
  createMenuItem: async (itemDTO) => {
    try {
      const response = await api.post('/servicios', itemDTO);
      const created = response.data;
      return MenuItemDTO(
        created.id || created._id,
        created.nombre || created.name,
        created.descripcion || created.description,
        created.precio || created.price,
        created.categoria || created.category,
        created.imagenUrl || created.imageUrl,
        created.disponible
      );
    } catch (error) {
      console.error('[menuService] Error al crear ítem en la carta:', error);
      throw error;
    }
  },
};

export default menuService;
