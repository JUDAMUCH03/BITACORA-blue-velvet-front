import React from 'react';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { BlueVelvetProvider } from './context/BlueVelvetContext';

/**
 * Componente Raíz de Blue Velvet — Coctelería de Autor
 * Conecta los proveedores de contexto global (Autenticación y Operación del Gastrobar)
 */
export default function App() {
  return (
    <AuthProvider>
      <BlueVelvetProvider>
        <AppRouter />
      </BlueVelvetProvider>
    </AuthProvider>
  );
}
