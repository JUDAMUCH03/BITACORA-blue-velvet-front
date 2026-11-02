import axios from 'axios';

/**
 * Constantes de configuración de la API y llaves de almacenamiento
 * En producción (Vercel), utiliza '/api/v1' aprovechando el reverse proxy de vercel.json.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const TOKEN_STORAGE_KEY = 'blue_velvet_token';
export const USER_STORAGE_KEY = 'blue_velvet_user';

export const COLD_START_MESSAGE =
  'El servidor en la nube se está inicializando (Cold Start de Azure). Por favor, espera 10 segundos y reintenta la operación.';

/**
 * Instancia centralizada de Axios para la comunicación con Spring Boot 3
 * Timeout global extendido a 30.000 ms (30 s) para soportar el Cold Start en Azure B1.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Interceptor de Solicitudes (Request Interceptor)
 * Inyecta el token Bearer JWT en las cabeceras de autorización si existe.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Respuestas (Response Interceptor)
 * Manejo centralizado de 401, detección de Cold Start (503 / timeout) y normalización de errores.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 1. Detección específica de Cold Start de Azure o Timeout en Vercel
    const status = error.response?.status;
    const isColdStart =
      status === 503 ||
      status === 504 ||
      error.code === 'ECONNABORTED' ||
      /timeout/i.test(error.message || '') ||
      error.message?.includes('Network Error');

    if (isColdStart) {
      error.message = COLD_START_MESSAGE;
      if (error.response?.data && typeof error.response.data === 'object') {
        error.response.data.message = COLD_START_MESSAGE;
      }
      return Promise.reject(error);
    }

    // 2. Manejo de respuestas con código de error HTTP del servidor
    if (error.response) {
      const { data } = error.response;

      // 401: Token inválido, expirado o sesión no autorizada
      if (status === 401) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);

        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // Normalizar mensaje de error manteniendo la estructura
      const errorMessage =
        data?.message ||
        data?.error ||
        `Error HTTP ${status}: ${error.response.statusText || 'Error en la petición'}`;

      error.message = errorMessage;
      return Promise.reject(error);
    } else if (error.request) {
      // Petición enviada pero sin respuesta del servidor
      const networkError = new Error(COLD_START_MESSAGE);
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }

    return Promise.reject(error);
  }
);

export const api = apiClient;
export default apiClient;
