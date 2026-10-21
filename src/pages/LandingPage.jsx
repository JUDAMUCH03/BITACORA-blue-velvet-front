import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  UtensilsCrossed,
  CalendarCheck,
  Star,
  ShieldCheck,
  Clock,
  Wine,
  Flame,
  Award,
  ChevronRight,
  Quote,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  const pillars = [
    {
      icon: Flame,
      title: 'Ingredientes de Origen y Autor',
      description:
        'Platos concebidos con técnica contemporánea y materias primas seleccionadas de pequeños productores locales y lonjas sostenibles.',
      tag: 'Técnica & Sabor',
    },
    {
      icon: Wine,
      title: 'Atmósfera y Maridaje',
      description:
        'Espacios con acústica cuidada e iluminación íntima de terciopelo. Coctelería de autor premiada y más de 180 referencias en nuestra cava.',
      tag: 'Ambiente Exclusivo',
    },
    {
      icon: Clock,
      title: 'Reserva Digital Inmediata',
      description:
        'Confirmación instantánea en tiempo real sin esperas telefónicas. Selección personalizada de fecha, franja horaria y ubicación de mesa.',
      tag: 'Cero Fricción',
    },
  ];

  const testimonials = [
    {
      quote:
        'Blue Velvet no es solo una cena, es un viaje sensorial donde cada plato desafía los sentidos con un equilibrio milimétrico.',
      author: 'Carlos Valenzuela',
      role: 'Crítico Gastronómico & Sommelier',
      media: 'Guía Gourmet Ibérica',
      rating: 5,
    },
    {
      quote:
        'La armonía entre el diseño del espacio y la audacia de su menú degustación sitúa a Blue Velvet en la cúspide de la alta cocina.',
      author: 'Elena Saint-Laurent',
      role: 'Editora de Alta Gastronomía',
      media: 'Revista Sabor & Vanguardia',
      rating: 5,
    },
    {
      quote:
        'El sistema de reserva es impecable y la bienvenida con maridaje de autor anticipa una velada que difícilmente se olvida.',
      author: 'Marc de la Riva',
      role: 'Chef Invitado Internacional',
      media: 'Crónicas Culinarias',
      rating: 5,
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* ======================================================== */}
      {/* 1. HERO SECTION PERSUASIVA (Mitiga mensaje poco claro y carga lenta) */}
      {/* ======================================================== */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Luces ambientales y texturas de terciopelo azul */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-velvet-blue/20 rounded-full blur-[140px] opacity-70" />
          <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-velvet-gold/10 rounded-full blur-[120px] opacity-50" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          {/* Badge de Categoría & Reconocimiento */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-velvet-800/80 border border-velvet-gold/30 backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-velvet-gold animate-spin-slow" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-velvet-gold-light">
              Gastronomía de Autor & Alta Cocina Sensorial
            </span>
          </div>

          {/* Titular Principal Persuasivo */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.15]">
            Una experiencia culinaria sensorial en{' '}
            <span className="text-gold-gradient block sm:inline">cada bocado</span>
          </h1>

          {/* Subtítulo con Propuesta de Valor Clara */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 font-light leading-relaxed">
            Fusionamos la alta gastronomía contemporánea con una atmósfera íntima inspirada en el
            terciopelo azul profundo. Descubre maridajes galardonados y asegura tu mesa en segundos con
            confirmación en tiempo real.
          </p>

          {/* Botones de Llamada a la Acción (CTA) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/reservas"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-semibold text-velvet-900 bg-gradient-to-r from-velvet-gold via-velvet-gold-light to-velvet-gold shadow-gold-glow hover:scale-105 active:scale-95 transition-all duration-300 text-base"
            >
              <CalendarCheck className="w-5 h-5 text-velvet-900" />
              <span>Reservar Mesa</span>
            </Link>

            <Link
              to="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium text-white bg-velvet-800/80 hover:bg-velvet-800 border border-velvet-gold/30 hover:border-velvet-gold transition-all duration-300 text-base backdrop-blur-sm"
            >
              <UtensilsCrossed className="w-5 h-5 text-velvet-gold" />
              <span>Explorar la Carta</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Micro-indicadores de Confianza */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-velvet-gold" />
              <span>Confirmación 100% Inmediata</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-velvet-gold" />
              <span>Cancelación Flexible sin Coste</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-velvet-gold" />
              <span>Cava con +180 Maridajes</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. PROPUESTA DE VALOR: 3 PILARES (Mitiga mala UX y desinterés) */}
      {/* ======================================================== */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-velvet-gold font-semibold">
            Nuestros Fundamentos
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Tres pilares de excelencia culinaria
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Cada visita a Blue Velvet está orquestada para deleitar los cinco sentidos con rigor y pasión.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="group relative p-8 rounded-2xl velvet-glass hover:velvet-glass-gold transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-velvet-blue/40 border border-velvet-gold/30 flex items-center justify-center text-velvet-gold group-hover:bg-velvet-gold group-hover:text-velvet-900 transition-colors duration-300 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-velvet-gold/80 font-medium px-2.5 py-1 rounded-full bg-white/5">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-velvet-gold-light transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-300 font-light">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-white/5 flex items-center gap-2 text-xs font-semibold text-velvet-gold group-hover:translate-x-1 transition-transform">
                  <span>Conocer más</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. SECCIÓN DE CONFIANZA Y TESTIMONIOS (Mitiga barrera de falta de confianza) */}
      {/* ======================================================== */}
      <section className="relative py-20 bg-gradient-to-b from-transparent via-velvet-800/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Encabezado y Calificación Global */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-velvet-gold mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-velvet-gold text-velvet-gold" />
                ))}
                <span className="text-white font-bold ml-2 text-sm">5.0 / 5.0</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-white">
                Reconocido por críticos y amantes del buen gusto
              </h2>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-300">
              <div className="text-center px-4 py-2 rounded-xl bg-velvet-900/80 border border-white/5">
                <p className="font-serif text-2xl font-bold text-velvet-gold">+12,000</p>
                <p className="text-xs text-slate-400">Comensales en 2026</p>
              </div>
              <div className="text-center px-4 py-2 rounded-xl bg-velvet-900/80 border border-white/5">
                <p className="font-serif text-2xl font-bold text-velvet-gold">99.4%</p>
                <p className="text-xs text-slate-400">Opiniones Positivas</p>
              </div>
            </div>
          </div>

          {/* Tarjetas de Testimonios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl velvet-glass border border-white/10 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <Quote className="w-8 h-8 text-velvet-gold/40" />
                  <p className="text-sm italic text-slate-200 leading-relaxed font-serif">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-sm">{item.author}</h4>
                    <p className="text-xs text-slate-400">{item.role}</p>
                    <p className="text-[11px] text-velvet-gold font-medium mt-0.5">{item.media}</p>
                  </div>
                  <div className="flex text-velvet-gold">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-velvet-gold" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. LLAMADO A LA ACCIÓN FINAL (Banner de Conversión) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-velvet-blue/70 via-velvet-800 to-velvet-900 border border-velvet-gold/40 p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-velvet-gold/15 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-velvet-gold px-3 py-1 rounded-full bg-black/40 border border-velvet-gold/30">
            <Award className="w-3.5 h-3.5" />
            <span>Reserva Exclusiva de Temporada</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white max-w-2xl mx-auto leading-tight">
            Asegura tu velada en Blue Velvet antes de que se agoten los turnos
          </h2>

          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base font-light">
            Las mesas se asignan en riguroso orden de reserva. Confirma en línea tu franja preferida
            y personaliza cualquier preferencia dietética con nuestro sommelier.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/reservas"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-velvet-900 bg-gradient-to-r from-velvet-gold via-velvet-gold-light to-velvet-gold shadow-gold-glow hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Reservar Mesa en Línea
            </Link>
            <Link
              to="/menu"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-white bg-black/40 hover:bg-black/60 border border-white/20 transition-all duration-300"
            >
              Consultar la Carta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
