import api, { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './api';
import { AuthResponseDTO } from '../dtos/authDTOs';

/**
 * Servicio de Autenticación y Gestión de Sesión (Spring Boot 3 / JWT)
 */
export const authService = {
  /**
   * Autentica al usuario contra el backend REST
   * @param {{ correo: string, password: string }} loginRequestDTO
   * @returns {Promise<{ token: string, rol: string, correo: string, nombre: string }>}
   */
  login: async (loginRequestDTO) => {
    try {
      const emailValue = loginRequestDTO.email || loginRequestDTO.correo;
      const response = await api.post('/auth/login', {
        email: emailValue,
        correo: emailValue,
        password: loginRequestDTO.password,
      });

      const data = response.data;
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
    } catch (error) {
      // Modo resiliente DOSW: si el backend no está encendido en localhost:8080,
      // permite validar la SPA con credenciales de prueba.
      if (error.isNetworkError) {
        console.warn(
          '[authService] Backend no detectado en localhost:8080. Activando autenticación simulada (fallback DOSW).'
        );
        const isStaff = loginRequestDTO.correo.toLowerCase().includes('admin');
        const fallbackAuth = AuthResponseDTO(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_token_blue_velvet',
          isStaff ? 'ADMIN' : 'CLIENTE',
          loginRequestDTO.correo,
          isStaff ? 'Staff Blue Velvet' : loginRequestDTO.correo.split('@')[0]
        );

        localStorage.setItem(TOKEN_STORAGE_KEY, fallbackAuth.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fallbackAuth));
        return fallbackAuth;
      }
      throw error;
    }
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
      console.error('[authService] Error al parsear usuario de localStorage:', e);
      return null;
    }
  },

  /**
   * Verifica la existencia de un token de autenticación activo
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return Boolean(localStorage.getItem(TOKEN_STORAGE_KEY));
  },
};

export default authService;
