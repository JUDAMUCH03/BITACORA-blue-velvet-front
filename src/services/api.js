import axios from 'axios';

/**
 * Constantes de configuración de la API y llaves de almacenamiento
 * En producción (Vercel), utiliza '/api/v1' aprovechando el reverse proxy de vercel.json hacia Azure.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? '/api/v1' : 'http://localhost:8080/api/v1');

export const TOKEN_STORAGE_KEY = 'blue_velvet_token';
export const USER_STORAGE_KEY = 'blue_velvet_user';

/**
 * Instancia centralizada de Axios para la comunicación con Spring Boot 3
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
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
 * Manejo centralizado de errores HTTP 401 y normalización de errores.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // 401: Token inválido, expirado o sesión no autorizada (excepto en login)
      if (status === 401 && !error.config?.url?.includes('/auth/login')) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);

        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      const errorMessage =
        data?.message ||
        data?.error ||
        `Error HTTP ${status}: ${error.response.statusText || 'Error en la petición'}`;

      error.status = status;
      error.message = errorMessage;
      return Promise.reject(error);
    } else if (error.request) {
      const networkError = new Error(
        'No se pudo establecer conexión con el backend de Blue Velvet o se agotó el tiempo de espera.'
      );
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }

    return Promise.reject(error);
  }
);

export const api = apiClient;
export default apiClient;
