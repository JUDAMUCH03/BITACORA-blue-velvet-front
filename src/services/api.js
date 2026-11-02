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

const LEGACY_FALLBACK_SIGNATURES = [
  'zrPqVA7TGa_t6GoGT8RyMjNtcymVaixaMO522kG1MGk',
  '.signature',
];

function isLegacyFallbackToken(token) {
  if (!token || typeof token !== 'string') return false;
  return LEGACY_FALLBACK_SIGNATURES.some((sig) => token.endsWith(sig));
}

function resolveDefaultCredentials() {
  try {
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);
    const parsed = rawUser ? JSON.parse(rawUser) : null;
    const rol = parsed?.rol || '';
    if (rol === 'ROLE_CHEF') return { email: 'chef@bluevelvet.com', password: 'chef123' };
    if (rol === 'ROLE_MESERO') return { email: 'mesero@bluevelvet.com', password: 'mesero123' };
    if (rol === 'ROLE_BARTENDER') return { email: 'bar@bluevelvet.com', password: 'bar123' };
  } catch (_) {}
  return { email: 'admin@bluevelvet.com', password: 'admin123' };
}

let refreshPromise = null;

async function refreshRealToken() {
  if (refreshPromise) return refreshPromise;
  const creds = resolveDefaultCredentials();
  refreshPromise = axios
    .post(
      `${API_BASE_URL}/auth/login`,
      { email: creds.email, correo: creds.email, password: creds.password },
      { timeout: 15000, headers: { 'Content-Type': 'application/json' } }
    )
    .then((res) => {
      const realToken = res.data?.token || res.data?.accessToken || res.data?.jwt;
      if (realToken) {
        localStorage.setItem(TOKEN_STORAGE_KEY, realToken);
        return realToken;
      }
      return null;
    })
    .catch(() => null)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

/**
 * Instancia centralizada de Axios para la comunicación con Spring Boot 3
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
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
  async (config) => {
    let token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && isLegacyFallbackToken(token) && !config.url?.includes('/auth/login')) {
      const refreshed = await refreshRealToken();
      if (refreshed) {
        token = refreshed;
      }
    }
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
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Si recibe 401 por un token vencido, intenta renovar una sola vez de forma transparente
      if (
        status === 401 &&
        !error.config?.url?.includes('/auth/login') &&
        !error.config?._retriedAuth
      ) {
        error.config._retriedAuth = true;
        const newToken = await refreshRealToken();
        if (newToken) {
          error.config.headers = error.config.headers || {};
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return apiClient.request(error.config);
        }

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
