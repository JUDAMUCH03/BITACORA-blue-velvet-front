import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import OperacionPage from '../pages/OperacionPage';
import LandingPage from '../pages/LandingPage';
import MenuPage from '../pages/MenuPage';
import BookingPage from '../pages/BookingPage';
import LoginPage from '../pages/LoginPage';
import { MODULOS_SISTEMA } from '../components/common/OperacionLayout';

/**
 * Enrutador principal de la Single Page Application (SPA)
 * Implementa separación estricta entre vistas públicas de comensal
 * y la suite operativa protegida por RBAC Criptográfico (JWT).
 */
export default function AppRouter() {
  const ROLES_OPERATIVOS = ['ROLE_ADMIN', 'ROLE_CHEF', 'ROLE_BARTENDER', 'ROLE_MESERO'];
  const ROLES_GESTION = ['ROLE_ADMIN', 'ROLE_CHEF'];

  return (
    <BrowserRouter>
      <Routes>
        {/* ======================================================== */}
        {/* 1. VISTAS PÚBLICAS (ACCESO LIBRE PARA COMENSALES)         */}
        {/* ======================================================== */}
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/bienvenida"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/menu"
          element={
            <Layout>
              <MenuPage />
            </Layout>
          }
        />
        <Route
          path="/reservas"
          element={
            <Layout>
              <BookingPage />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />

        {/* ======================================================== */}
        {/* 2. SUITE OPERATIVA PROTEGIDA (RBAC: ADMIN, CHEF, BAR, MESERO) */}
        {/* ======================================================== */}
        <Route element={<ProtectedRoute allowedRoles={ROLES_OPERATIVOS} />}>
          <Route path="/operacion" element={<OperacionPage />} />
          <Route
            path="/operacion/carta"
            element={<OperacionPage moduloInicial={MODULOS_SISTEMA.CARTA} />}
          />
          <Route
            path="/operacion/sala"
            element={<OperacionPage moduloInicial={MODULOS_SISTEMA.SALA} />}
          />
          <Route
            path="/operacion/barra"
            element={<OperacionPage moduloInicial={MODULOS_SISTEMA.BARRA} />}
          />
          <Route
            path="/operacion/liquidacion"
            element={<OperacionPage moduloInicial={MODULOS_SISTEMA.LIQUIDACION} />}
          />

          {/* Rutas directas operativas */}
          <Route
            path="/carta"
            element={<OperacionPage moduloInicial={MODULOS_SISTEMA.CARTA} />}
          />
          <Route
            path="/sala"
            element={<OperacionPage moduloInicial={MODULOS_SISTEMA.SALA} />}
          />
          <Route
            path="/barra"
            element={<OperacionPage moduloInicial={MODULOS_SISTEMA.BARRA} />}
          />
          <Route
            path="/liquidacion"
            element={<OperacionPage moduloInicial={MODULOS_SISTEMA.LIQUIDACION} />}
          />
        </Route>

        {/* ======================================================== */}
        {/* 3. MÓDULOS DE ALTA PRIVACIDAD (EXCLUSIVO ADMIN / CHEF)   */}
        {/* ======================================================== */}
        <Route element={<ProtectedRoute allowedRoles={ROLES_GESTION} />}>
          <Route
            path="/operacion/catalogo"
            element={<OperacionPage moduloInicial={MODULOS_SISTEMA.CATALOGO} />}
          />
          <Route
            path="/catalogo"
            element={<OperacionPage moduloInicial={MODULOS_SISTEMA.CATALOGO} />}
          />
          <Route
            path="/auditoria"
            element={<OperacionPage moduloInicial={MODULOS_SISTEMA.CATALOGO} />}
          />
        </Route>

        {/* Redirección por defecto ante rutas desconocidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
