import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  Lock,
  ArrowRight,
  CheckCircle,
  XCircle,
  Sparkles,
  Edit3,
  X,
  AlertTriangle,
  GlassWater,
} from 'lucide-react';
import { useBlueVelvet } from '../../context/BlueVelvetContext';
import { ESTADOS_PEDIDO, DESTILADOS_BASE_CATALOGO } from '../../types/dominio';
import { formatCOP } from '../menu/MenuCard';

const COLUMNAS_KDS = [
  {
    id: ESTADOS_PEDIDO.RECIBIDO,
    nombre: 'Recibido',
    colorBorde: 'border-azul',
    colorTexto: 'text-azul',
    colorFondo: 'bg-azul/10',
    descripcion: 'Comandas recién despachadas desde sala',
  },
  {
    id: ESTADOS_PEDIDO.EN_PREPARACION,
    nombre: 'En preparación',
    colorBorde: 'border-ambar',
    colorTexto: 'text-ambar',
    colorFondo: 'bg-ambar/10',
    descripcion: 'Preparación en curso · Inmutable (HTTP 422)',
  },
  {
    id: ESTADOS_PEDIDO.LISTO,
    nombre: 'Listo',
    colorBorde: 'border-esmeralda',
    colorTexto: 'text-esmeralda',
    colorFondo: 'bg-esmeralda/10',
    descripcion: 'Listos para retiro y servicio en sala',
  },
  {
    id: ESTADOS_PEDIDO.ENTREGADO,
    nombre: 'Entregado',
    colorBorde: 'border-texto-tenue',
    colorTexto: 'text-texto-tenue',
    colorFondo: 'bg-texto-tenue/10',
    descripcion: 'Servicio en mesa completado',
  },
];

/**
 * Temporizador dinámico en vivo para comandas en barra
 */
function CronometroComanda({ timestamp }) {
  const [minutos, setMinutos] = useState(0);

  useEffect(() => {
    const calcular = () => {
      const inicio = new Date(timestamp).getTime();
      const actual = Date.now();
      const difMin = Math.max(0, Math.floor((actual - inicio) / 60000));
      setMinutos(difMin);
    };

    calcular();
    const interval = setInterval(calcular, 10000);
    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <span
      className={`font-mono text-xs font-bold flex items-center gap-1 ${
        minutos > 15 ? 'text-carmesi animate-pulse' : minutos > 8 ? 'text-ambar' : 'text-texto-secundario'
      }`}
    >
      <Clock className="w-3.5 h-3.5" />
      <span>{minutos} min</span>
    </span>
  );
}

export default function ModuloBarra() {
  const {
    pedidos,
    avanzarEstadoPedido,
    mutarDestiladoBase,
    cancelarComanda,
  } = useBlueVelvet();

  // Modal para mutar destilado
  const [itemAMutar, setItemAMutar] = useState(null);

  const abrirModalMutarDestilado = (pedidoId, item) => {
    setItemAMutar({
      pedidoId,
      itemId: item.id,
      nombrePlato: item.nombrePlato,
      destiladoActual: item.nombreDestilado,
      destiladoSeleccionadoId: item.spiritBrandId || DESTILADOS_BASE_CATALOGO[0].id,
    });
  };

  const confirmarMutacionDestilado = () => {
    if (!itemAMutar) return;
    mutarDestiladoBase(
      itemAMutar.pedidoId,
      itemAMutar.itemId,
      itemAMutar.destiladoSeleccionadoId
    );
    setItemAMutar(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-superficie-profunda border border-oro/30 text-oro text-[11px] font-bold uppercase tracking-[0.2em]">
            <Flame className="w-3.5 h-3.5" />
            <span>Sistema KDS de Barra</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-texto tracking-tight">
            Barra en Vivo & Kitchen Display
          </h1>

          <p className="text-texto-secundario text-xs sm:text-sm font-light">
            Tablero horizontal Kanban con flujo estrictamente unidireccional y candado de inmutabilidad en preparación.
          </p>
        </div>

        {/* Resumen de Carga */}
        <div className="p-3 px-5 rounded-2xl bg-superficie-profunda border border-borde text-right shrink-0">
          <span className="text-[10px] text-texto-secundario uppercase font-bold tracking-wider block">
            Comandas en Curso
          </span>
          <span className="font-serif text-2xl font-bold text-oro">
            {pedidos.filter((p) => p.estado !== ESTADOS_PEDIDO.ENTREGADO).length}
          </span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* TABLERO HORIZONTAL KANBAN DE 4 COLUMNAS */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {COLUMNAS_KDS.map((col) => {
          const pedidosColumna = pedidos.filter((p) => p.estado === col.id);

          return (
            <div
              key={col.id}
              className="rounded-3xl bg-[#09101F]/90 border border-borde p-4 sm:p-5 space-y-4 shadow-xl flex flex-col min-h-[580px]"
            >
              {/* Cabecera de Columna */}
              <div className="flex items-center justify-between pb-3 border-b border-borde">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${col.colorBorde} bg-current`} />
                  <h2 className={`font-serif text-base font-bold ${col.colorTexto}`}>
                    {col.nombre}
                  </h2>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${col.colorFondo} ${col.colorTexto}`}>
                  {pedidosColumna.length}
                </span>
              </div>

              {/* Subtítulo de Columna */}
              <p className="text-[11px] text-texto-tenue font-light -mt-2">
                {col.descripcion}
              </p>

              {/* Tarjetas de Comanda en la Columna */}
              <div className="space-y-4 flex-grow overflow-y-auto max-h-[680px] pr-1">
                {pedidosColumna.length === 0 ? (
                  <div className="h-44 rounded-2xl border border-dashed border-borde flex items-center justify-center text-xs text-texto-tenue text-center p-4">
                    Sin comandas en este estado
                  </div>
                ) : (
                  pedidosColumna.map((comanda) => {
                    const esRecibido = comanda.estado === ESTADOS_PEDIDO.RECIBIDO;
                    const esEnPreparacion = comanda.estado === ESTADOS_PEDIDO.EN_PREPARACION;
                    const esListo = comanda.estado === ESTADOS_PEDIDO.LISTO;
                    const esEntregado = comanda.estado === ESTADOS_PEDIDO.ENTREGADO;

                    return (
                      <div
                        key={comanda.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 bg-[#0D1525] shadow-md ${
                          esEnPreparacion
                            ? 'border-ambar/50 ring-1 ring-ambar/30 shadow-ambar/10'
                            : esRecibido
                            ? 'border-azul/40'
                            : esListo
                            ? 'border-esmeralda/40'
                            : 'border-borde/50 opacity-75'
                        }`}
                      >
                        {/* Cabecera de la Tarjeta de Comanda */}
                        <div className="flex items-start justify-between pb-2 border-b border-white/5">
                          <div>
                            <span className="font-mono text-[11px] font-bold text-champan block">
                              Comanda #{comanda.id}
                            </span>
                            <span className="font-serif text-base font-bold text-texto">
                              Mesa {comanda.numeroMesa}
                            </span>
                          </div>

                          <CronometroComanda timestamp={comanda.timestamp} />
                        </div>

                        {/* ================================================= */}
                        {/* INVARIANTE CRÍTICA: CANDADO EN PREPARACIÓN */}
                        {/* ================================================= */}
                        {esEnPreparacion && (
                          <div className="p-2.5 rounded-xl bg-ambar/10 border border-ambar/30 text-amber-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                            <Lock className="w-3.5 h-3.5 text-ambar shrink-0" />
                            <span>Bebida inmutable · En preparación · Código HTTP 422</span>
                          </div>
                        )}

                        {/* Lista de Cócteles */}
                        <div className="space-y-2.5 divide-y divide-white/5">
                          {comanda.items.map((it) => (
                            <div key={it.id} className="pt-2 first:pt-0 space-y-1 text-xs">
                              <div className="flex items-center justify-between font-bold text-texto">
                                <span>{it.cantidad}x {it.nombrePlato}</span>
                                <span className="text-oro font-serif">
                                  {formatCOP(it.precioCongelado * it.cantidad)}
                                </span>
                              </div>

                              {it.nombreDestilado && (
                                <p className="text-[11px] text-champan font-medium">
                                  Destilado: {it.nombreDestilado}
                                </p>
                              )}

                              {it.garnishes && it.garnishes.length > 0 && (
                                <p className="text-[10px] text-texto-secundario">
                                  Guarniciones: {it.garnishes.join(' · ')}
                                </p>
                              )}

                              {/* Modificar destilado base (Solo en RECIBIDO y máx 1 vez) */}
                              {esRecibido && it.nombreDestilado && (
                                <div className="pt-1">
                                  {it.spiritModificationsCount < 1 ? (
                                    <button
                                      type="button"
                                      onClick={() => abrirModalMutarDestilado(comanda.id, it)}
                                      className="text-[10px] text-oro hover:text-champan underline flex items-center gap-1 font-semibold"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      <span>Modificar destilado base (1 restante)</span>
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-texto-tenue italic">
                                      Modificación de destilado agotada
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Acciones Operativas Específicas por Columna */}
                        <div className="pt-2 border-t border-white/5 space-y-2">
                          {esRecibido && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => avanzarEstadoPedido(comanda.id)}
                                className="flex-1 btn-primario text-xs py-2 gap-1.5"
                              >
                                <span>Iniciar preparación</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => cancelarComanda(comanda.id)}
                                className="btn-destructivo text-xs px-2.5 py-2"
                                title="Cancelar comanda"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {esEnPreparacion && (
                            <button
                              type="button"
                              onClick={() => avanzarEstadoPedido(comanda.id)}
                              className="w-full btn-primario text-xs py-2 gap-1.5"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Marcar listo</span>
                            </button>
                          )}

                          {esListo && (
                            <button
                              type="button"
                              onClick={() => avanzarEstadoPedido(comanda.id)}
                              className="w-full btn-primario text-xs py-2 gap-1.5 bg-gradient-to-r from-esmeralda to-esmeralda-claro text-noche"
                            >
                              <GlassWater className="w-4 h-4" />
                              <span>Entregar a sala</span>
                            </button>
                          )}

                          {esEntregado && (
                            <div className="p-2.5 rounded-xl bg-esmeralda/10 border border-esmeralda/30 text-esmeralda-claro text-center text-xs font-bold flex items-center justify-center gap-1.5">
                              <CheckCircle className="w-4 h-4 text-esmeralda" />
                              <span>Entregado a sala</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================================================= */}
      {/* MODAL PARA MODIFICAR DESTILADO BASE (EN ESTADO RECIBIDO) */}
      {/* ================================================================= */}
      {itemAMutar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-[#111A2B] border border-[#354158] p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between pb-2 border-b border-borde">
              <div>
                <span className="text-[10px] text-oro uppercase font-bold tracking-wider">
                  Mutación Permitida · Comanda #{itemAMutar.pedidoId}
                </span>
                <h3 className="font-serif text-lg font-bold text-texto">
                  Modificar Destilado Base
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setItemAMutar(null)}
                className="text-texto-tenue hover:text-texto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-texto-secundario">
              Bebida: <strong className="text-texto">{itemAMutar.nombrePlato}</strong>
              <br />
              Destilado actual: <span className="text-champan">{itemAMutar.destiladoActual}</span>
            </p>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-texto-secundario font-bold">
                Nuevo Destilado Base
              </label>
              <select
                value={itemAMutar.destiladoSeleccionadoId}
                onChange={(e) =>
                  setItemAMutar({
                    ...itemAMutar,
                    destiladoSeleccionadoId: Number(e.target.value),
                  })
                }
                className="w-full bg-[#0D1525] border border-borde rounded-xl px-4 py-3 text-xs text-texto focus:outline-none focus:border-oro"
              >
                {DESTILADOS_BASE_CATALOGO.map((dest) => (
                  <option key={dest.id} value={dest.id} className="bg-noche text-texto">
                    {dest.nombre} ({dest.origen})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 border-t border-borde flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setItemAMutar(null)}
                className="btn-secundario text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarMutacionDestilado}
                className="btn-primario text-xs"
              >
                Confirmar mutación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
