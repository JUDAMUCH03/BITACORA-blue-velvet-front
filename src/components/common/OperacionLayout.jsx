import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GlassWater,
  LayoutGrid,
  Flame,
  ReceiptText,
  Wine,
  Search,
  Bell,
  LogOut,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useBlueVelvet } from '../../context/BlueVelvetContext';
import { useAuth } from '../../context/AuthContext';
import { ROLES_USUARIO } from '../../types/dominio';
import LogoBlueVelvet from './LogoBlueVelvet';

export const MODULOS_SISTEMA = {
  CARTA: 'CARTA',
  SALA: 'SALA',
  BARRA: 'BARRA',
  LIQUIDACION: 'LIQUIDACION',
  CATALOGO: 'CATALOGO',
};

/**
 * Shell Operativo Principal de Blue Velvet — Coctelería de Autor
 * Implementa barra lateral fija en escritorio, navegación inferior en móvil,
 * cabecera translúcida con insignia RBAC legítima de solo lectura (JWT) y atmósfera nocturna.
 */
export default function OperacionLayout({
  moduloActivo,
  onCambiarModulo,
  terminoBusqueda,
  onCambiarBusqueda,
  children,
}) {
  const {
    rolActivo,
    comandasActivasKDSCount,
    alertaFlotante,
  } = useBlueVelvet();

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const itemsNavegacion = [
    {
      id: MODULOS_SISTEMA.CARTA,
      nombre: 'Carta',
      icono: GlassWater,
      badge: null,
    },
    {
      id: MODULOS_SISTEMA.SALA,
      nombre: 'Sala',
      icono: LayoutGrid,
      badge: null,
    },
    {
      id: MODULOS_SISTEMA.BARRA,
      nombre: 'Barra',
      icono: Flame,
      badge: comandasActivasKDSCount > 0 ? comandasActivasKDSCount : null,
    },
    {
      id: MODULOS_SISTEMA.LIQUIDACION,
      nombre: 'Liquidación',
      icono: ReceiptText,
      badge: null,
    },
    {
      id: MODULOS_SISTEMA.CATALOGO,
      nombre: 'Catálogo',
      icono: Wine,
      badge: null,
    },
  ];

  const infoRolActual = ROLES_USUARIO[rolActivo] || ROLES_USUARIO.ROLE_ADMIN;

  return (
    <div className="min-h-screen bg-noche text-texto font-sans relative fondo-atmosfera overflow-x-hidden">
      {/* =================================================================== */}
      {/* MONOGRAMA DECORATIVO "BV" EN PENUMBRA NOCTURNA (ESQUINA INFERIOR DERECHA) */}
      {/* =================================================================== */}
      <div
        className="fixed -bottom-16 -right-10 text-[320px] sm:text-[440px] leading-none monograma-bv z-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        BV
      </div>

      {/* =================================================================== */}
      {/* BARRA LATERAL FIJA EN ESCRITORIO (250px) */}
      {/* =================================================================== */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-[250px] bg-[#0A101F]/95 border-r border-borde backdrop-blur-2xl z-40 flex-col justify-between py-6 px-4">
        {/* Encabezado con Logotipo Oficial */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <LogoBlueVelvet tamano={46} />
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-wide text-texto leading-snug">
                Blue Velvet
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-champan font-semibold">
                Coctelería de Autor
              </span>
            </div>
          </div>

          {/* Rótulo de Sección */}
          <div className="px-3 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-oro/80">
              Operación
            </span>
          </div>

          {/* Navegación de los 5 Módulos */}
          <nav className="space-y-1.5" aria-label="Navegación principal del servicio">
            {itemsNavegacion.map((item) => {
              const Icono = item.icono;
              const activo = moduloActivo === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onCambiarModulo(item.id)}
                  style={
                    activo
                      ? {
                          boxShadow: 'inset 2px 0 #D4AF37',
                          background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.12), transparent)',
                        }
                      : {}
                  }
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 group ${
                    activo
                      ? 'text-champan font-bold'
                      : 'text-texto-secundario hover:text-texto hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icono
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        activo ? 'text-oro' : 'text-texto-tenue group-hover:text-champan'
                      }`}
                    />
                    <span>{item.nombre}</span>
                  </div>

                  {item.badge !== null && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-oro text-noche shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Pie de Barra Lateral: Estado del Turno y Servicio */}
        <div className="pt-4 border-t border-borde/70 px-2 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-texto-secundario">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-esmeralda animate-pulse" />
              <span className="font-medium text-texto">Servicio Nocturno</span>
            </span>
            <span className="text-[10px] text-oro uppercase font-bold tracking-wider">
              Activo
            </span>
          </div>
          <p className="text-[10px] text-texto-tenue leading-relaxed">
            Barra central & Sala contemporánea
          </p>
        </div>
      </aside>

      {/* =================================================================== */}
      {/* CABECERA SUPERIOR FIJA (74px) */}
      {/* =================================================================== */}
      <header className="fixed top-0 left-0 md:left-[250px] right-0 h-[74px] bg-[#080D19]/90 border-b border-[#202B40] backdrop-blur-xl z-30 flex items-center justify-between px-4 sm:px-8">
        {/* Logotipo en Móvil */}
        <div className="flex md:hidden items-center gap-2.5">
          <LogoBlueVelvet tamano={34} />
          <div className="flex flex-col">
            <span className="font-serif text-sm font-bold text-texto leading-none">
              Blue Velvet
            </span>
            <span className="text-[9px] uppercase tracking-wider text-champan font-medium">
              Coctelería
            </span>
          </div>
        </div>

        {/* Buscador Operativo (Visible en Escritorio) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mr-6">
          <div className="relative w-full">
            <input
              type="text"
              value={terminoBusqueda || ''}
              onChange={(e) => onCambiarBusqueda && onCambiarBusqueda(e.target.value)}
              placeholder="Buscar cóctel, botánico o mesa..."
              className="w-full bg-[#0D1525] border border-borde rounded-xl px-4 py-2.5 pl-10 text-xs text-texto placeholder-texto-tenue focus:outline-none focus:border-oro transition-colors"
            />
            <Search className="w-4 h-4 text-texto-tenue absolute left-3.5 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Acciones de Cabecera: Notificaciones y Credenciales de Usuario (Solo Lectura) */}
        <div className="flex items-center gap-3.5 ml-auto">
          {/* Botón de Notificaciones de Barra */}
          <button
            type="button"
            onClick={() => onCambiarModulo(MODULOS_SISTEMA.BARRA)}
            title="Comandas activas en barra"
            className="relative p-2.5 rounded-xl bg-superficie-profunda border border-borde text-texto-secundario hover:text-oro hover:border-oro/40 transition-colors"
            aria-label="Ver comandas activas en barra"
          >
            <Bell className="w-4 h-4" />
            {comandasActivasKDSCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-oro text-noche font-bold text-[9px] flex items-center justify-center shadow-gold-glow">
                {comandasActivasKDSCount}
              </span>
            )}
          </button>

          {/* Bloque Informativo de Sesión y Rol (Solo Lectura - JWT RBAC) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-superficie-profunda border border-borde">
              {/* Avatar con inicial */}
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1E293B] to-noche border border-oro/40 flex items-center justify-center text-oro text-xs font-bold font-serif shadow-sm">
                {(user?.nombre || user?.email || user?.correo || 'U').charAt(0).toUpperCase()}
              </div>

              {/* Identidad y Rol Legítimo extraído del JWT */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-texto leading-none">
                  {user?.email || user?.correo || 'Usuario'}
                </span>
                <span className="text-[10px] text-champan font-mono mt-0.5 flex items-center gap-1.5">
                  <span>{infoRolActual.nombre}</span>
                  <span className="text-texto-tenue">·</span>
                  <span className="px-1.5 py-0.5 rounded bg-oro/15 border border-oro/30 text-oro font-bold text-[9px]">
                    {rolActivo}
                  </span>
                </span>
              </div>
            </div>

            {/* Botón de Cierre de Sesión Seguro */}
            <button
              type="button"
              onClick={handleLogout}
              title="Cerrar sesión"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-superficie-profunda border border-borde text-texto-secundario hover:text-carmesi hover:border-carmesi/40 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* NOTIFICACIÓN FLOTANTE DE DOMINIO (UNIDAD DE COMANDA, RESTRICCIONES) */}
      {/* =================================================================== */}
      {alertaFlotante && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-md animate-fadeIn">
          <div
            className={`p-4 rounded-2xl backdrop-blur-xl border shadow-2xl flex items-start gap-3 ${
              alertaFlotante.tipo === 'esmeralda'
                ? 'bg-[#064e3b]/90 border-esmeralda/40 text-esmeralda-claro'
                : alertaFlotante.tipo === 'carmesi'
                ? 'bg-[#4c0519]/90 border-carmesi/40 text-carmesi-claro'
                : 'bg-[#451a03]/90 border-ambar/40 text-amber-200'
            }`}
          >
            <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold uppercase tracking-wider">Aviso Operativo</p>
              <p className="text-xs leading-relaxed">{alertaFlotante.mensaje}</p>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* ÁREA CENTRAL DE TRABAJO */}
      {/* =================================================================== */}
      <main className="md:ml-[250px] pt-[94px] pb-24 md:pb-16 px-4 sm:px-8 max-w-[1560px] mx-auto relative z-10">
        {children}
      </main>

      {/* =================================================================== */}
      {/* NAVEGACIÓN INFERIOR FIJA EN MÓVIL Y TABLET (65px) */}
      {/* =================================================================== */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 h-[65px] bg-[#080D19]/98 border-t border-borde backdrop-blur-xl z-40 grid grid-cols-5 items-center px-1"
        aria-label="Navegación inferior móvil"
      >
        {itemsNavegacion.map((item) => {
          const Icono = item.icono;
          const activo = moduloActivo === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onCambiarModulo(item.id)}
              className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
                activo ? 'text-champan font-bold' : 'text-texto-tenue hover:text-texto'
              }`}
            >
              <div className="relative">
                <Icono className={`w-5 h-5 ${activo ? 'text-oro' : ''}`} />
                {item.badge !== null && (
                  <span className="absolute -top-1.5 -right-2.5 w-3.5 h-3.5 rounded-full bg-oro text-noche font-bold text-[8px] flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-sans tracking-tight">
                {item.nombre}
              </span>
              {activo && (
                <span className="absolute bottom-1 w-6 h-0.5 bg-oro rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
