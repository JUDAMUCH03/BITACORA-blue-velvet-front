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
  Lock,
  Trash2,
  Loader2,
} from 'lucide-react';
import { useBlueVelvet } from '../../context/BlueVelvetContext';
import { CATEGORIAS_BEBIDA, ROLES_USUARIO } from '../../types/dominio';
import { formatCOP } from '../menu/MenuCard';

/**
 * Formatea un evento de la bitácora operativa para presentación al personal.
 */
function formatearMomento(evt) {
  const bruto = evt.timestamp || evt.fecha;
  if (!bruto) return '';
  const fecha = new Date(bruto);
  if (Number.isNaN(fecha.getTime())) return String(bruto);
  return fecha.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
}

export default function ModuloCatalogo() {
  const {
    platos,
    toggleDisponibilidadPlato,
    platosPendientes,
    crearPlato,
    eliminarPlato,
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
  const [guardando, setGuardando] = useState(false);

  const esMesero = rolActivo === 'ROLE_MESERO';
  const puedeCrear =
    !rolActivo ||
    rolActivo.includes('ADMIN') ||
    rolActivo.includes('CHEF') ||
    rolActivo === 'ROLE_ADMIN' ||
    rolActivo === 'ROLE_CHEF';

  const handleCrearSubmit = async (e) => {
    e.preventDefault();
    if (guardando) return; // evita doble envío mientras la petición está en vuelo
    setErrorModal('');

    if (!nuevoNombre.trim()) {
      setErrorModal('El nombre de la creación botánica es mandatorio.');
      return;
    }

    setGuardando(true);

    const exito = await crearPlato({
      nombre: nuevoNombre,
      categoria: nuevaCategoria,
      precio: nuevoPrecio,
      descripcion: nuevaDescripcion,
      graduacionAlcoholica: nuevaGraduacion,
    }).finally(() => setGuardando(false));

    if (exito) {
      setNuevoNombre('');
      setNuevoPrecio('');
      setNuevaDescripcion('');
      setMostrarModalCreacion(false);
    } else {
      setErrorModal('El cóctel no pudo registrarse. Revisa el aviso en pantalla para conocer el motivo.');
    }
  };

  const handleEliminar = async (plato) => {
    const confirmacion = window.confirm(
      `¿Confirmas que deseas retirar permanentemente el cóctel "${plato.nombre}" de la carta?`
    );
    if (!confirmacion) return;
    await eliminarPlato(plato.id);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-superficie-profunda border border-oro/30 text-oro text-[11px] font-bold uppercase tracking-[0.2em]">
            <Wine className="w-3.5 h-3.5" />
            <span>Carta de Coctelería & Destilados de Autor</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-texto tracking-tight">
            Catálogo Maestro y Bitácora
          </h1>

          <p className="text-texto-secundario text-xs sm:text-sm font-light">
            Control de disponibilidad de recetas en tiempo real y bitácora cronológica de sucesos del servicio.
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
      {/* BARRA DE PERFIL ACTIVO */}
      {/* ================================================================= */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#0A1020] border border-borde flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-oro/15 border border-oro/40 flex items-center justify-center text-oro">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-texto">
              Perfil Activo: <span className="text-champan">{ROLES_USUARIO[rolActivo]?.nombre}</span>
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
                  <th className="py-3 px-3 text-center">Estado de Stock</th>
                  <th className="py-3 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {platos.map((plato) => {
                  const pendiente = platosPendientes.includes(plato.id);
                  return (
                    <tr
                      key={plato.id}
                      className={`hover:bg-white/[0.02] transition-all duration-500 ${
                        plato.disponible ? 'opacity-100' : 'opacity-60'
                      } ${pendiente ? 'animate-pulse' : ''}`}
                    >
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={plato.imagenUrl || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80'}
                            alt={plato.nombre}
                            className={`w-9 h-9 rounded-lg object-cover border border-borde shrink-0 transition-all duration-500 ${
                              plato.disponible ? 'scale-100' : 'grayscale scale-90'
                            }`}
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

                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className={`${
                              plato.disponible ? 'insignia-verde' : 'insignia-carmesi'
                            } text-[9px] py-0.5 transition-all duration-300`}
                          >
                            {plato.disponible ? 'Disponible' : 'Agotado'}
                          </span>

                          {/* Interruptor de Disponibilidad */}
                          <button
                            type="button"
                            role="switch"
                            aria-checked={Boolean(plato.disponible)}
                            disabled={esMesero || pendiente}
                            onClick={() => toggleDisponibilidadPlato(plato.id)}
                            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-all duration-300 focus:outline-none ${
                              plato.disponible
                                ? 'bg-esmeralda/70 border-esmeralda/60'
                                : 'bg-carmesi/60 border-carmesi/50'
                            } ${
                              esMesero
                                ? 'opacity-30 cursor-not-allowed'
                                : pendiente
                                ? 'cursor-wait scale-95'
                                : 'hover:scale-105 active:scale-95'
                            }`}
                            title={
                              esMesero
                                ? 'El rol Mesero no cuenta con permisos para modificar la disponibilidad'
                                : plato.disponible
                                ? 'Marcar como agotado en barra'
                                : 'Marcar como disponible'
                            }
                            aria-label={`Alternar disponibilidad de ${plato.nombre}`}
                          >
                            <span
                              className={`inline-flex h-4 w-4 items-center justify-center rounded-full bg-white shadow transition-transform duration-300 ${
                                plato.disponible ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            >
                              {pendiente && <Loader2 className="w-3 h-3 animate-spin text-noche" />}
                            </span>
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        {puedeCrear && (
                          <button
                            type="button"
                            onClick={() => handleEliminar(plato)}
                            className="p-1.5 rounded-lg text-texto-tenue hover:text-carmesi hover:bg-carmesi/10 transition-colors"
                            title={`Retirar "${plato.nombre}" de la carta`}
                            aria-label={`Retirar ${plato.nombre}`}
                          >
                            <Trash2 className="w-4 h-4 text-carmesi/70 hover:text-carmesi" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* =============================================================== */}
        {/* FEED DE LA BITÁCORA DE SUCESOS OPERATIVOS */}
        {/* =============================================================== */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-borde space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-borde">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-oro animate-pulse" />
              <h2 className="font-serif text-base font-bold text-texto">
                Bitácora de Sucesos Operativos
              </h2>
            </div>
            <span className="text-[10px] text-champan font-mono uppercase tracking-wider">
              En vivo
            </span>
          </div>

          <p className="text-[11px] text-texto-secundario font-light">
            Registro cronológico de los sucesos del servicio nocturno.
          </p>

          {/* Línea de Tiempo Cronológica Vertical */}
          <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1 pt-2">
            {eventosAuditoria.map((evt, idx) => (
              <div key={evt.id || idx} className="relative pl-6 pb-2 border-l border-borde/70 last:border-transparent space-y-1 text-xs">
                {/* Punto Cronológico */}
                <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-oro border-2 border-noche shadow-sm" />

                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-champan uppercase tracking-wider font-mono">
                    {String(evt.tipoEvento || evt.tipo || '').replace(/_/g, ' ')}
                  </span>
                  <span className="text-texto-tenue font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatearMomento(evt)}</span>
                  </span>
                </div>

                <p className="text-texto font-medium leading-snug">
                  {evt.detalle || evt.detalles || evt.descripcion}
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
                  minLength={2}
                  maxLength={100}
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
                    <option value={CATEGORIAS_BEBIDA.COCTEL_AUTOR}>Firmas de Autor</option>
                    <option value={CATEGORIAS_BEBIDA.DESTILADO_PREMIUM}>Destilados Premium</option>
                    <option value={CATEGORIAS_BEBIDA.MOCKTAIL}>Mocktails 0.0%</option>
                    <option value={CATEGORIAS_BEBIDA.BOTANICO}>Mixología Botánica</option>
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
                  maxLength={255}
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
                <button type="submit" disabled={guardando} className="btn-primario text-xs disabled:opacity-60 disabled:cursor-wait">
                  {guardando ? 'Guardando en catálogo...' : 'Guardar en catálogo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
