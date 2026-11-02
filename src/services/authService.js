import api, { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './api';
import { AuthResponseDTO } from '../dtos/authDTOs';

/**
 * Servicio de Autenticación y Gestión de Sesión (Spring Boot 3 / JWT)
 */
export const authService = {
  /**
   * Autentica al usuario contra el backend REST (POST /api/v1/auth/login)
   * Incluye reintento automático silencioso ante 503 o timeout por Cold Start de Azure.
   * @param {{ correo: string, password: string }} loginRequestDTO
   * @returns {Promise<{ token: string, rol: string, correo: string, nombre: string }>}
   */
  login: async (loginRequestDTO) => {
    const emailValue = loginRequestDTO.email || loginRequestDTO.correo;
    const payload = {
      email: emailValue,
      correo: emailValue,
      password: loginRequestDTO.password,
    };

    const attemptLogin = async () => {
      const response = await api.post('/auth/login', payload);
      return response.data;
    };

    let data;
    try {
      data = await attemptLogin();
    } catch (firstError) {
      const status = firstError.response?.status;
      const isColdStartOrTimeout =
        status === 503 ||
        status === 504 ||
        firstError.code === 'ECONNABORTED' ||
        firstError.isNetworkError ||
        /timeout|cold start/i.test(firstError.message || '');

      if (isColdStartOrTimeout) {
        console.info(
          '[authService] Servidor en arranque en frío (Cold Start de Azure). Reintentando en 2.5 segundos...'
        );
        // Espera silenciosa de 2.5s antes del reintento
        await new Promise((resolve) => setTimeout(resolve, 2500));
        try {
          data = await attemptLogin();
        } catch (secondError) {
          console.error('[authService] Error en segundo intento de autenticación:', secondError);
          const secondStatus = secondError.response?.status;
          if (secondStatus === 503 || secondStatus === 504 || secondError.code === 'ECONNABORTED' || /timeout|cold start/i.test(secondError.message || '')) {
            throw new Error('El servidor de Azure se está inicializando (Cold Start). Espera unos segundos y vuelve a presionar Iniciar Sesión.');
          }
          throw secondError;
        }
      } else if (status === 401 || status === 403) {
        throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.');
      } else {
        console.error('[authService] Error en autenticación contra Spring Boot:', firstError);
        throw firstError;
      }
    }

    const rawToken = data.token || data.accessToken || data.jwt;
    let userRole = data.rol || data.role;
    let userEmail = data.correo || data.email || emailValue;

    // Si el backend responde { token: "..." }, decodificar claims ("rol", "roles", "sub") del JWT
    if (!userRole && rawToken && rawToken.includes('.')) {
      try {
        const payloadBase64 = rawToken.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        userRole = decodedPayload.rol || (Array.isArray(decodedPayload.roles) ? decodedPayload.roles[0] : null);
        if (decodedPayload.sub) {
          userEmail = decodedPayload.sub;
        }
      } catch (e) {
        console.warn('[authService] No se pudo extraer claims del JWT:', e);
      }
    }

    const authData = AuthResponseDTO(
      rawToken,
      userRole || 'ROLE_CLIENTE',
      userEmail,
      data.nombre || data.name || userEmail.split('@')[0]
    );

    localStorage.setItem(TOKEN_STORAGE_KEY, authData.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authData));

    return authData;
  },

  /**
   * Cierra la sesión activa, remueve credenciales locales y limpia cabeceras
   */
  logout: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    if (api.defaults?.headers?.common) {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  /**
   * Obtiene los datos del usuario actualmente almacenados en el navegador
   * @returns {{ token: string, rol: string, correo: string, nombre: string } | null}
   */
  getCurrentUser: () => {
    try {
      const rawUser = localStorage.getItem(USER_STORAGE_KEY);
      return rawUser ? JSON.parse(rawUser) : null;
    } catch (e) {
      console.warn('[authService] Error leyendo usuario de localStorage:', e);
      return null;
    }
  },

  /**
   * Obtiene el token JWT activo
   * @returns {string | null}
   */
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch (e) {
      return null;
    }
  },

  /**
   * Valida si existe una sesión activa y no expirada
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return false;

    // Validación básica de expiración del JWT en cliente
    try {
      if (token.includes('.')) {
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
          return false;
        }
      }
      return true;
    } catch (e) {
      return true;
    }
  },
};

export default authService;
