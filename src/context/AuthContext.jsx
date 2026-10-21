import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { TOKEN_STORAGE_KEY } from '../services/api';
import { LoginRequestDTO } from '../dtos/authDTOs';

export const AuthContext = createContext(null);

/**
 * Proveedor Global de Autenticación y Autorización
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicialización de sesión desde localStorage al montar la app
  useEffect(() => {
    try {
      const storedUser = authService.getCurrentUser();
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (storedToken && storedUser) {
        setUser(storedUser);
        setToken(storedToken);
      }
    } catch (e) {
      console.error('[AuthProvider] Error al cargar sesión inicial:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Autenticación con credenciales
   * Acepta tanto firma (correo, password) como objeto ({ correo, password } / { email, password })
   */
  const login = async (correoOrObj, maybePassword) => {
    let emailInput = '';
    let passInput = '';

    if (typeof correoOrObj === 'object' && correoOrObj !== null) {
      emailInput = correoOrObj.correo || correoOrObj.email || '';
      passInput = correoOrObj.password || '';
    } else {
      emailInput = correoOrObj;
      passInput = maybePassword;
    }

    const payload = LoginRequestDTO(emailInput, passInput);
    const authData = await authService.login(payload);

    setUser(authData);
    setToken(authData.token);

    return authData;
  };

  /**
   * Cierre de sesión y limpieza de estados
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    isAdmin: user?.rol === 'ADMIN',
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
