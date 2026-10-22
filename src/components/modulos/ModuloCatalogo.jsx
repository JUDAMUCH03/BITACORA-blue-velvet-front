import React, { useState } from 'react';
import {
  Wine,
  Shield,
  Plus,
  Clock,
  Check,
  X,
  AlertCircle,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Lock,
} from 'lucide-react';
import { useBlueVelvet } from '../../context/BlueVelvetContext';
import { CATEGORIAS_BEBIDA, ROLES_USUARIO } from '../../types/dominio';
import { formatCOP } from '../menu/MenuCard';

export default function ModuloCatalogo() {
  const {
    platos,
    toggleDisponibilidadPlato,
    crearPlato,
    eventosAuditoria,
    rolActivo,
  } = useBlueVelvet();

  const [mostrarModalCreacion, setMostrarModalCreacion] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState(CATEGORIAS_BEBIDA.COCTEL_AUTOR);
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [nuevaGraduacion, setNuevaGraduacion] = useState('25');
  const [errorModal, setErrorModal] = useState('');

  const esMesero = rolActivo === 'ROLE_MESERO';
  const puedeCrear = rolActivo === 'ROLE_ADMIN' || rolActivo === 'ROLE_CHEF';

  const handleCrearSubmit = async (e) => {
    e.preventDefault();
    setErrorModal('');

    if (!nuevoNombre.trim()) {
      setErrorModal('El nombre de la creación botánica es mandatorio.');
      return;
    }

    const exito = await crearPlato({
      nombre: nuevoNombre,
      categoria: nuevaCategoria,
      precio: nuevoPrecio,
      descripcion: nuevaDescripcion,
      graduacionAlcoholica: nuevaGraduacion,
    });

    if (exito) {
      setNuevoNombre('');
      setNuevoPrecio('');
      setNuevaDescripcion('');
      setMostrarModalCreacion(false);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-superficie-profunda border border-oro/30 text-oro text-[11px] font-bold uppercase tracking-[0.2em]">
            <Wine className="w-3.5 h-3.5" />
            <span>Gestión de Carta & Trazabilidad NoSQL</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-texto tracking-tight">
            Catálogo Maestro y Auditoría
          </h1>

          <p className="text-texto-secundario text-xs sm:text-sm font-light">
            Control de disponibilidad de recetas en tiempo real y registro cronológico inmutable de eventos.
          </p>
        </div>

        {/* Botón de Creación */}
        <div>
          {puedeCrear ? (
            <button
              type="button"
              onClick={() => {
                setErrorModal('');
                setMostrarModalCreacion(true);
              }}
              className="btn-primario gap-2 text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Crear nuevo cóctel</span>
            </button>
          ) : (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-superficie-profunda border border-borde text-texto-tenue text-xs cursor-not-allowed"
              title="Tu rol actual no dispone de permisos para crear formulaciones"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Creación restringida a Admin/Chef</span>
            </div>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* BARRA DE PERMISOS RBAC ACTIVA */}
      {/* ================================================================= */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#0A1020] border border-borde flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-oro/15 border border-oro/40 flex items-center justify-center text-oro">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-texto">
              Perfil Activo: <span className="text-champan">{ROLES_USUARIO[rolActivo]?.nombre}</span> ({rolActivo})
            </p>
            <p className="text-[11px] text-texto-secundario">
              {ROLES_USUARIO[rolActivo]?.descripcion}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-texto-tenue">Permisos vigentes:</span>
          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
            puedeCrear ? 'bg-esmeralda/20 text-esmeralda-claro border border-esmeralda/30' : 'bg-white/5 text-texto-secundario'
          }`}>
            {puedeCrear ? 'Creación de Recetas' : 'Solo Lectura de Creación'}
          </span>
          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
            !esMesero ? 'bg-esmeralda/20 text-esmeralda-claro border border-esmeralda/30' : 'bg-carmesi/20 text-carmesi-claro border border-carmesi/30'
          }`}>
            {!esMesero ? 'Mutación de Stock' : 'Stock Bloqueado'}
          </span>
        </div>
      </div>

      {/* Distribución: Tabla de Catálogo (2 cols) y Feed de Auditoría (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* =============================================================== */}
        {/* TABLA DEL CATÁLOGO MAESTRO */}
        {/* =============================================================== */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#09101F] border border-borde space-y-4 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-borde">
            <h2 className="font-serif text-lg font-bold text-texto">
              Recetas y Stock en Barra ({platos.length} creaciones)
            </h2>
            <span className="text-[11px] text-texto-tenue italic">
              * Cambios sincronizados inmediatamente con el servicio
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-borde text-texto-secundario font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Producto</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3">Precio</th>
                  <th className="py-3 px-3 text-right">Estado de Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {platos.map((plato) => {
                  return (
                    <tr
                      key={plato.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={plato.imagenUrl || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80'}
                            alt={plato.nombre}
                            className="w-9 h-9 rounded-lg object-cover border border-borde shrink-0"
                          />
                          <div>
                            <p className="font-bold text-texto">{plato.nombre}</p>
                            <p className="text-[10px] text-texto-tenue font-mono">
                              {plato.graduacionAlcoholica > 0 ? `${plato.graduacionAlcoholica}% ABV` : '0.0% ABV'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-[10px] uppercase font-bold text-champan bg-oro/10 px-2 py-0.5 rounded-md border border-oro/20">
                          {plato.categoria.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-serif font-bold text-texto text-sm">
                        {formatCOP(plato.precio)}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {plato.disponible ? (
                            <span className="insignia-verde text-[9px] py-0.5">
                              Disponible
                            </span>
                          ) : (
                            <span className="insignia-carmesi text-[9px] py-0.5">
                              Agotado en barra
                            </span>
                          )}

                          {/* Switch de Disponibilidad */}
                          <button
                            type="button"
                            disabled={esMesero}
                            onClick={() => toggleDisponibilidadPlato(plato.id)}
                            className={`p-1 transition-colors ${
                              esMesero
                                ? 'opacity-30 cursor-not-allowed'
                                : 'hover:scale-110 active:scale-95'
                            }`}
                            title={
                              esMesero
                                ? 'El rol Mesero no cuenta con permisos para mutar disponibilidad'
                                : 'Alternar disponibilidad en tiempo real'
                            }
                            aria-label={`Alternar stock de ${plato.nombre}`}
                          >
                            {plato.disponible ? (
                              <ToggleRight className="w-6 h-6 text-esmeralda" />
                            ) : (
                              <ToggleLeft className="w-6 h-6 text-carmesi" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* =============================================================== */}
        {/* FEED DE AUDITORÍA EN VIVO (ESPEJO MONGODB eventos_restaurante) */}
        {/* =============================================================== */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-borde space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-borde">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-oro animate-pulse" />
              <h2 className="font-serif text-base font-bold text-texto">
                Trazabilidad en Vivo
              </h2>
            </div>
            <span className="text-[10px] text-champan font-mono uppercase tracking-wider">
              MongoDB Log
            </span>
          </div>

          <p className="text-[11px] text-texto-secundario font-light">
            Espejo de eventos operativos inmutables registrados durante el servicio nocturno.
          </p>

          {/* Línea de Tiempo Cronológica Vertical */}
          <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1 pt-2">
            {eventosAuditoria.map((evt, idx) => (
              <div key={evt.id || idx} className="relative pl-6 pb-2 border-l border-borde/70 last:border-transparent space-y-1 text-xs">
                {/* Punto Cronológico */}
                <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-oro border-2 border-noche shadow-sm" />

                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-champan uppercase tracking-wider font-mono">
                    {evt.tipoEvento}
                  </span>
                  <span className="text-texto-tenue font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{evt.fecha}</span>
                  </span>
                </div>

                <p className="text-texto font-medium leading-snug">
                  {evt.detalles}
                </p>

                <p className="text-[10px] text-texto-tenue">
                  Operador: <span className="text-texto-secundario">{evt.usuario}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* MODAL DE CREACIÓN DE CÓCTEL (VALIDACIONES JAKARTA DEL BACKEND) */}
      {/* ================================================================= */}
      {mostrarModalCreacion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-[560px] rounded-2xl bg-[#111A2B] border border-[#354158] p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-borde">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-oro font-bold">
                  Formulación de Autor
                </span>
                <h3 className="font-serif text-xl font-bold text-texto">
                  Crear Nueva Creación en Carta
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMostrarModalCreacion(false)}
                className="text-texto-tenue hover:text-texto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorModal && (
              <div className="p-3 rounded-xl bg-carmesi/10 border border-carmesi/30 text-carmesi-claro text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorModal}</span>
              </div>
            )}

            <form onSubmit={handleCrearSubmit} className="space-y-4">
              {/* Nombre */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-texto-secundario font-bold">
                  Nombre del Cóctel *
                </label>
                <input
                  type="text"
                  required
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder="Ej: Velvet Eclipse Smoked"
                  className="w-full bg-[#0D1525] border border-borde rounded-xl px-4 py-2.5 text-xs text-texto focus:outline-none focus:border-oro"
                />
              </div>

              {/* Categoría y Precio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-texto-secundario font-bold">
                    Categoría *
                  </label>
                  <select
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    className="w-full bg-[#0D1525] border border-borde rounded-xl px-4 py-2.5 text-xs text-texto focus:outline-none focus:border-oro"
                  >
                    <option value={CATEGORIAS_BEBIDA.COCTEL_AUTOR}>Firmas de Autor (COCTEL_AUTOR)</option>
                    <option value={CATEGORIAS_BEBIDA.DESTILADO_PREMIUM}>Destilados Premium (DESTILADO_PREMIUM)</option>
                    <option value={CATEGORIAS_BEBIDA.MOCKTAIL}>Mocktails 0.0% (MOCKTAIL)</option>
                    <option value={CATEGORIAS_BEBIDA.BOTANICO}>Mixología Botánica (BOTANICO)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-texto-secundario font-bold">
                    Precio ($COP) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="1000"
                    value={nuevoPrecio}
                    onChange={(e) => setNuevoPrecio(e.target.value)}
                    placeholder="45000"
                    className="w-full bg-[#0D1525] border border-borde rounded-xl px-4 py-2.5 text-xs text-texto focus:outline-none focus:border-oro"
                  />
                </div>
              </div>

              {/* Graduación */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-texto-secundario font-bold">
                  Graduación Alcohólica (% ABV)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={nuevaGraduacion}
                  onChange={(e) => setNuevaGraduacion(e.target.value)}
                  className="w-full bg-[#0D1525] border border-borde rounded-xl px-4 py-2.5 text-xs text-texto focus:outline-none focus:border-oro"
                />
              </div>

              {/* Descripción Sensorial */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-texto-secundario font-bold">
                  Notas Botánicas y Perfil Sensorial *
                </label>
                <textarea
                  rows="3"
                  required
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                  placeholder="Notas de corteza de canela ahumada, reducción de moras silvestres y final persistente en boca..."
                  className="w-full bg-[#0D1525] border border-borde rounded-xl px-4 py-2.5 text-xs text-texto focus:outline-none focus:border-oro"
                />
              </div>

              {/* Acciones */}
              <div className="pt-3 border-t border-borde flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMostrarModalCreacion(false)}
                  className="btn-secundario text-xs"
                >
                  Cancelar formulario
                </button>
                <button type="submit" className="btn-primario text-xs">
                  Guardar en catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
