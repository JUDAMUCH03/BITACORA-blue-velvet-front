import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Menu as MenuIcon,
  X as CloseIcon,
  Sparkles,
  UtensilsCrossed,
  CalendarCheck,
  User,
  LogOut,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import LogoBlueVelvet from './LogoBlueVelvet';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const userName = user?.nombre || user?.name || 'Usuario';
  const userEmail = user?.correo || user?.email || '';

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Efecto de fondo al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Servicio Nocturno', icon: Flame },
    { to: '/menu', label: 'Carta de Autor', icon: UtensilsCrossed },
    { to: '/reservas', label: 'Reservar Mesa', icon: CalendarCheck },
  ];

  const getNavLinkClass = ({ isActive }) =>
    `relative px-3 py-2 text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
      isActive
        ? 'text-oro font-bold'
        : 'text-texto-secundario hover:text-champan'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-noche/95 backdrop-blur-md border-b border-borde shadow-lg shadow-black/40 py-3'
          : 'bg-noche/80 backdrop-blur-sm border-b border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* LOGOTIPO DE MARCA */}
          <Link
            to="/"
            className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
            aria-label="Blue Velvet — Coctelería de Autor"
          >
            <LogoBlueVelvet tamano={40} />

            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-texto group-hover:text-champan transition-colors duration-200">
                BLUE VELVET
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-oro -mt-0.5 font-sans font-semibold">
                Coctelería de Autor
              </span>
            </div>
          </Link>

          {/* NAVEGACIÓN ESCRITORIO */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} className={getNavLinkClass}>
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-oro' : 'text-texto-tenue'}`} />
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-oro to-transparent" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* ACCIONES Y BOTONES */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-panel border border-borde rounded-full px-3 py-1.5">
                <div className="w-7 h-7 rounded-full bg-superficie border border-oro/40 flex items-center justify-center text-xs text-oro font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-texto font-medium">{userName}</span>
                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="text-texto-tenue hover:text-carmesi transition-colors p-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-3 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-oro'
                      : 'text-texto-secundario hover:text-champan'
                  }`
                }
              >
                <User className="w-4 h-4" />
                <span>Iniciar Sesión</span>
              </NavLink>
            )}

            {/* BOTÓN OPERATIVO DESTACADO */}
            <Link
              to="/reservas"
              className="btn-primario text-xs px-4 py-2"
            >
              <CalendarCheck className="w-4 h-4 mr-1.5" />
              <span>Reservar Mesa</span>
            </Link>
          </div>

          {/* BOTÓN MÓVIL */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/"
              className="px-3 py-1.5 text-xs font-bold rounded-full bg-oro text-noche font-sans shadow-sm"
            >
              Servicio
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-lg text-texto-secundario hover:text-texto hover:bg-panel border border-white/10 transition-colors"
              aria-expanded={isOpen}
              aria-label="Abrir menú de navegación"
            >
              {isOpen ? <CloseIcon className="w-6 h-6 text-oro" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ RESPONSIVE DESPLEGABLE PARA MÓVILES */}
      {isOpen && (
        <div className="md:hidden bg-noche/98 border-b border-borde backdrop-blur-xl px-4 pt-4 pb-6 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-superficie border border-oro/40 text-champan'
                        : 'text-texto-secundario hover:bg-panel'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-oro" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-texto-tenue" />
                </NavLink>
              );
            })}

            <div className="pt-2 border-t border-white/10 mt-3">
              {user ? (
                <div className="flex items-center justify-between p-3 bg-panel rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-superficie border border-oro/40 flex items-center justify-center text-sm font-bold text-oro">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-texto">{userName}</p>
                      <p className="text-xs text-texto-secundario">{userEmail}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-texto-tenue hover:text-carmesi transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
                      isActive
                        ? 'bg-superficie text-champan border border-oro/40'
                        : 'text-texto-secundario hover:bg-panel'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-oro" />
                    <span>Iniciar Sesión / Registro</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-texto-tenue" />
                </NavLink>
              )}

              <div className="mt-4">
                <Link
                  to="/reservas"
                  className="w-full btn-primario py-3 text-xs"
                >
                  <CalendarCheck className="w-5 h-5 mr-2" />
                  <span>Reservar Mesa en Línea</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
