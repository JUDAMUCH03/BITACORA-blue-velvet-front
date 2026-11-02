import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { COCKTAIL_IMAGE_MAP } from '../services/menuService';
import { useAuth } from './AuthContext';
import {
  CATEGORIAS_BEBIDA,
  ESTADOS_PEDIDO,
  ESTADOS_MESA,
  DESTILADOS_BASE_CATALOGO,
  GUARNICIONES_BOTANICAS,
} from '../types/dominio';

const BlueVelvetContext = createContext(null);

const DEFAULT_COCKTAIL_IMAGE =
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80';

// Las escrituras esperan la respuesta real del servidor (tolera un arranque lento del servicio).
const ESCRITURA_TIMEOUT_MS = 25000;
const LECTURA_TIMEOUT_MS = 15000;
const AUDITORIA_TIMEOUT_MS = 6000;

const LIMITE_NOMBRE = 100;
const LIMITE_DESCRIPCION = 255;

/**
 * Traduce un error de Axios en un mensaje operativo claro para el personal.
 * Nunca se confirma un guardado que no ocurrió.
 */
function describirErrorBackend(err, accion) {
  const status = err?.response?.status ?? err?.status;
  const mensajeServidor = err?.response?.data?.message;

  if (!status) {
    return `${accion}: no hay conexión con el servicio. Verifica tu red e inténtalo nuevamente.`;
  }
  if (status === 401) return `${accion}: tu sesión expiró. Inicia sesión nuevamente.`;
  if (status === 403) return `${accion}: tu perfil no tiene permisos para esta operación.`;
  if (status === 404) return `${accion}: el registro ya no existe.`;
  if (status === 409) return `${accion}: ${mensajeServidor || 'ya existe un registro con ese nombre o está en uso.'}`;
  if (status === 400 || status === 422) return `${accion}: ${mensajeServidor || 'revisa los datos ingresados.'}`;
  return `${accion}: el servicio no pudo completar la operación. Inténtalo nuevamente.`;
}

/**
 * Normaliza un plato recibido del servidor con los atributos de presentación de la UI.
 * El ID siempre proviene de la base de datos.
 */
function enriquecerPlato(p, extra = {}) {
  const sinAlcohol =
    p.categoria === CATEGORIAS_BEBIDA.MOCKTAIL || p.categoria === CATEGORIAS_BEBIDA.BOTANICO;
  return {
    ...p,
    imagenUrl: p.imagenUrl || extra.imagenUrl || COCKTAIL_IMAGE_MAP[p.id] || DEFAULT_COCKTAIL_IMAGE,
    graduacionAlcoholica: p.graduacionAlcoholica ?? extra.graduacionAlcoholica ?? (sinAlcohol ? 0 : 25),
    notasSensoriales: p.notasSensoriales || extra.notasSensoriales,
    cristaleria: p.cristaleria || extra.cristaleria,
    esAlcoholico: !sinAlcohol,
  };
}

// =========================================================================
// DATOS DE RESPALDO DE LECTURA (solo se muestran si el servicio no responde)
// =========================================================================

const PLATOS_INICIALES = [
  {
    id: 1,
    nombre: 'Smoked Old Fashioned',
    categoria: CATEGORIAS_BEBIDA.COCTEL_AUTOR,
    precio: 45000,
    descripcion: 'Bourbon añejado en roble, bitter de cacao, azúcar demerara y ahumado en campana de madera.',
    graduacionAlcoholica: 32,
    notasSensoriales: ['Ahumado profundo', 'Vainilla noble', 'Cacao criollo'],
    cristaleria: 'Vaso Old Fashioned de cristal tallado',
    disponible: true,
    imagenUrl: COCKTAIL_IMAGE_MAP[1],
    esAlcoholico: true,
  },
  {
    id: 2,
    nombre: 'Velvet Negroni Botánico',
    categoria: CATEGORIAS_BEBIDA.COCTEL_AUTOR,
    precio: 42000,
    descripcion: 'Gin macerado en lavanda y enebro, Campari infusionado y vermouth rosso de autor.',
    graduacionAlcoholica: 28,
    notasSensoriales: ['Herbal amargo', 'Lavanda fresca', 'Cítrico persistente'],
    cristaleria: 'Vaso bajo con prisma de hielo cristalino',
    disponible: true,
    imagenUrl: COCKTAIL_IMAGE_MAP[2],
    esAlcoholico: true,
  },
  {
    id: 3,
    nombre: 'Penicillin de Autor',
    categoria: CATEGORIAS_BEBIDA.COCTEL_AUTOR,
    precio: 44000,
    descripcion: 'Blended scotch whisky, jengibre fresco macerado, miel de agave, limón y toque de Islay ahumado.',
    graduacionAlcoholica: 26,
    notasSensoriales: ['Jengibre vibrante', 'Miel de agave', 'Turba ahumada'],
    cristaleria: 'Vaso bajo con roca esférica',
    disponible: true,
    imagenUrl: COCKTAIL_IMAGE_MAP[3],
    esAlcoholico: true,
  },
  {
    id: 4,
    nombre: 'Mezcalita Floral Oaxaqueña',
    categoria: CATEGORIAS_BEBIDA.COCTEL_AUTOR,
    precio: 40000,
    descripcion: 'Mezcal artesanal espadín, licor de damiana, cordial de flor de jamaica y sal de gusano ahumada.',
    graduacionAlcoholica: 24,
    notasSensoriales: ['Floral terroso', 'Humo sutil', 'Acidez de jamaica'],
    cristaleria: 'Copa Coupé con escarchado botánico',
    disponible: true,
    imagenUrl: COCKTAIL_IMAGE_MAP[4],
    esAlcoholico: true,
  },
  {
    id: 5,
    nombre: 'Macallan 12 Double Cask',
    categoria: CATEGORIAS_BEBIDA.DESTILADO_PREMIUM,
    precio: 65000,
    descripcion: 'Single malt scotch servido en esfera de hielo tallada a mano con notas de miel y roble.',
    graduacionAlcoholica: 40,
    notasSensoriales: ['Caramelo suave', 'Jengibre dulce', 'Roble de jerez'],
    cristaleria: 'Copa Glencairn de degustación',
    disponible: true,
    imagenUrl: COCKTAIL_IMAGE_MAP[5],
    esAlcoholico: true,
  },
  {
    id: 6,
    nombre: 'Zacapa Centenario 23',
    categoria: CATEGORIAS_BEBIDA.DESTILADO_PREMIUM,
    precio: 55000,
    descripcion: 'Ron añejado en sistema solera, servido en copa balón con twist de naranja y nibs de cacao.',
    graduacionAlcoholica: 40,
    notasSensoriales: ['Cacao tostado', 'Fruta pasificada', 'Miel de caña'],
    cristaleria: 'Copa Snifter tibia',
    disponible: true,
    imagenUrl: COCKTAIL_IMAGE_MAP[6],
    esAlcoholico: true,
  },
  {
    id: 7,
    nombre: 'Velvet Cloud 0.0%',
    categoria: CATEGORIAS_BEBIDA.MOCKTAIL,
    precio: 28000,
    descripcion: 'Hidrolatos botánicos de enebro sin alcohol, clarificado de cítricos y cordial de jazmín 0.0% ABV.',
    graduacionAlcoholica: 0,
    notasSensoriales: ['Jazmín sedoso', 'Enebro sutil', 'Final cítrico puro'],
    cristaleria: 'Copa Nick & Nora congelada',
    disponible: true,
    imagenUrl: COCKTAIL_IMAGE_MAP[7],
    esAlcoholico: false,
  },
  {
    id: 8,
    nombre: 'Elíxir Botánico de Romero',
    categoria: CATEGORIAS_BEBIDA.BOTANICO,
    precio: 26000,
    descripcion: 'Infusión fría de romero silvestre, tónica artesanal de flor de sauco y perfume de bergamota.',
    graduacionAlcoholica: 0,
    notasSensoriales: ['Romero fresco', 'Flor de sauco', 'Burbuja vivaz'],
    cristaleria: 'Vaso Collins con púa botánica',
    disponible: true,
    imagenUrl: COCKTAIL_IMAGE_MAP[8],
    esAlcoholico: false,
  },
];

const MESAS_INICIALES = [
  { id: 1, numero: 1, capacidad: 2, estado: ESTADOS_MESA.DISPONIBLE, zona: 'Terraza Botánica', cuentaAbierta: false },
  { id: 2, numero: 2, capacidad: 4, estado: ESTADOS_MESA.OCUPADA, zona: 'Sala Principal Velvet', comandaActivaId: 501, cuentaAbierta: true },
  { id: 3, numero: 3, capacidad: 4, estado: ESTADOS_MESA.DISPONIBLE, zona: 'Sala Principal Velvet', cuentaAbierta: false },
  { id: 4, numero: 4, capacidad: 6, estado: ESTADOS_MESA.RESERVADA, zona: 'Cava Privada de Destilados', cuentaAbierta: false },
  { id: 5, numero: 5, capacidad: 2, estado: ESTADOS_MESA.OCUPADA, zona: 'Barra de Autor (Front-Row)', comandaActivaId: 502, cuentaAbierta: true },
  { id: 6, numero: 6, capacidad: 8, estado: ESTADOS_MESA.DISPONIBLE, zona: 'Cava Privada de Destilados', cuentaAbierta: false },
];

const PEDIDOS_KDS_INICIALES = [
  {
    id: 501,
    idMesa: 2,
    numeroMesa: 2,
    estado: ESTADOS_PEDIDO.EN_PREPARACION,
    timestamp: new Date(Date.now() - 14 * 60000).toISOString(),
    items: [
      {
        id: 101,
        idPlato: 1,
        nombrePlato: 'Smoked Old Fashioned',
        precioCongelado: 45000,
        cantidad: 2,
        spiritBrandId: 1,
        nombreDestilado: 'Woodford Reserve Double Oaked',
        spiritModificationsCount: 0,
        garnishes: [GUARNICIONES_BOTANICAS[0], GUARNICIONES_BOTANICAS[1]],
      },
      {
        id: 102,
        idPlato: 7,
        nombrePlato: 'Velvet Cloud 0.0%',
        precioCongelado: 28000,
        cantidad: 1,
        spiritBrandId: null,
        nombreDestilado: null,
        spiritModificationsCount: 0,
        garnishes: [GUARNICIONES_BOTANICAS[2]],
      },
    ],
  },
  {
    id: 502,
    idMesa: 5,
    numeroMesa: 5,
    estado: ESTADOS_PEDIDO.RECIBIDO,
    timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
    items: [
      {
        id: 103,
        idPlato: 2,
        nombrePlato: 'Velvet Negroni Botánico',
        precioCongelado: 42000,
        cantidad: 1,
        spiritBrandId: 2,
        nombreDestilado: 'Monkey 47 Schwarzwald Dry Gin',
        spiritModificationsCount: 0,
        garnishes: [GUARNICIONES_BOTANICAS[0]],
      },
    ],
  },
];

const AUDITORIA_INICIAL = [
  {
    id: 'evt-01',
    tipoEvento: 'INICIO_SERVICIO',
    entidadId: 'SISTEMA',
    usuario: 'Staff Operativo',
    detalle: 'Apertura de turno: Servicio Nocturno · Blue Velvet activo',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
  },
];

export function BlueVelvetProvider({ children }) {
  // Vinculación con AuthContext (perfil del personal autenticado)
  const { user } = useAuth();
  const rolActivo = user?.rol || 'ROLE_CLIENTE';

  const [platos, setPlatos] = useState(PLATOS_INICIALES);
  const [mesas, setMesas] = useState(MESAS_INICIALES);
  const [pedidos, setPedidos] = useState(PEDIDOS_KDS_INICIALES);
  const [eventosAuditoria, setEventosAuditoria] = useState(AUDITORIA_INICIAL);
  const [mesaSeleccionadaId, setMesaSeleccionadaId] = useState(2);
  const [alertaFlotante, setAlertaFlotante] = useState(null);
  const [comandasBorrador, setComandasBorrador] = useState({});
  const [cargandoInicial, setCargandoInicial] = useState(true);
  // IDs de platos con una petición de disponibilidad en vuelo (para la animación de la UI)
  const [platosPendientes, setPlatosPendientes] = useState([]);

  /**
   * Notificación flotante de dominio
   */
  const dispararAlerta = useCallback((mensaje, tipo = 'ambar') => {
    setAlertaFlotante({ mensaje, tipo });
    setTimeout(() => {
      setAlertaFlotante((curr) => (curr?.mensaje === mensaje ? null : curr));
    }, 4500);
  }, []);

  /**
   * Bitácora de sucesos operativos (lectura no crítica, se ignora si no está disponible)
   */
  const cargarAuditoriaSilenciosa = useCallback(async () => {
    try {
      const resAudit = await api.get('/auditoria', { timeout: AUDITORIA_TIMEOUT_MS });
      if (Array.isArray(resAudit.data) && resAudit.data.length > 0) {
        setEventosAuditoria(resAudit.data);
      }
    } catch (err) {
      console.info('[BlueVelvetContext] Bitácora no disponible (ignorado):', err?.message);
    }
  }, []);

  /**
   * Carga inicial en paralelo. El catálogo proviene SIEMPRE de GET /platos (incluye agotados).
   */
  const cargarDatosIniciales = useCallback(async () => {
    setCargandoInicial(true);
    try {
      const [resPlatos, resMesas, resPedidos] = await Promise.allSettled([
        api.get('/platos', { timeout: LECTURA_TIMEOUT_MS }),
        api.get('/mesas', { timeout: LECTURA_TIMEOUT_MS }),
        api.get('/pedidos', { timeout: LECTURA_TIMEOUT_MS }),
      ]);

      if (resPlatos.status === 'fulfilled' && Array.isArray(resPlatos.value?.data)) {
        setPlatos(resPlatos.value.data.map((p) => enriquecerPlato(p)));
      } else {
        // Respaldo de lectura: carta pública
        try {
          const resMenu = await api.get('/menu', { timeout: LECTURA_TIMEOUT_MS });
          if (Array.isArray(resMenu.data)) {
            setPlatos(resMenu.data.map((p) => enriquecerPlato(p)));
          }
        } catch (_) {
          /* se conserva el respaldo local de lectura */
        }
      }

      if (resMesas.status === 'fulfilled' && Array.isArray(resMesas.value?.data) && resMesas.value.data.length > 0) {
        setMesas(resMesas.value.data);
      }

      if (resPedidos.status === 'fulfilled' && Array.isArray(resPedidos.value?.data) && resPedidos.value.data.length > 0) {
        setPedidos(resPedidos.value.data);
      }

      if (rolActivo === 'ROLE_ADMIN') {
        cargarAuditoriaSilenciosa();
      }
    } catch (err) {
      console.warn('[BlueVelvetContext] Carga inicial con advertencia:', err);
    } finally {
      setCargandoInicial(false);
    }
  }, [rolActivo, cargarAuditoriaSilenciosa]);

  useEffect(() => {
    cargarDatosIniciales();
  }, [cargarDatosIniciales]);

  /**
   * Selección de mesa con validación de comanda única
   */
  const seleccionarMesa = useCallback((mesaId) => {
    const mesa = mesas.find((m) => m.id === mesaId);
    if (!mesa) return;

    if (mesa.estado === ESTADOS_MESA.OCUPADA) {
      dispararAlerta(`La mesa ${mesa.numero} ya tiene una comanda activa en curso. Se ha cargado su servicio.`, 'ambar');
    }

    setMesaSeleccionadaId(mesaId);
  }, [mesas, dispararAlerta]);

  /**
   * Agregar cóctel personalizado al borrador de la mesa
   */
  const agregarItemAComanda = useCallback((mesaId, itemData) => {
    setComandasBorrador((prev) => {
      const itemsActuales = prev[mesaId] || [];
      const nuevoItem = {
        id: Date.now(),
        idPlato: itemData.idPlato,
        nombrePlato: itemData.nombrePlato,
        precioCongelado: itemData.precioCongelado,
        cantidad: itemData.cantidad || 1,
        spiritBrandId: itemData.spiritBrandId || null,
        nombreDestilado: itemData.nombreDestilado || null,
        spiritModificationsCount: 0,
        garnishes: itemData.garnishes || [],
      };
      return {
        ...prev,
        [mesaId]: [...itemsActuales, nuevoItem],
      };
    });
  }, []);

  const removerItemDeComanda = useCallback((mesaId, itemId) => {
    setComandasBorrador((prev) => ({
      ...prev,
      [mesaId]: (prev[mesaId] || []).filter((it) => it.id !== itemId),
    }));
  }, []);

  /**
   * 1. DESPACHO DE COMANDAS (Sala ➔ POST /pedidos). Solo se confirma con respuesta real del servidor.
   */
  const enviarComandaABarra = useCallback(async (mesaId) => {
    const mesa = mesas.find((m) => m.id === mesaId);
    if (!mesa) return false;

    if (mesa.estado === ESTADOS_MESA.OCUPADA && mesa.comandaActivaId) {
      const pedidoExistente = pedidos.find(
        (p) => p.id === mesa.comandaActivaId && p.estado !== ESTADOS_PEDIDO.ENTREGADO
      );
      if (pedidoExistente) {
        dispararAlerta(`La mesa ${mesa.numero} ya cuenta con comanda #${pedidoExistente.id} abierta en servicio.`, 'carmesi');
        return false;
      }
    }

    const itemsBorrador = comandasBorrador[mesaId] || [];
    if (itemsBorrador.length === 0) {
      dispararAlerta(`No hay bebidas agregadas a la comanda de la mesa ${mesa.numero}.`, 'ambar');
      return false;
    }

    const payload = {
      idMesa: Number(mesaId),
      items: itemsBorrador.map((it) => ({
        idPlato: Number(it.idPlato || it.id),
        cantidad: Number(it.cantidad || 1),
        spiritBrandId: it.spiritBrandId ? Number(it.spiritBrandId) : null,
        garnishes: Array.isArray(it.garnishes) ? it.garnishes.slice(0, 2) : [],
      })),
    };

    try {
      const response = await api.post('/pedidos', payload, { timeout: ESCRITURA_TIMEOUT_MS });
      const pedidoCreado = response.data;

      setPedidos((prev) => [pedidoCreado, ...prev]);
      setMesas((prev) =>
        prev.map((m) =>
          m.id === mesaId
            ? { ...m, estado: ESTADOS_MESA.OCUPADA, cuentaAbierta: true, comandaActivaId: pedidoCreado.id }
            : m
        )
      );

      setComandasBorrador((prev) => {
        const copia = { ...prev };
        delete copia[mesaId];
        return copia;
      });

      dispararAlerta(`Comanda #${pedidoCreado.id} despachada a barra.`, 'esmeralda');
      return true;
    } catch (err) {
      console.error('[BlueVelvetContext] Error al registrar comanda:', err);
      dispararAlerta(describirErrorBackend(err, 'No se pudo despachar la comanda'), 'carmesi');
      return false;
    }
  }, [mesas, pedidos, comandasBorrador, dispararAlerta]);

  /**
   * 2. AVANCE UNIDIRECCIONAL DE COMANDA (Barra ➔ PATCH /pedidos/{id}/estado)
   */
  const avanzarEstadoPedido = useCallback(async (pedidoId) => {
    const ped = pedidos.find((p) => p.id === pedidoId);
    if (!ped) return;

    let siguienteEstado = ped.estado;
    if (ped.estado === ESTADOS_PEDIDO.RECIBIDO) {
      siguienteEstado = ESTADOS_PEDIDO.EN_PREPARACION;
    } else if (ped.estado === ESTADOS_PEDIDO.EN_PREPARACION) {
      siguienteEstado = ESTADOS_PEDIDO.LISTO;
    } else if (ped.estado === ESTADOS_PEDIDO.LISTO) {
      siguienteEstado = ESTADOS_PEDIDO.ENTREGADO;
    } else {
      return;
    }

    try {
      const response = await api.patch(`/pedidos/${pedidoId}/estado`, { nuevoEstado: siguienteEstado }, { timeout: ESCRITURA_TIMEOUT_MS });
      setPedidos((prev) => prev.map((p) => (p.id === pedidoId ? response.data : p)));
      dispararAlerta(`Comanda #${pedidoId} avanzó a ${siguienteEstado}.`, 'esmeralda');
    } catch (err) {
      console.error('[BlueVelvetContext] Error al avanzar estado de comanda:', err);
      dispararAlerta(describirErrorBackend(err, `No se pudo actualizar la comanda #${pedidoId}`), 'carmesi');
    }
  }, [pedidos, dispararAlerta]);

  /**
   * 3. MUTACIÓN DE DESTILADOS (PATCH /pedidos/{id}/items/{itemId}/destilado)
   */
  const mutarDestiladoBase = useCallback(async (pedidoId, itemId, nuevoDestiladoId, motivo = 'Preferencia del cliente') => {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    if (!pedido) return;

    if (pedido.estado === ESTADOS_PEDIDO.EN_PREPARACION) {
      dispararAlerta('Operación denegada: la comanda está en preparación y ya no admite cambios.', 'carmesi');
      return;
    }

    if (pedido.estado !== ESTADOS_PEDIDO.RECIBIDO) {
      dispararAlerta('Solo es posible mutar el destilado mientras la comanda está en estado RECIBIDO.', 'carmesi');
      return;
    }

    const destiladoObj = DESTILADOS_BASE_CATALOGO.find((d) => d.id === nuevoDestiladoId);
    if (!destiladoObj) return;

    try {
      const response = await api.patch(`/pedidos/${pedidoId}/items/${itemId}/destilado`, {
        nuevoSpiritBrandId: Number(nuevoDestiladoId),
        motivo: motivo || 'Preferencia del cliente',
      }, { timeout: ESCRITURA_TIMEOUT_MS });
      setPedidos((prev) => prev.map((p) => (p.id === pedidoId ? response.data : p)));
      dispararAlerta(`Destilado mutado a ${destiladoObj.nombre}.`, 'esmeralda');
    } catch (err) {
      console.error('[BlueVelvetContext] Error al mutar destilado:', err);
      dispararAlerta(describirErrorBackend(err, 'No se pudo cambiar el destilado'), 'carmesi');
    }
  }, [pedidos, dispararAlerta]);

  /**
   * Cancelar comanda
   */
  const cancelarComanda = useCallback(async (pedidoId) => {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    if (!pedido) return;

    if (pedido.estado !== ESTADOS_PEDIDO.RECIBIDO) {
      dispararAlerta('Solo se pueden cancelar comandas en estado RECIBIDO.', 'carmesi');
      return;
    }

    try {
      await api.patch(`/pedidos/${pedidoId}/estado`, { nuevoEstado: ESTADOS_PEDIDO.CANCELADO }, { timeout: ESCRITURA_TIMEOUT_MS });
      setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
      setMesas((prev) =>
        prev.map((m) =>
          m.id === pedido.idMesa
            ? { ...m, estado: ESTADOS_MESA.DISPONIBLE, cuentaAbierta: false, comandaActivaId: undefined }
            : m
        )
      );
      dispararAlerta(`Comanda #${pedidoId} cancelada y mesa liberada.`, 'esmeralda');
    } catch (err) {
      console.error('[BlueVelvetContext] Error al cancelar comanda:', err);
      dispararAlerta(describirErrorBackend(err, 'No se pudo cancelar la comanda'), 'carmesi');
    }
  }, [pedidos, dispararAlerta]);

  /**
   * 4. LIQUIDACIÓN Y CIERRE DE MESA (POST /cuentas/{id}/cerrar)
   */
  const liquidarCuenta = useCallback(async (mesaId, porcentajePropina = 10, cuentaId = null) => {
    const mesa = mesas.find((m) => m.id === mesaId);
    if (!mesa) return null;

    const idCuentaCerrar = cuentaId || mesa.comandaActivaId || mesaId;

    try {
      await api.post(`/cuentas/${idCuentaCerrar}/cerrar`, null, { timeout: ESCRITURA_TIMEOUT_MS });
      try {
        const resMesas = await api.get('/mesas', { timeout: LECTURA_TIMEOUT_MS });
        if (Array.isArray(resMesas.data)) {
          setMesas(resMesas.data);
        }
      } catch (_) {
        setMesas((prev) =>
          prev.map((m) =>
            m.id === mesaId
              ? { ...m, estado: ESTADOS_MESA.DISPONIBLE, cuentaAbierta: false, comandaActivaId: undefined }
              : m
          )
        );
      }

      const pedidoActivo = pedidos.find((p) => p.idMesa === mesaId && p.estado !== ESTADOS_PEDIDO.CANCELADO);
      if (pedidoActivo) {
        setPedidos((prev) =>
          prev.map((p) => (p.id === pedidoActivo.id ? { ...p, estado: ESTADOS_PEDIDO.ENTREGADO } : p))
        );
      }

      setComandasBorrador((prev) => {
        const copia = { ...prev };
        delete copia[mesaId];
        return copia;
      });

      dispararAlerta(`Cuenta de la mesa ${mesa.numero} liquidada. Mesa liberada.`, 'esmeralda');
      return {
        exito: true,
        mesaNumero: mesa.numero,
        fecha: new Date().toLocaleString(),
      };
    } catch (err) {
      console.error('[BlueVelvetContext] Error al liquidar cuenta:', err);
      const mensajeError = describirErrorBackend(err, `No se pudo liquidar la cuenta de la mesa ${mesa.numero}`);
      dispararAlerta(mensajeError, 'carmesi');
      return { exito: false, error: mensajeError };
    }
  }, [mesas, pedidos, dispararAlerta]);

  /**
   * 5. DISPONIBILIDAD EN BARRA (PATCH /platos/{id}/disponible).
   * Actualización optimista con reversión automática si el servidor rechaza el cambio.
   */
  const toggleDisponibilidadPlato = useCallback(async (platoId) => {
    if (rolActivo === 'ROLE_MESERO') {
      dispararAlerta('Permiso denegado: el rol Mesero solo cuenta con permisos de lectura.', 'carmesi');
      return false;
    }

    const plato = platos.find((p) => p.id === platoId);
    if (!plato || platosPendientes.includes(platoId)) return false;

    const estadoAnterior = Boolean(plato.disponible);
    const nuevoEstado = !estadoAnterior;

    setPlatosPendientes((prev) => [...prev, platoId]);
    setPlatos((prev) => prev.map((p) => (p.id === platoId ? { ...p, disponible: nuevoEstado } : p)));

    try {
      const response = await api.patch(
        `/platos/${platoId}/disponible`,
        null,
        { params: { disponible: nuevoEstado }, timeout: ESCRITURA_TIMEOUT_MS }
      );
      const confirmado = typeof response.data?.disponible === 'boolean' ? response.data.disponible : nuevoEstado;
      setPlatos((prev) => prev.map((p) => (p.id === platoId ? { ...p, disponible: confirmado } : p)));
      dispararAlerta(
        `${plato.nombre} ahora está ${confirmado ? 'DISPONIBLE' : 'AGOTADO EN BARRA'}.`,
        confirmado ? 'esmeralda' : 'ambar'
      );
      return true;
    } catch (err) {
      console.error('[BlueVelvetContext] Error al cambiar disponibilidad:', err);
      setPlatos((prev) => prev.map((p) => (p.id === platoId ? { ...p, disponible: estadoAnterior } : p)));
      dispararAlerta(describirErrorBackend(err, `No se pudo cambiar la disponibilidad de ${plato.nombre}`), 'carmesi');
      return false;
    } finally {
      setPlatosPendientes((prev) => prev.filter((id) => id !== platoId));
    }
  }, [rolActivo, platos, platosPendientes, dispararAlerta]);

  /**
   * 6. CREAR NUEVO CÓCTEL (POST /platos).
   * Solo se agrega a la carta con la respuesta real del servidor y su ID autoincremental.
   */
  const crearPlato = useCallback(async (nuevoPlato) => {
    const esAutorizado =
      !rolActivo ||
      rolActivo.includes('ADMIN') ||
      rolActivo.includes('CHEF');

    if (!esAutorizado) {
      dispararAlerta('Permiso denegado: solo Administrador y Mixólogo Jefe pueden crear cócteles.', 'carmesi');
      return false;
    }

    if (!nuevoPlato.nombre?.trim()) {
      dispararAlerta('El nombre del cóctel es obligatorio.', 'carmesi');
      return false;
    }

    const precioNum = Number(nuevoPlato.precio);
    if (!precioNum || precioNum <= 0) {
      dispararAlerta('El precio debe ser un valor numérico mayor a cero.', 'carmesi');
      return false;
    }

    const payload = {
      nombre: nuevoPlato.nombre.trim().slice(0, LIMITE_NOMBRE),
      precio: precioNum,
      categoria: nuevoPlato.categoria || CATEGORIAS_BEBIDA.COCTEL_AUTOR,
      descripcion: (nuevoPlato.descripcion?.trim() || 'Cóctel de autor Blue Velvet').slice(0, LIMITE_DESCRIPCION),
    };

    try {
      const response = await api.post('/platos', payload, { timeout: ESCRITURA_TIMEOUT_MS });
      const creado = response.data;

      if (!creado || creado.id === undefined || creado.id === null) {
        throw new Error('Respuesta del servicio sin identificador');
      }

      const platoNuevo = enriquecerPlato(
        { ...creado, disponible: creado.disponible ?? true },
        {
          graduacionAlcoholica: Number(nuevoPlato.graduacionAlcoholica) || 0,
          notasSensoriales: nuevoPlato.notasSensoriales || ['Perfil botánico exclusivo'],
          cristaleria: nuevoPlato.cristaleria || 'Copa sugerida de la casa',
          imagenUrl: nuevoPlato.imagenUrl,
        }
      );

      setPlatos((prev) => [platoNuevo, ...prev.filter((p) => p.id !== platoNuevo.id)]);
      dispararAlerta(`Cóctel "${platoNuevo.nombre}" registrado en el sistema.`, 'esmeralda');
      return true;
    } catch (err) {
      console.error('[BlueVelvetContext] Error al registrar cóctel:', err);
      dispararAlerta(describirErrorBackend(err, 'No se pudo registrar el cóctel'), 'carmesi');
      return false;
    }
  }, [rolActivo, dispararAlerta]);

  /**
   * 7. ELIMINAR CÓCTEL DE LA CARTA (DELETE /platos/{id}). Solo se retira si el servidor lo confirma.
   */
  const eliminarPlato = useCallback(async (platoId) => {
    const esAutorizado = !rolActivo || rolActivo.includes('ADMIN');

    if (!esAutorizado) {
      dispararAlerta('Permiso denegado: solo el Administrador puede retirar cócteles.', 'carmesi');
      return false;
    }

    const platoAEliminar = platos.find((p) => p.id === platoId);
    const nombrePlato = platoAEliminar?.nombre || `#${platoId}`;

    try {
      await api.delete(`/platos/${platoId}`, { timeout: ESCRITURA_TIMEOUT_MS });
      setPlatos((prev) => prev.filter((p) => p.id !== platoId));
      dispararAlerta(`Cóctel "${nombrePlato}" retirado de la carta.`, 'esmeralda');
      return true;
    } catch (err) {
      console.error('[BlueVelvetContext] Error al retirar cóctel:', err);
      dispararAlerta(describirErrorBackend(err, `No se pudo retirar "${nombrePlato}"`), 'carmesi');
      return false;
    }
  }, [rolActivo, platos, dispararAlerta]);

  // Total de comandas activas en barra (no entregadas)
  const comandasActivasKDSCount = pedidos.filter(
    (p) => p.estado !== ESTADOS_PEDIDO.ENTREGADO && p.estado !== ESTADOS_PEDIDO.CANCELADO
  ).length;

  const value = {
    platos,
    mesas,
    pedidos,
    eventosAuditoria,
    rolActivo,
    mesaSeleccionadaId,
    seleccionarMesa,
    comandasBorrador,
    agregarItemAComanda,
    removerItemDeComanda,
    enviarComandaABarra,
    avanzarEstadoPedido,
    mutarDestiladoBase,
    cancelarComanda,
    liquidarCuenta,
    toggleDisponibilidadPlato,
    platosPendientes,
    crearPlato,
    eliminarPlato,
    comandasActivasKDSCount,
    alertaFlotante,
    dispararAlerta,
    cargandoInicial,
    cargarDatosIniciales,
  };

  return (
    <BlueVelvetContext.Provider value={value}>
      {children}
    </BlueVelvetContext.Provider>
  );
}

export function useBlueVelvet() {
  const context = useContext(BlueVelvetContext);
  if (!context) {
    throw new Error('useBlueVelvet debe ser utilizado dentro de un BlueVelvetProvider');
  }
  return context;
}

export default BlueVelvetContext;
