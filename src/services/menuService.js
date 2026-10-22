import api from './api';
import { MenuItemDTO } from '../dtos/menuDTOs';

/**
 * Mapeo fotográfico de alta resolución para la carta botánica de Blue Velvet
 */
export const COCKTAIL_IMAGE_MAP = {
  1: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80', // Smoked Old Fashioned
  2: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80', // Velvet Negroni Botánico
  3: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80', // Penicillin de Autor
  4: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=800&q=80', // Mezcalita Floral Oaxaqueña
  5: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80', // Macallan 12 Double Cask
  6: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80', // Zacapa Centenario 23
  7: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80', // Velvet Cloud 0.0%
  8: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', // Elíxir Botánico de Romero
};

const DEFAULT_COCKTAIL_IMAGE =
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80';

/**
 * Catálogo idéntico a la base de datos PostgreSQL de Azure
 * 8 Creaciones de autor sin alimentos, carnes ni postres.
 */
export const FALLBACK_MENU_ITEMS = [
  MenuItemDTO(
    1,
    'Smoked Old Fashioned',
    'Bourbon añejado en roble, bitter de cacao, azúcar demerara y ahumado en campana de madera.',
    45000,
    'COCTEL_AUTOR',
    COCKTAIL_IMAGE_MAP[1],
    true
  ),
  MenuItemDTO(
    2,
    'Velvet Negroni Botánico',
    'Gin macerado en lavanda y enebro, Campari infusionado y vermouth rosso de autor.',
    42000,
    'COCTEL_AUTOR',
    COCKTAIL_IMAGE_MAP[2],
    true
  ),
  MenuItemDTO(
    3,
    'Penicillin de Autor',
    'Blended scotch whisky, jengibre fresco macerado, miel de agave, limón y toque de Islay ahumado.',
    44000,
    'COCTEL_AUTOR',
    COCKTAIL_IMAGE_MAP[3],
    true
  ),
  MenuItemDTO(
    4,
    'Mezcalita Floral Oaxaqueña',
    'Mezcal artesanal espadín, licor de damiana, cordial de flor de jamaica y sal de gusano ahumada.',
    40000,
    'COCTEL_AUTOR',
    COCKTAIL_IMAGE_MAP[4],
    true
  ),
  MenuItemDTO(
    5,
    'Macallan 12 Double Cask',
    'Single malt scotch servido en esfera de hielo tallada a mano con notas de miel y roble.',
    65000,
    'DESTILADO_PREMIUM',
    COCKTAIL_IMAGE_MAP[5],
    true
  ),
  MenuItemDTO(
    6,
    'Zacapa Centenario 23',
    'Ron añejado en sistema solera, servido en copa balón con twist de naranja y nibs de cacao.',
    55000,
    'DESTILADO_PREMIUM',
    COCKTAIL_IMAGE_MAP[6],
    true
  ),
  MenuItemDTO(
    7,
    'Velvet Cloud 0.0%',
    'Hidrolatos botánicos de enebro sin alcohol, clarificado de cítricos y cordial de jazmín 0.0% ABV.',
    28000,
    'MOCKTAIL',
    COCKTAIL_IMAGE_MAP[7],
    true
  ),
  MenuItemDTO(
    8,
    'Elíxir Botánico de Romero',
    'Infusión fría de romero silvestre, tónica artesanal de flor de sauco y perfume de bergamota.',
    26000,
    'BOTANICO',
    COCKTAIL_IMAGE_MAP[8],
    true
  ),
];

/**
 * Normaliza categorías para búsquedas tolerantes
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
 * Asigna una imagen estética a cada cóctel recibido de la base de datos
 */
function resolveCocktailImage(item) {
  if (item.imagenUrl && item.imagenUrl.startsWith('http')) {
    return item.imagenUrl;
  }
  const idNum = Number(item.id);
  return COCKTAIL_IMAGE_MAP[idNum] || DEFAULT_COCKTAIL_IMAGE;
}

/**
 * Servicio de Gestión de la Carta de Mixología y Coctelería de Autor (Spring Boot / Azure)
 */
export const menuService = {
  /**
   * Obtiene la carta de cócteles directamente desde PostgreSQL de Azure
   * @param {string} [categoria]
   * @returns {Promise<Array<ReturnType<typeof MenuItemDTO>>>}
   */
  getMenuItems: async (categoria) => {
    const normalizedCat = normalizeCategory(categoria);
    const isAll = !categoria || normalizedCat === 'todos';

    try {
      let rawData = [];

      // Consulta prioritaria al endpoint oficial de la carta
      try {
        const res = await api.get('/menu');
        if (Array.isArray(res.data) && res.data.length > 0) {
          rawData = res.data;
        }
      } catch (err) {
        // Fallback a /platos
        try {
          const resPlatos = await api.get('/platos');
          if (Array.isArray(resPlatos.data) && resPlatos.data.length > 0) {
            rawData = resPlatos.data;
          }
        } catch (_) {}
      }

      // Si el backend responde con los datos de PostgreSQL, se utilizan directamente
      if (rawData.length === 0) {
        rawData = FALLBACK_MENU_ITEMS;
      }

      const parsedItems = rawData.map((item) =>
        MenuItemDTO(
          item.id,
          item.nombre,
          item.descripcion,
          item.precio,
          item.categoria,
          resolveCocktailImage(item),
          item.disponible !== undefined ? item.disponible : true
        )
      );

      if (!isAll) {
        return parsedItems.filter((i) =>
          normalizeCategory(i.categoria) === normalizedCat ||
          i.categoria?.toUpperCase() === categoria?.toUpperCase()
        );
      }
      return parsedItems;
    } catch (error) {
      console.warn(
        `[menuService] Fallback local activo (${error.message}). Utilizando los 8 cócteles botánicos oficiales.`
      );

      if (!isAll) {
        return FALLBACK_MENU_ITEMS.filter((item) =>
          normalizeCategory(item.categoria) === normalizedCat ||
          item.categoria?.toUpperCase() === categoria?.toUpperCase()
        );
      }
      return FALLBACK_MENU_ITEMS;
    }
  },

  /**
   * Obtiene el detalle de un cóctel por su ID
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
        const resPlatos = await api.get(`/platos/${id}`);
        item = resPlatos.data;
      }

      return MenuItemDTO(
        item.id,
        item.nombre,
        item.descripcion,
        item.precio,
        item.categoria,
        resolveCocktailImage(item),
        item.disponible
      );
    } catch (error) {
      const fallbackItem = FALLBACK_MENU_ITEMS.find((i) => String(i.id) === String(id));
      if (fallbackItem) return fallbackItem;
      throw error;
    }
  },

  /**
   * Crea un nuevo cóctel en la carta persistiendo en PostgreSQL (POST /api/v1/platos)
   * @param {{ nombre: string, precio: number, categoria: string, descripcion: string }} itemData
   * @returns {Promise<ReturnType<typeof MenuItemDTO>>}
   */
  createMenuItem: async (itemData) => {
    try {
      const response = await api.post('/platos', {
        nombre: itemData.nombre,
        precio: Number(itemData.precio),
        categoria: itemData.categoria,
        descripcion: itemData.descripcion || '',
      });
      const created = response.data;
      return MenuItemDTO(
        created.id,
        created.nombre,
        created.descripcion,
        created.precio,
        created.categoria,
        resolveCocktailImage(created),
        created.disponible
      );
    } catch (error) {
      console.error('[menuService] Error al crear cóctel en PostgreSQL:', error);
      throw error;
    }
  },
};

export default menuService;
