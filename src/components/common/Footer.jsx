import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Award,
  ShieldCheck,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';
import { BRAND } from '../../assets';

export default function Footer() {
  return (
    <footer className="bg-[#050811] text-slate-400 border-t border-velvet-gold/20 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-white/5">
          {/* COLUMNA 1: IDENTIDAD Y FILOSOFÍA */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-velvet-blue/60 border border-velvet-gold/40 text-velvet-gold font-serif font-bold text-base">
                BV
              </div>
              <span className="font-serif text-xl font-bold tracking-wider text-white">
                BLUE VELVET
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              Gastronomía de autor concebida como un arte sensorial. Cada plato es un diálogo íntimo
              entre técnica contemporánea, producto de origen y estética refinada.
            </p>
            <div className="flex items-center gap-3 text-velvet-gold text-xs tracking-wider uppercase font-semibold">
              <Award className="w-4 h-4 text-velvet-gold" />
              <span>2 Estrellas Guía Gastronómica 2026</span>
            </div>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN Y EXPERIENCIA */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-semibold text-white tracking-wide uppercase text-xs">
              Explorar la Experiencia
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-velvet-gold transition-colors duration-200 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-velvet-gold/60" />
                  <span>Inicio & Filosofía</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/menu"
                  className="hover:text-velvet-gold transition-colors duration-200 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-velvet-gold/60" />
                  <span>Carta y Maridajes</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/reservas"
                  className="hover:text-velvet-gold transition-colors duration-200 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-velvet-gold/60" />
                  <span>Reserva Online Inmediata</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-velvet-gold transition-colors duration-200 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-velvet-gold/60" />
                  <span>Acceso Club & Staff</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: HORARIOS DE SERVICIO */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-semibold text-white tracking-wide uppercase text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-velvet-gold" />
              <span>Horarios de Atención</span>
            </h3>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="p-2.5 rounded-lg bg-velvet-900/60 border border-white/5">
                <p className="font-medium text-white">Almuerzos de Autor</p>
                <p className="text-xs text-slate-400">Martes a Domingo: 13:00 – 16:30</p>
              </div>
              <div className="p-2.5 rounded-lg bg-velvet-900/60 border border-white/5">
                <p className="font-medium text-white">Cenas & Experiencia Nocturna</p>
                <p className="text-xs text-slate-400">Martes a Sábado: 19:30 – 23:30</p>
              </div>
              <p className="text-xs text-velvet-gold/80 italic">
                * Lunes cerrado por selección y descanso del equipo creativo.
              </p>
            </div>
          </div>

          {/* COLUMNA 4: CONTACTO Y UBICACIÓN */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-semibold text-white tracking-wide uppercase text-xs">
              Ubicación & Contacto
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-velvet-gold shrink-0 mt-0.5" />
                <span>{BRAND.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-velvet-gold shrink-0" />
                <span>{BRAND.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-velvet-gold shrink-0" />
                <span>{BRAND.email}</span>
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
                Síguenos en Redes
              </p>
              <div className="flex gap-2">
                <span className="w-8 h-8 rounded-lg bg-velvet-800 flex items-center justify-center text-slate-300 hover:text-velvet-gold hover:border hover:border-velvet-gold/30 transition-all cursor-pointer">
                  <Instagram className="w-4 h-4" />
                </span>
                <span className="w-8 h-8 rounded-lg bg-velvet-800 flex items-center justify-center text-slate-300 hover:text-velvet-gold hover:border hover:border-velvet-gold/30 transition-all cursor-pointer">
                  <Facebook className="w-4 h-4" />
                </span>
                <span className="w-8 h-8 rounded-lg bg-velvet-800 flex items-center justify-center text-slate-300 hover:text-velvet-gold hover:border hover:border-velvet-gold/30 transition-all cursor-pointer">
                  <Twitter className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PIE DE PÁGINA INFERIOR */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Blue Velvet Restaurant. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-velvet-gold" />
              <span>Garantía de Reserva Segura</span>
            </span>
            <span className="text-slate-600">|</span>
            <span>DOSW - Arquitectura Base Nivel 2</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
