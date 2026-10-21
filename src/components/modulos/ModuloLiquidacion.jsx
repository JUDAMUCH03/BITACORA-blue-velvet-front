import React, { useState } from 'react';
import {
  ReceiptText,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  LayoutGrid,
} from 'lucide-react';
import { useBlueVelvet } from '../../context/BlueVelvetContext';
import { ESTADOS_MESA } from '../../types/dominio';
import { formatCOP } from '../menu/MenuCard';
import LogoBlueVelvet from '../common/LogoBlueVelvet';

const PORCENTAJES_PROPINA = [0, 10, 15, 20];

export default function ModuloLiquidacion({ onVerPlanoSala }) {
  const { mesas, liquidarCuenta, pedidos, comandasBorrador } = useBlueVelvet();

  // Filtrar mesas ocupadas o con consumo
  const mesasConServicio = mesas.filter((m) => m.estado === ESTADOS_MESA.OCUPADA);

  const [mesaSeleccionadaId, setMesaSeleccionadaId] = useState(
    mesasConServicio.length > 0 ? mesasConServicio[0].id : (mesas[0]?.id || 1)
  );

  const [porcentajePropina, setPorcentajePropina] = useState(10);
  const [reciboLiquidado, setReciboLiquidado] = useState(null);

  const mesaActual = mesas.find((m) => m.id === mesaSeleccionadaId) || mesas[0];

  // Comanda activa en KDS o borrador
  const pedidoActivo = pedidos.find(
    (p) => p.idMesa === mesaActual.id && p.estado !== 'CANCELADO'
  );

  const itemsMesa = pedidoActivo
    ? pedidoActivo.items
    : comandasBorrador[mesaActual.id] || [];

  const subtotalNeto = itemsMesa.reduce(
    (acc, it) => acc + (it.precioCongelado || 0) * (it.cantidad || 1),
    0
  );

  const valorPropina = Math.round(subtotalNeto * (porcentajePropina / 100));
  const totalGeneral = subtotalNeto + valorPropina;

  const handleConfirmarLiquidacion = () => {
    const resultado = liquidarCuenta(mesaActual.id, porcentajePropina);
    if (resultado) {
      setReciboLiquidado(resultado);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Encabezado */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-superficie-profunda border border-oro/30 text-oro text-[11px] font-bold uppercase tracking-[0.2em]">
          <ReceiptText className="w-3.5 h-3.5" />
          <span>Cierre de Cuenta & Facturación</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-texto tracking-tight">
          Liquidación de Servicio
        </h1>

        <p className="text-texto-secundario text-xs sm:text-sm font-light max-w-md mx-auto">
          Recibo de estilo editorial para cobro de comandas y liberación atómica de mesas físicas.
        </p>
      </div>

      {/* ================================================================= */}
      {/* PANTALLA DE ÉXITO TRAS LIQUIDACIÓN ATÓMICA */}
      {/* ================================================================= */}
      {reciboLiquidado ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0E172A] border border-esmeralda/40 text-center space-y-6 shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-esmeralda/20 border border-esmeralda flex items-center justify-center text-esmeralda mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] text-esmeralda-claro font-bold">
              Cuenta Liquidada con Éxito
            </span>
            <h2 className="font-serif text-3xl font-bold text-texto">
              Mesa {reciboLiquidado.mesaNumero} liberada para el servicio
            </h2>
            <p className="text-xs text-texto-secundario">
              El pago por {formatCOP(reciboLiquidado.totalFinal)} ha sido conciliado en el registro contable.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onVerPlanoSala}
              className="w-full sm:w-auto btn-primario gap-2"
            >
              <LayoutGrid className="w-4 h-4 text-noche" />
              <span>Ver plano de sala</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setReciboLiquidado(null);
                const otraMesa = mesas.find((m) => m.estado === ESTADOS_MESA.OCUPADA);
                if (otraMesa) setMesaSeleccionadaId(otraMesa.id);
              }}
              className="w-full sm:w-auto btn-secundario"
            >
              Liquidar otra mesa
            </button>
          </div>
        </div>
      ) : (
        /* ================================================================= */
        /* SELECTOR DE MESA Y RECIBO EDITORIAL */
        /* ================================================================= */
        <div className="space-y-6">
          {/* Selector de Mesa a Liquidar */}
          <div className="p-5 rounded-2xl bg-[#09101F] border border-borde space-y-3">
            <label className="text-xs uppercase tracking-wider text-texto-secundario font-bold flex items-center justify-between">
              <span>Selecciona la Mesa a Liquidar</span>
              <span className="text-champan font-mono">
                {mesasConServicio.length} mesas ocupadas actualmente
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {mesas.map((m) => {
                const esOcupada = m.estado === ESTADOS_MESA.OCUPADA;
                const esSeleccionada = mesaActual.id === m.id;

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMesaSeleccionadaId(m.id)}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1 ${
                      esSeleccionada
                        ? 'border-oro bg-oro/15 text-champan shadow-gold-glow'
                        : esOcupada
                        ? 'border-borde bg-[#0F172A] text-texto hover:border-oro/40'
                        : 'border-borde/40 bg-[#0D1525]/40 text-texto-tenue opacity-50'
                    }`}
                  >
                    <span>Mesa {m.numero}</span>
                    <span className="text-[10px] font-mono">
                      {esOcupada ? 'Con comanda' : 'Sin comanda'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RECIBO EDITORIAL NOCTURNO */}
          <div className="p-6 sm:p-10 rounded-3xl bg-[#0B1222] border border-borde/80 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Cabecera del Recibo */}
            <div className="text-center space-y-2 pb-6 border-b border-dashed border-borde">
              <div className="flex justify-center mb-2">
                <LogoBlueVelvet tamano={52} />
              </div>
              <h2 className="font-serif text-2xl font-bold tracking-wider text-texto">
                BLUE VELVET
              </h2>
              <p className="text-[11px] uppercase tracking-[0.25em] text-oro font-semibold">
                Coctelería de Autor · Servicio Nocturno
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-texto-secundario pt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-texto-tenue" />
                  <span>{new Date().toLocaleDateString('es-CO')}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-texto-tenue" />
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </span>
              </div>
            </div>

            {/* Metadatos de la Mesa */}
            <div className="flex items-center justify-between text-xs py-2 border-b border-dashed border-borde">
              <span className="text-texto-secundario">Mesa asignada:</span>
              <span className="font-bold text-texto">Mesa #{mesaActual.numero} {mesaActual.zona ? `(${mesaActual.zona})` : ''}</span>
            </div>

            {/* Desglose de Bebidas */}
            <div className="space-y-3 py-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-texto-tenue block">
                Detalle de Comanda
              </span>

              {itemsMesa.length === 0 ? (
                <p className="text-xs text-texto-tenue py-4 text-center italic">
                  Esta mesa no tiene bebidas cargadas en su comanda actual.
                </p>
              ) : (
                <div className="space-y-3">
                  {itemsMesa.map((it, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-4 text-xs">
                      <div>
                        <p className="font-bold text-texto">
                          {it.cantidad}x {it.nombrePlato}
                        </p>
                        {it.nombreDestilado && (
                          <p className="text-[10px] text-champan">Base: {it.nombreDestilado}</p>
                        )}
                        {it.garnishes && it.garnishes.length > 0 && (
                          <p className="text-[10px] text-texto-tenue">{it.garnishes.join(', ')}</p>
                        )}
                      </div>
                      <span className="font-mono text-texto font-medium">
                        {formatCOP(it.precioCongelado * it.cantidad)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Separador Punteado */}
            <div className="border-b border-dashed border-borde my-2" />

            {/* Subtotal */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-texto-secundario">Subtotal neto:</span>
              <span className="font-mono text-sm text-texto font-bold">
                {formatCOP(subtotalNeto)}
              </span>
            </div>

            {/* Selector de Propina */}
            <div className="space-y-2 pt-2">
              <label className="text-xs uppercase tracking-wider text-texto-secundario font-bold flex items-center justify-between">
                <span>Propina del Servicio</span>
                <span className="text-champan font-mono">+{formatCOP(valorPropina)}</span>
              </label>

              <div className="grid grid-cols-4 gap-2">
                {PORCENTAJES_PROPINA.map((pct) => {
                  const seleccionado = porcentajePropina === pct;
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setPorcentajePropina(pct)}
                      className={`py-2 px-3 rounded-full text-xs font-bold transition-all ${
                        seleccionado
                          ? 'bg-oro text-noche border-2 border-champan shadow-gold-glow scale-105'
                          : 'bg-superficie-profunda text-texto-secundario hover:text-texto border border-borde'
                      }`}
                    >
                      {pct}%
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total Final en Playfair 30px */}
            <div className="pt-4 border-t border-borde flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-texto-secundario font-bold block">
                  Total Final a Liquidar
                </span>
                <span className="text-[10px] text-texto-tenue">
                  Impuestos y servicio incluidos
                </span>
              </div>
              <span className="font-serif text-3xl font-bold text-oro">
                {formatCOP(totalGeneral)}
              </span>
            </div>

            {/* Método de Cobro Ilustrativo */}
            <div className="p-3.5 rounded-xl bg-superficie-profunda border border-borde flex items-center gap-3 text-xs text-texto-secundario">
              <CreditCard className="w-5 h-5 text-oro shrink-0" />
              <span>Terminal de pago principal — Tarjeta terminada en 4242</span>
            </div>

            {/* Botón Primario de Cierre Atómico */}
            <div className="pt-2">
              <button
                type="button"
                disabled={subtotalNeto === 0}
                onClick={handleConfirmarLiquidacion}
                className="w-full btn-primario py-4 text-sm gap-2"
              >
                <span>Confirmar pago y liquidar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[10px] text-texto-tenue mt-2">
                Acción atómica: La comanda se archiva y la mesa física pasa inmediatamente a estado libre.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
