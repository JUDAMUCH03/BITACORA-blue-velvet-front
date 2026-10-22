import { useState, useEffect, useCallback } from 'react';
import menuService from '../services/menuService';

export const MENU_CATEGORIES = [
  'TODOS',
  'COCTEL_AUTOR',
  'DESTILADO_PREMIUM',
  'MOCKTAIL',
  'BOTANICO',
];

/**
 * Custom Hook para gestionar la carga, filtrado y refresco de la carta de Blue Velvet
 *
 * @param {string} [initialCategory='TODOS']
 * @returns {{
 *   items: Array<any>,
 *   loading: boolean,
 *   error: string | null,
 *   activeCategory: string,
 *   setActiveCategory: (category: string) => void,
 *   refreshMenu: () => Promise<void>
 * }}
 */
export function useMenu(initialCategory = 'TODOS') {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const fetchItems = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    try {
      const data = await menuService.getMenuItems(category);
      setItems(data);
    } catch (err) {
      console.error('[useMenu] Error al consultar la carta:', err);
      setError(err.message || 'No se pudo cargar la carta de cócteles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(activeCategory);
  }, [activeCategory, fetchItems]);

  const refreshMenu = useCallback(async () => {
    await fetchItems(activeCategory);
  }, [activeCategory, fetchItems]);

  return {
    items,
    loading,
    error,
    activeCategory,
    setActiveCategory,
    refreshMenu,
  };
}

export default useMenu;
