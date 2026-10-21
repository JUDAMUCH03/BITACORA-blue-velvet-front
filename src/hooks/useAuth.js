import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom Hook para consumir el contexto global de autenticación de Blue Velvet.
 * Lanza un error explícito si se utiliza fuera del árbol jerárquico de AuthProvider.
 *
 * @returns {{
 *   user: { token: string, rol: string, correo: string, nombre: string } | null,
 *   token: string | null,
 *   loading: boolean,
 *   isAuthenticated: boolean,
 *   isAdmin: boolean,
 *   login: (correoOrObj: string | object, password?: string) => Promise<any>,
 *   logout: () => void
 * }}
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }

  return context;
}

export default useAuth;
