/**
 * Contratos de datos para autenticación y autorización (Spring Boot 3)
 */

/**
 * Fábrica para el payload de inicio de sesión
 * @param {string} correo - Correo electrónico del usuario
 * @param {string} password - Contraseña en texto plano para autenticar
 * @returns {{ correo: string, password: string }}
 */
export function LoginRequestDTO(correo, password) {
  return {
    correo: correo ? correo.trim().toLowerCase() : '',
    password: password || '',
  };
}

/**
 * Normaliza y estructura la respuesta de autenticación del backend
 * @param {string} token - Token Bearer JWT
 * @param {string} rol - Rol asignado ('CLIENTE', 'ADMIN', 'STAFF', etc.)
 * @param {string} correo - Correo del usuario
 * @param {string} nombre - Nombre del usuario
 * @returns {{ token: string, rol: string, correo: string, nombre: string }}
 */
export function AuthResponseDTO(token, rol, correo, nombre) {
  return {
    token: token || '',
    rol: rol || 'CLIENTE',
    correo: correo || '',
    nombre: nombre || 'Invitado',
  };
}

export default {
  LoginRequestDTO,
  AuthResponseDTO,
};
