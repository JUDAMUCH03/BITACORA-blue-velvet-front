import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import OperacionPage from '../pages/OperacionPage';
import LandingPage from '../pages/LandingPage';
import MenuPage from '../pages/MenuPage';
import BookingPage from '../pages/BookingPage';
import LoginPage from '../pages/LoginPage';
import { MODULOS_SISTEMA } from '../components/common/OperacionLayout';

/**
 * Enrutador principal de la aplicación Single Page Application (SPA)
 * Conecta la herramienta operativa profesional de Blue Velvet y las vistas públicas
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ======================================================== */}
        {/* SISTEMA OPERATIVO NOCTURNO: BLUE VELVET — COCTELERÍA */}
        {/* ======================================================== */}
        <Route path="/" element={<OperacionPage />} />
        <Route path="/operacion" element={<OperacionPage />} />
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
        <Route
          path="/catalogo"
          element={<OperacionPage moduloInicial={MODULOS_SISTEMA.CATALOGO} />}
        />

        {/* ======================================================== */}
        {/* VISTAS COMPLEMENTARIAS CON LAYOUT GENERAL */}
        {/* ======================================================== */}
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
        <Route
          path="/bienvenida"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
