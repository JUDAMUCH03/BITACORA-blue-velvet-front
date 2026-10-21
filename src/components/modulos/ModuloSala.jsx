import React from 'react';
import {
  Users,
  Send,
  Trash2,
  Clock,
  Sparkles,
  Receipt,
  AlertCircle,
  Wine,
} from 'lucide-react';
import { useBlueVelvet } from '../../context/BlueVelvetContext';
import { ESTADOS_MESA, ESTADOS_PEDIDO } from '../../types/dominio';
import { formatCOP } from '../menu/MenuCard';

export default function ModuloSala({ onIrACarta, onIrALiquidacion }) {
  const {
    mesas,
    mesaSeleccionadaId,
    seleccionarMesa,
    pedidos,
    comandasBorrador,
    removerItemDeComanda,
    enviarComandaABarra,
  } = useBlueVelvet();

  const mesaActiva = mesas.find((m) => m.id === mesaSeleccionadaId) || mesas[0];

  // Comanda confirmada existente en servicio para esta mesa (si está ocupada)
  const comandaEnServicio = pedidos.find(
    (p) =>
      p.idMesa === mesaActiva.id &&
      p.estado !== ESTADOS_PEDIDO.ENTREGADO &&
      p.estado !== ESTADOS_PEDIDO.CANCELADO
  );

  // Borrador pendiente de enviar para esta mesa
  const itemsBorrador = comandasBorrador[mesaActiva.id] || [];

  // Calcular totales
  const totalBorrador = itemsBorrador.reduce(
    (acc, it) => acc + (it.precioCongelado || 0) * (it.cantidad || 1),
    0
  );

  const totalServicio = comandaEnServicio
    ? comandaEnServicio.items.reduce(
        (acc, it) => acc + (it.precioCongelado || 0) * (it.cantidad || 1),
        0
      )
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Encabezado */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-superficie-profunda border border-oro/30 text-oro text-[11px] font-bold uppercase tracking-[0.2em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Plano de Sala & Comandas</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-texto tracking-tight">
          Control de Mesas y Servicio Nocturno
        </h1>
        <p className="text-texto-secundario text-xs sm:text-sm font-light">
          Supervisión en vivo de asignación de sala y gestión de comandas activas con invariante de cuenta única por mesa.
        </p>
      </div>

      {/* Distribución Principal: Plano de Mesas a la Izquierda, Panel de Comanda a la Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* =============================================================== */}
        {/* PLANO DE MESAS EN CUADRÍCULA TÉCNICA AZUL OSCURA (2 COLUMNAS) */}
        {/* =============================================================== */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#09101F]/90 border border-[#202B40] backdrop-blur-xl space-y-6 shadow-2xl relative overflow-hidden">
          {/* Fondo técnico sutil */}
          <div className="absolute inset-0 bg-[radial-gradient(#263247_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />

          {/* Barra física en la parte superior del plano */}
          <div className="space-y-3 relative z-10">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-champan/90">
              Barra Central de Mixología
            </span>
            <div className="p-4 rounded-2xl bg-superficie-profunda/90 border border-borde flex items-center justify-around gap-4">
              {mesas
                .filter((m) => m.zona?.includes('Barra'))
                .map((barraMesa) => {
                  const estaSeleccionada = mesaActiva.id === barraMesa.id;
                  const estaOcupada = barraMesa.estado === ESTADOS_MESA.OCUPADA;

                  return (
                    <button
                      key={barraMesa.id}
                      type="button"
                      onClick={() => seleccionarMesa(barraMesa.id)}
                      className={`flex-1 py-3 px-4 rounded-xl border text-center transition-all ${
                        estaSeleccionada
                          ? 'border-oro bg-oro/15 ring-2 ring-oro/50 text-champan shadow-gold-glow'
                          : estaOcupada
                          ? 'border-oro/40 bg-oro/10 text-champan'
                          : 'border-borde bg-[#0D1525] text-texto-secundario hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold block">{barraMesa.zona}</span>
                      <span className="text-[10px] font-mono mt-0.5 block">
                        {estaOcupada ? 'Comanda Activa' : 'Mesa Libre'}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Mesas del Salón */}
          <div className="space-y-3 relative z-10">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-champan/90">
              Salón Principal & Cava
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mesas
                .filter((m) => !m.zona?.includes('Barra'))
                .map((mesa) => {
                  const estaSeleccionada = mesaActiva.id === mesa.id;
                  const estaOcupada = mesa.estado === ESTADOS_MESA.OCUPADA;

                  return (
                    <button
                      key={mesa.id}
                      type="button"
                      onClick={() => seleccionarMesa(mesa.id)}
                      className={`relative p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[140px] group ${
                        estaSeleccionada
                          ? 'ring-2 ring-oro border-oro bg-gradient-to-b from-oro/20 to-noche shadow-gold-glow scale-[1.02]'
                          : estaOcupada
                          ? 'border-oro/60 bg-gradient-to-b from-oro/10 to-[#0F172A] text-champan'
                          : 'border-borde bg-[#0D1525]/90 text-texto-secundario hover:border-white/30 hover:bg-[#131D30]'
                      }`}
                    >
                      {/* Mesa Circular Decorativa */}
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center font-serif text-lg font-bold border transition-colors shadow-inner ${
                          estaOcupada
                            ? 'bg-oro text-noche border-champan font-bold'
                            : 'bg-superficie border-esmeralda/40 text-esmeralda-claro'
                        }`}
                      >
                        {mesa.numero}
                      </div>

                      <div className="space-y-1 mt-2">
                        <p className="text-xs font-bold text-texto">
                          Mesa {mesa.numero}
                        </p>
                        <p className="text-[10px] text-texto-secundario flex items-center justify-center gap-1">
                          <Users className="w-3 h-3 text-texto-tenue" />
                          <span>Hasta {mesa.capacidad} comensales</span>
                        </p>
                      </div>

                      {/* Indicador de Estado */}
                      <div className="mt-2">
                        {estaOcupada ? (
                          <span className="insignia-dorada text-[9px] py-0.5">
                            Comanda Activa
                          </span>
                        ) : (
                          <span className="insignia-verde text-[9px] py-0.5">
                            Mesa Libre
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Leyenda Técnica */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-borde text-xs text-texto-secundario relative z-10">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-esmeralda" />
                <span>Disponible (Mesa Libre)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-oro" />
                <span>Ocupada (Comanda en curso)</span>
              </span>
            </div>

            <p className="text-[11px] text-texto-tenue italic">
              * Regla de dominio: Única comanda concurrente por mesa
            </p>
          </div>
        </div>

        {/* =============================================================== */}
        {/* PANEL LATERAL DE COMANDA ACTIVA (DRAWER DE SERVICIO) */}
        {/* =============================================================== */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0F172A] border border-oro/30 shadow-2xl space-y-6">
          {/* Encabezado de la Mesa Activa */}
          <div className="flex items-start justify-between pb-4 border-b border-borde">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-oro font-bold">
                Comanda de Servicio
              </span>
              <h2 className="font-serif text-2xl font-bold text-texto mt-0.5">
                Mesa {mesaActiva.numero} {mesaActiva.zona ? `· ${mesaActiva.zona}` : ''}
              </h2>
              <p className="text-xs text-texto-secundario">
                Capacidad: {mesaActiva.capacidad} comensales
              </p>
            </div>

            <div>
              {mesaActiva.estado === ESTADOS_MESA.OCUPADA ? (
                <span className="insignia-dorada">Ocupada</span>
              ) : (
                <span className="insignia-verde">Libre</span>
              )}
            </div>
          </div>

          {/* 1. Comanda que ya está despachada a Barra KDS */}
          {comandaEnServicio && (
            <div className="p-4 rounded-2xl bg-[#091120] border border-azul/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-azul flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Enviada a Barra · #{comandaEnServicio.id}</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-champan bg-oro/10 px-2 py-0.5 rounded-md border border-oro/20">
                  {comandaEnServicio.estado.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2 divide-y divide-white/5">
                {comandaEnServicio.items.map((it, idx) => (
                  <div key={idx} className="pt-2 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-texto">
                      <span>{it.cantidad}x {it.nombrePlato}</span>
                      <span className="text-oro">{formatCOP(it.precioCongelado * it.cantidad)}</span>
                    </div>
                    {it.nombreDestilado && (
                      <p className="text-[11px] text-champan/90">
                        Base: {it.nombreDestilado}
                      </p>
                    )}
                    {it.garnishes && it.garnishes.length > 0 && (
                      <p className="text-[10px] text-texto-tenue">
                        Guarniciones: {it.garnishes.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                <span className="text-texto-secundario">Subtotal en servicio:</span>
                <span className="text-oro font-serif text-sm">{formatCOP(totalServicio)}</span>
              </div>
            </div>
          )}

          {/* 2. Bebidas en Borrador (Pendientes de enviar) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-texto">
                Bebidas por Despachar
              </span>
              <button
                type="button"
                onClick={onIrACarta}
                className="text-xs text-oro hover:text-champan font-bold transition-colors"
              >
                + Explorar carta
              </button>
            </div>

            {itemsBorrador.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#091120] border border-borde/70 text-center space-y-2">
                <Wine className="w-6 h-6 text-texto-tenue mx-auto" />
                <p className="text-xs text-texto-secundario">
                  No hay bebidas añadidas a la comanda pendiente.
                </p>
                <button
                  type="button"
                  onClick={onIrACarta}
                  className="btn-secundario text-xs px-3 py-1.5"
                >
                  Ir a la carta para ordenar
                </button>
              </div>
            ) : (
              <div className="space-y-2 divide-y divide-white/5 bg-[#091120] p-3.5 rounded-2xl border border-borde">
                {itemsBorrador.map((it) => (
                  <div key={it.id} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
                    <div className="space-y-0.5 text-xs">
                      <p className="font-bold text-texto">
                        {it.cantidad}x {it.nombrePlato}
                      </p>
                      {it.nombreDestilado && (
                        <p className="text-[11px] text-champan">Base: {it.nombreDestilado}</p>
                      )}
                      {it.garnishes && it.garnishes.length > 0 && (
                        <p className="text-[10px] text-texto-tenue">
                          {it.garnishes.join(' · ')}
                        </p>
                      )}
                      <p className="font-serif font-bold text-oro">
                        {formatCOP(it.precioCongelado * it.cantidad)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removerItemDeComanda(mesaActiva.id, it.id)}
                      className="p-1 text-texto-tenue hover:text-carmesi transition-colors"
                      title="Eliminar bebida"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                  <span className="text-texto-secundario">Total borrador:</span>
                  <span className="text-oro font-serif text-base">{formatCOP(totalBorrador)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Acciones Principales de Comanda */}
          <div className="space-y-2.5 pt-2 border-t border-borde">
            {itemsBorrador.length > 0 && (
              <button
                type="button"
                onClick={() => enviarComandaABarra(mesaActiva.id)}
                className="w-full btn-primario gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar a barra</span>
              </button>
            )}

            {mesaActiva.estado === ESTADOS_MESA.OCUPADA && (
              <button
                type="button"
                onClick={onIrALiquidacion}
                className="w-full btn-secundario gap-2 text-xs"
              >
                <Receipt className="w-4 h-4 text-oro" />
                <span>Proceder a liquidación de cuenta</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
