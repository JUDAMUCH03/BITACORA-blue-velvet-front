import axios from 'axios';

/**
 * Constantes de configuración de la API y llaves de almacenamiento
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const TOKEN_STORAGE_KEY = 'blue_velvet_token';
export const USER_STORAGE_KEY = 'blue_velvet_user';

/**
 * Instancia centralizada de Axios para la comunicación con Spring Boot 3
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Interceptor de Solicitudes (Request Interceptor)
 * Inyecta el token Bearer JWT en las cabeceras de autorización si existe.
 */
api.interceptors.request.use(
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
 * Manejo centralizado de errores HTTP 401 (desautorizado) y normalización de mensajes de error.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // 401: Token inválido, expirado o sesión no autorizada
      if (status === 401) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);

        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // Normalizar mensaje de error desde el backend de Spring Boot
      const errorMessage =
        data?.message ||
        data?.error ||
        `Error HTTP ${status}: ${error.response.statusText || 'Error en la petición'}`;

      const normalizedError = new Error(errorMessage);
      normalizedError.status = status;
      normalizedError.data = data;
      return Promise.reject(normalizedError);
    } else if (error.request) {
      // La petición fue realizada pero no se recibió respuesta (Servidor apagado o error de red)
      const networkError = new Error(
        'No se pudo establecer conexión con el servidor de Blue Velvet. Verifica que el backend esté activo.'
      );
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }

    return Promise.reject(error);
  }
);

export default api;
