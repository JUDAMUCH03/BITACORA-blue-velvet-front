import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Check,
  Wine,
  Flame,
  GlassWater,
  AlertCircle,
  X,
  Plus,
  Minus,
  Info,
} from 'lucide-react';
import { useBlueVelvet } from '../../context/BlueVelvetContext';
import {
  CATEGORIAS_BEBIDA,
  DESTILADOS_BASE_CATALOGO,
  GUARNICIONES_BOTANICAS,
} from '../../types/dominio';
import { formatCOP } from '../menu/MenuCard';

const FILTROS_CARTA = [
  { id: 'TODOS', etiqueta: 'Todos' },
  { id: CATEGORIAS_BEBIDA.COCTEL_AUTOR, etiqueta: 'Firmas de la casa' },
  { id: CATEGORIAS_BEBIDA.DESTILADO_PREMIUM, etiqueta: 'Destilados Premium' },
  { id: CATEGORIAS_BEBIDA.MOCKTAIL, etiqueta: 'Sin alcohol 0.0%' },
  { id: CATEGORIAS_BEBIDA.BOTANICO, etiqueta: 'Mixología Botánica' },
];

export default function ModuloCarta({ terminoBusqueda }) {
  const {
    platos,
    mesas,
    mesaSeleccionadaId,
    seleccionarMesa,
    agregarItemAComanda,
    dispararAlerta,
  } = useBlueVelvet();

  const [filtroActivo, setFiltroActivo] = useState('TODOS');
  const [coctelPersonalizar, setCoctelPersonalizar] = useState(null);

  // Estados del modal de personalización
  const [destiladoSeleccionadoId, setDestiladoSeleccionadoId] = useState(null);
  const [guarnicionesSeleccionadas, setGuarnicionesSeleccionadas] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [mesaDestinoId, setMesaDestinoId] = useState(mesaSeleccionadaId || 1);
  const [errorValidacionModal, setErrorValidacionModal] = useState('');

  // Filtrado de cócteles
  const coctelesFiltrados = useMemo(() => {
    return platos.filter((plato) => {
      const coincideFiltro =
        filtroActivo === 'TODOS' ? true : plato.categoria === filtroActivo;

      const coincideBusqueda = terminoBusqueda
        ? plato.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
          plato.descripcion.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
          plato.categoria.toLowerCase().includes(terminoBusqueda.toLowerCase())
        : true;

      return coincideFiltro && coincideBusqueda;
    });
  }, [platos, filtroActivo, terminoBusqueda]);

  // Abrir modal de personalización
  const abrirPersonalizacion = (plato) => {
    if (!plato.disponible) return;
    setCoctelPersonalizar(plato);
    setCantidad(1);
    setGuarnicionesSeleccionadas([]);
    setErrorValidacionModal('');
    setMesaDestinoId(mesaSeleccionadaId || 1);

    // Si es alcohólico, preseleccionar primer destilado sugerido
    if (plato.esAlcoholico) {
      setDestiladoSeleccionadoId(DESTILADOS_BASE_CATALOGO[0].id);
    } else {
      setDestiladoSeleccionadoId(null);
    }
  };

  // Manejo de guarniciones con límite estricto de 2
  const alternarGuarnicion = (guarnicion) => {
    if (guarnicionesSeleccionadas.includes(guarnicion)) {
      setGuarnicionesSeleccionadas((prev) => prev.filter((g) => g !== guarnicion));
    } else {
      if (guarnicionesSeleccionadas.length >= 2) {
        return; // Límite de 2 alcanzado
      }
      setGuarnicionesSeleccionadas((prev) => [...prev, guarnicion]);
    }
  };

  // Guardar cóctel en comanda de la mesa
  const handleConfirmarPersonalizacion = (e) => {
    e.preventDefault();
    setErrorValidacionModal('');

    // REGLA 1: Destilado obligatorio si es alcohólico
    if (coctelPersonalizar.esAlcoholico && !destiladoSeleccionadoId) {
      setErrorValidacionModal('Es mandatorio seleccionar un destilado base para esta preparación.');
      return;
    }

    const destiladoObj = DESTILADOS_BASE_CATALOGO.find((d) => d.id === destiladoSeleccionadoId);

    const itemComanda = {
      idPlato: coctelPersonalizar.id,
      nombrePlato: coctelPersonalizar.nombre,
      precioCongelado: coctelPersonalizar.precio,
      cantidad,
      spiritBrandId: destiladoObj ? destiladoObj.id : null,
      nombreDestilado: destiladoObj ? destiladoObj.nombre : null,
      garnishes: guarnicionesSeleccionadas,
    };

    agregarItemAComanda(mesaDestinoId, itemComanda);
    seleccionarMesa(mesaDestinoId);
    dispararAlerta(
      `${cantidad}x ${coctelPersonalizar.nombre} agregado a la comanda de la Mesa ${mesaDestinoId}.`,
      'esmeralda'
    );
    setCoctelPersonalizar(null);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* ================================================================= */}
      {/* ENCABEZADO EDITORIAL DE LA CARTA */}
      {/* ================================================================= */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-superficie-profunda border border-oro/30 text-oro text-[11px] font-bold uppercase tracking-[0.2em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Carta de Autor</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-texto tracking-tight">
          Selecciones de la casa <span className="text-champan">✦</span>
        </h1>

        <p className="text-texto-secundario text-xs sm:text-sm font-light max-w-2xl leading-relaxed">
          Formulaciones exclusivas diseñadas con botánicos de recolección nocturna, técnicas de
          maceración al vacío e infusiones ahumadas en madera noble.
        </p>
      </div>

      {/* ================================================================= */}
      {/* FILTROS POR PÍLDORAS */}
      {/* ================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {FILTROS_CARTA.map((filtro) => {
          const esActivo = filtroActivo === filtro.id;
          return (
            <button
              key={filtro.id}
              type="button"
              onClick={() => setFiltroActivo(filtro.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                esActivo
                  ? 'bg-oro text-noche font-bold shadow-gold-glow scale-105'
                  : 'bg-superficie-profunda text-texto-secundario hover:text-texto hover:bg-superficie border border-borde'
              }`}
            >
              {filtro.etiqueta}
            </button>
          );
        })}
      </div>

      {/* ================================================================= */}
      {/* REJILLA DE TARJETAS DE CÓCTEL (BORDES ASIMÉTRICOS DE LUJO) */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {coctelesFiltrados.map((plato) => {
          const estaAgotado = !plato.disponible;

          return (
            <div
              key={plato.id}
              className={`tarjeta-asimetrica flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                estaAgotado ? 'opacity-70' : 'hover:border-oro/50'
              }`}
            >
              {/* Imagen y Badges */}
              <div className="relative h-[240px] sm:h-[260px] w-full bg-[#0D1525] overflow-hidden">
                <img
                  src={plato.imagenUrl}
                  alt={plato.nombre}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    estaAgotado ? 'grayscale contrast-125 opacity-40' : 'opacity-85'
                  }`}
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1728] via-transparent to-black/30 pointer-events-none" />

                {/* Categoría */}
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-champan px-2.5 py-1 rounded-full bg-noche/90 border border-oro/30 backdrop-blur-md">
                  {plato.categoria.replace('_', ' ')}
                </span>

                {/* Insignia de Disponibilidad */}
                <div className="absolute top-3 right-3">
                  {estaAgotado ? (
                    <span className="insignia-carmesi">Agotado en barra</span>
                  ) : (
                    <span className="insignia-verde">Disponible</span>
                  )}
                </div>

                {/* ABV / Graduación */}
                <div className="absolute bottom-3 left-3 text-[11px] text-texto-secundario font-mono bg-noche/80 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-sm">
                  {plato.graduacionAlcoholica > 0
                    ? `${plato.graduacionAlcoholica}% ABV`
                    : '0.0% ABV · Sin alcohol'}
                </div>
              </div>

              {/* Contenido Sensorial */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-texto leading-snug">
                      {plato.nombre}
                    </h3>
                  </div>

                  <p className="text-xs text-texto-secundario leading-relaxed font-light">
                    {plato.descripcion}
                  </p>

                  {/* Cristalería y Notas */}
                  {plato.cristaleria && (
                    <p className="text-[11px] text-champan/90 font-medium pt-1 flex items-center gap-1.5">
                      <GlassWater className="w-3.5 h-3.5 text-oro" />
                      <span>{plato.cristaleria}</span>
                    </p>
                  )}
                </div>

                {/* Precio y Botón de Acción */}
                <div className="pt-3 border-t border-borde/60 flex items-center justify-between gap-3">
                  <span className="font-serif text-lg font-bold text-oro">
                    {formatCOP(plato.precio)}
                  </span>

                  <button
                    type="button"
                    disabled={estaAgotado}
                    onClick={() => abrirPersonalizacion(plato)}
                    className="btn-primario text-xs px-3.5 py-2"
                  >
                    Personalizar preparación
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================================================= */}
      {/* MODAL DE PERSONALIZACIÓN MIXOLÓGICA (VALIDACIONES DE DOMINIO) */}
      {/* ================================================================= */}
      {coctelPersonalizar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-[620px] max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111A2B] border border-[#354158] p-6 space-y-6 shadow-2xl relative">
            {/* Encabezado del Modal */}
            <div className="flex items-start justify-between pb-3 border-b border-borde/70">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-oro font-bold">
                  Personalización en Barra
                </span>
                <h2 className="font-serif text-2xl font-bold text-texto">
                  {coctelPersonalizar.nombre}
                </h2>
                <p className="text-xs text-texto-secundario">
                  Precio base: <strong className="text-champan">{formatCOP(coctelPersonalizar.precio)}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCoctelPersonalizar(null)}
                className="p-1.5 rounded-lg text-texto-tenue hover:text-texto hover:bg-white/10 transition-colors"
                aria-label="Cerrar modal de personalización"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error de Validación en Vivo */}
            {errorValidacionModal && (
              <div className="p-3.5 rounded-xl bg-carmesi/10 border border-carmesi/30 text-carmesi-claro text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorValidacionModal}</span>
              </div>
            )}

            <form onSubmit={handleConfirmarPersonalizacion} className="space-y-6">
              {/* =========================================================== */}
              {/* REGLA 1: AISLAMIENTO ESTRICTO 0.0% ABV (MOCKTAIL O BOTANICO) */}
              {/* =========================================================== */}
              {!coctelPersonalizar.esAlcoholico ? (
                <div className="p-4 rounded-xl bg-[#064e3b]/30 border border-esmeralda/40 space-y-2">
                  <div className="flex items-center gap-2 text-esmeralda-claro font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-esmeralda" />
                    <span>100% Libre de alcohol · Preparación aislada</span>
                  </div>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    Esta creación no admite sustituciones ni bases alcohólicas por protocolo de carta
                    y pureza organoléptica. Se prepara en estación botánica no cruzada.
                  </p>
                </div>
              ) : (
                /* REGLA 2: DESTILADO BASE OBLIGATORIO */
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-texto flex items-center justify-between">
                    <span>Destilado Base Obligatorio</span>
                    <span className="text-[10px] text-oro lowercase font-normal">(Selección mandatoria)</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {DESTILADOS_BASE_CATALOGO.map((dest) => {
                      const esSeleccionado = destiladoSeleccionadoId === dest.id;
                      return (
                        <button
                          key={dest.id}
                          type="button"
                          onClick={() => setDestiladoSeleccionadoId(dest.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            esSeleccionado
                              ? 'bg-oro/15 border-oro text-champan shadow-sm'
                              : 'bg-[#0D1525] border-borde text-texto-secundario hover:border-white/20 hover:text-texto'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-texto">{dest.nombre}</span>
                            {esSeleccionado && <Check className="w-3.5 h-3.5 text-oro" />}
                          </div>
                          <span className="text-[10px] text-texto-tenue block mt-0.5">
                            {dest.origen} · {dest.notas}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* =========================================================== */}
              {/* REGLA 3: LÍMITE DE 2 GUARNICIONES BOTÁNICAS */}
              {/* =========================================================== */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-texto">
                    Guarniciones Botánicas
                  </label>
                  <span className="text-[11px] text-champan font-mono">
                    {guarnicionesSeleccionadas.length} / 2 seleccionadas
                  </span>
                </div>

                {guarnicionesSeleccionadas.length >= 2 && (
                  <p className="text-[11px] text-ambar font-medium flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Límite de 2 guarniciones alcanzado para armonía de cata.</span>
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {GUARNICIONES_BOTANICAS.map((garnish) => {
                    const marcado = guarnicionesSeleccionadas.includes(garnish);
                    const deshabilitado = !marcado && guarnicionesSeleccionadas.length >= 2;

                    return (
                      <button
                        key={garnish}
                        type="button"
                        disabled={deshabilitado}
                        onClick={() => alternarGuarnicion(garnish)}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                          marcado
                            ? 'bg-oro/15 border-oro text-champan font-semibold'
                            : deshabilitado
                            ? 'bg-[#0D1525]/40 border-borde/40 text-texto-tenue opacity-40 cursor-not-allowed'
                            : 'bg-[#0D1525] border-borde text-texto-secundario hover:border-oro/40 hover:text-texto'
                        }`}
                      >
                        <span>{garnish}</span>
                        {marcado && <Check className="w-3.5 h-3.5 text-oro" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* =========================================================== */}
              {/* CANTIDAD Y MESA DESTINO */}
              {/* =========================================================== */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Cantidad */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-texto-secundario font-medium mb-1.5">
                    Cantidad de Bebidas
                  </label>
                  <div className="flex items-center justify-between bg-[#0D1525] border border-borde rounded-xl px-4 py-2.5">
                    <span className="text-sm font-bold text-texto">{cantidad}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                        disabled={cantidad <= 1}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-texto flex items-center justify-center disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCantidad((prev) => Math.min(10, prev + 1))}
                        disabled={cantidad >= 10}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-texto flex items-center justify-center disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mesa Destino */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-texto-secundario font-medium mb-1.5">
                    Mesa Física de Servicio
                  </label>
                  <select
                    value={mesaDestinoId}
                    onChange={(e) => setMesaDestinoId(Number(e.target.value))}
                    className="w-full bg-[#0D1525] border border-borde rounded-xl px-4 py-2.5 text-xs text-texto focus:outline-none focus:border-oro"
                  >
                    {mesas.map((m) => (
                      <option key={m.id} value={m.id} className="bg-noche text-texto">
                        Mesa {m.numero} {m.zona ? `(${m.zona})` : ''} — {m.capacidad} comensales
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botón de Confirmación con Total */}
              <div className="pt-4 border-t border-borde flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setCoctelPersonalizar(null)}
                  className="btn-secundario text-xs"
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-primario flex-1 text-xs">
                  Agregar a la comanda — {formatCOP(coctelPersonalizar.precio * cantidad)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
