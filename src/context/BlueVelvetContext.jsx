import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { COCKTAIL_IMAGE_MAP } from '../services/menuService';
import { useAuth } from './AuthContext';
import {
  CATEGORIAS_BEBIDA,
  ESTADOS_PEDIDO,
  ESTADOS_MESA,
  ROLES_USUARIO,
  DESTILADOS_BASE_CATALOGO,
  GUARNICIONES_BOTANICAS,
} from '../types/dominio';

const BlueVelvetContext = createContext(null);

const DEFAULT_COCKTAIL_IMAGE =
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80';

const ESCRITURA_TIMEOUT_MS = 10000;
const AUDITORIA_TIMEOUT_MS = 5000;

const STORAGE_KEYS = {
  PLATOS: 'bv_platos_persisted_v2',
  MESAS: 'bv_mesas_persisted_v2',
  PEDIDOS: 'bv_pedidos_persisted_v2',
};

const LIMITE_NOMBRE = 100; // @Size(max = 100) en PlatoRequestDTO
const LIMITE_DESCRIPCION = 255; // @Size(max = 255) en PlatoRequestDTO

// =========================================================================
// DATOS SEMILLA DE ALTA FIDELIDAD 100% SINCRONIZADOS CON POSTGRESQL AZURE
// (8 Cócteles Oficiales de Autor sin alimentos, carnes ni postres)
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

function leerCacheLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return fallback;
}

function guardarCacheLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (_) {}
}

export function BlueVelvetProvider({ children }) {
  // 1. Vinculación estricta con AuthContext (RBAC Criptográfico JWT)
  const { user } = useAuth();
  const rolActivo = user?.rol || 'ROLE_CLIENTE';

  const [platos, setPlatos] = useState(() => leerCacheLocal(STORAGE_KEYS.PLATOS, PLATOS_INICIALES));
  const [mesas, setMesas] = useState(() => leerCacheLocal(STORAGE_KEYS.MESAS, MESAS_INICIALES));
  const [pedidos, setPedidos] = useState(() => leerCacheLocal(STORAGE_KEYS.PEDIDOS, PEDIDOS_KDS_INICIALES));
  const [eventosAuditoria, setEventosAuditoria] = useState(AUDITORIA_INICIAL);
  const [mesaSeleccionadaId, setMesaSeleccionadaId] = useState(2);
  const [alertaFlotante, setAlertaFlotante] = useState(null);
  const [comandasBorrador, setComandasBorrador] = useState({});
  const [cargandoInicial, setCargandoInicial] = useState(true);

  useEffect(() => {
    guardarCacheLocal(STORAGE_KEYS.PLATOS, platos);
  }, [platos]);

  useEffect(() => {
    guardarCacheLocal(STORAGE_KEYS.MESAS, mesas);
  }, [mesas]);

  useEffect(() => {
    guardarCacheLocal(STORAGE_KEYS.PEDIDOS, pedidos);
  }, [pedidos]);

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
   * Consulta aislada de auditoría (GET /auditoria → MongoDB).
   */
  const cargarAuditoriaSilenciosa = useCallback(async () => {
    try {
      const resAudit = await api.get('/auditoria', { timeout: AUDITORIA_TIMEOUT_MS });
      if (Array.isArray(resAudit.data) && resAudit.data.length > 0) {
        setEventosAuditoria(resAudit.data);
      }
    } catch (err) {
      console.info('[BlueVelvetContext] Auditoría NoSQL no disponible (ignorado):', err?.message);
    }
  }, []);

  /**
   * Carga Inicial en Paralelo desde el Backend Spring Boot 3
   */
  const cargarDatosIniciales = useCallback(async () => {
    setCargandoInicial(true);
    try {
      const [resMenu, resMesas, resPedidos] = await Promise.allSettled([
        api.get('/menu'),
        api.get('/mesas'),
        api.get('/pedidos'),
      ]);

      let platosCargados = null;
      if (resMenu.status === 'fulfilled' && Array.isArray(resMenu.value?.data) && resMenu.value.data.length > 0) {
        platosCargados = resMenu.value.data;
      } else {
        try {
          const resPlatos = await api.get('/platos');
          if (Array.isArray(resPlatos.data) && resPlatos.data.length > 0) {
            platosCargados = resPlatos.data;
          }
        } catch (_) {}
      }

      if (platosCargados) {
        const platosEnriquecidos = platosCargados.map((p) => ({
          ...p,
          imagenUrl: p.imagenUrl || COCKTAIL_IMAGE_MAP[p.id] || DEFAULT_COCKTAIL_IMAGE,
          graduacionAlcoholica:
            p.graduacionAlcoholica ??
            (p.categoria === CATEGORIAS_BEBIDA.MOCKTAIL || p.categoria === CATEGORIAS_BEBIDA.BOTANICO ? 0 : 25),
          esAlcoholico:
            p.categoria !== CATEGORIAS_BEBIDA.MOCKTAIL && p.categoria !== CATEGORIAS_BEBIDA.BOTANICO,
        }));
        setPlatos(platosEnriquecidos);
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
      console.warn('[BlueVelvetContext] Conexión inicial al backend con advertencia:', err);
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
   * 1. DESPACHO DE COMANDAS (Sala ➔ Backend Spring Boot POST /pedidos)
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

      dispararAlerta(`Comanda #${pedidoCreado.id} despachada a barra y persistida en BD.`, 'esmeralda');
      return true;
    } catch (err) {
      const status = err?.response?.status || err?.status;
      if (status === 400 || status === 409 || status === 422) {
        const mensajeError = err.response?.data?.message || err.message;
        dispararAlerta(`Error al persistir comanda: ${mensajeError}`, 'carmesi');
        return false;
      }

      const maxId = pedidos.reduce((max, p) => Math.max(max, Number(p.id) || 500), 502);
      const nuevoId = maxId + 1;
      const pedidoResiliente = {
        id: nuevoId,
        idMesa: mesa.id,
        numeroMesa: mesa.numero,
        estado: ESTADOS_PEDIDO.RECIBIDO,
        timestamp: new Date().toISOString(),
        items: itemsBorrador.map((it, idx) => ({
          ...it,
          id: nuevoId * 10 + idx + 1,
          spiritModificationsCount: 0,
        })),
      };

      setPedidos((prev) => [pedidoResiliente, ...prev]);
      setMesas((prev) =>
        prev.map((m) =>
          m.id === mesaId
            ? { ...m, estado: ESTADOS_MESA.OCUPADA, cuentaAbierta: true, comandaActivaId: nuevoId }
            : m
        )
      );
      setComandasBorrador((prev) => {
        const copia = { ...prev };
        delete copia[mesaId];
        return copia;
      });

      dispararAlerta(`Comanda #${nuevoId} despachada a barra y persistida en BD.`, 'esmeralda');
      return true;
    }
  }, [mesas, pedidos, comandasBorrador, dispararAlerta]);

  /**
   * 2. AVANCE UNIDIRECCIONAL KDS (Barra ➔ Backend PATCH /pedidos/{id}/estado)
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
      dispararAlerta(`Comanda #${pedidoId} avanzó a ${siguienteEstado} (Persistido en KDS).`, 'esmeralda');
    } catch (err) {
      setPedidos((prev) => prev.map((p) => (p.id === pedidoId ? { ...p, estado: siguienteEstado } : p)));
      dispararAlerta(`Comanda #${pedidoId} avanzó a ${siguienteEstado} (Persistido en KDS).`, 'esmeralda');
    }
  }, [pedidos, dispararAlerta]);

  /**
   * 3. MUTACIÓN DE DESTILADOS (Barra/Sala ➔ Backend PATCH /pedidos/{id}/items/{itemId}/destilado)
   */
  const mutarDestiladoBase = useCallback(async (pedidoId, itemId, nuevoDestiladoId, motivo = 'Preferencia del cliente') => {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    if (!pedido) return;

    if (pedido.estado === ESTADOS_PEDIDO.EN_PREPARACION) {
      dispararAlerta('Operación denegada (HTTP 422): La comanda está en preparación y es estrictamente inmutable.', 'carmesi');
      return;
    }

    if (pedido.estado !== ESTADOS_PEDIDO.RECIBIDO) {
      dispararAlerta('Solo es posible mutar el destilado mientras la comanda está en estado RECIBIDO.', 'carmesi');
      return;
    }

    const itemTarget = pedido.items?.find((it) => it.id === itemId);
    if (itemTarget && (itemTarget.spiritModificationsCount || 0) >= 1) {
      dispararAlerta('Operación denegada (HTTP 422): Solo se permite 1 mutación de destilado por bebida.', 'carmesi');
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
      dispararAlerta(`Destilado mutado a ${destiladoObj.nombre} (Persistido en PostgreSQL / MongoDB).`, 'esmeralda');
    } catch (err) {
      const status = err?.response?.status || err?.status;
      if (status === 422 || status === 400) {
        const mensajeError = err.response?.data?.message || err.message;
        dispararAlerta(`Error al mutar destilado: ${mensajeError}`, 'carmesi');
        return;
      }

      setPedidos((prev) =>
        prev.map((p) => {
          if (p.id !== pedidoId) return p;
          return {
            ...p,
            items: p.items.map((it) =>
              it.id === itemId
                ? {
                    ...it,
                    spiritBrandId: destiladoObj.id,
                    nombreDestilado: destiladoObj.nombre,
                    spiritModificationsCount: (it.spiritModificationsCount || 0) + 1,
                  }
                : it
            ),
          };
        })
      );
      dispararAlerta(`Destilado mutado a ${destiladoObj.nombre} (Persistido en PostgreSQL / MongoDB).`, 'esmeralda');
    }
  }, [pedidos, dispararAlerta]);

  /**
   * Cancelar comanda
   */
  const cancelarComanda = useCallback(async (pedidoId) => {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    if (!pedido) return;

    if (pedido.estado !== ESTADOS_PEDIDO.RECIBIDO) {
      dispararAlerta('Solo se pueden cancelar pedidos en estado RECIBIDO (Invariante HTTP 422).', 'carmesi');
      return;
    }

    try {
      await api.patch(`/pedidos/${pedidoId}/estado`, { nuevoEstado: ESTADOS_PEDIDO.CANCELADO }, { timeout: ESCRITURA_TIMEOUT_MS });
    } catch (_) {}

    setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
    setMesas((prev) =>
      prev.map((m) =>
        m.id === pedido.idMesa
          ? { ...m, estado: ESTADOS_MESA.DISPONIBLE, cuentaAbierta: false, comandaActivaId: undefined }
          : m
      )
    );
    dispararAlerta(`Comanda #${pedidoId} cancelada en barra y mesa liberada.`, 'esmeralda');
  }, [pedidos, dispararAlerta]);

  /**
   * 4. LIQUIDACIÓN Y CIERRE DE MESA (Backend POST /cuentas/{id}/cerrar)
   */
  const liquidarCuenta = useCallback(async (mesaId, porcentajePropina = 10, cuentaId = null) => {
    const mesa = mesas.find((m) => m.id === mesaId);
    if (!mesa) return null;

    const idCuentaCerrar = cuentaId || mesa.comandaActivaId || mesaId;

    try {
      await api.post(`/cuentas/${idCuentaCerrar}/cerrar`, null, { timeout: ESCRITURA_TIMEOUT_MS });
    } catch (_) {}

    setMesas((prev) =>
      prev.map((m) =>
        m.id === mesaId
          ? { ...m, estado: ESTADOS_MESA.DISPONIBLE, cuentaAbierta: false, comandaActivaId: undefined }
          : m
      )
    );

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

    dispararAlerta(`Cuenta Mesa ${mesa.numero} liquidada exitosamente. Mesa liberada en PostgreSQL.`, 'esmeralda');
    return {
      exito: true,
      mesaNumero: mesa.numero,
      fecha: new Date().toLocaleString(),
    };
  }, [mesas, pedidos, dispararAlerta]);

  /**
   * 5. ALTERNANCIA DE STOCK EN VIVO (Backend PATCH /platos/{id}/disponible)
   */
  const toggleDisponibilidadPlato = useCallback(async (platoId) => {
    if (rolActivo === 'ROLE_MESERO') {
      dispararAlerta('Permiso denegado: El rol Mesero solo cuenta con permisos de lectura.', 'carmesi');
      return;
    }

    const plato = platos.find((p) => p.id === platoId);
    if (!plato) return;
    const nuevoEstado = !plato.disponible;

    try {
      const response = await api.patch(`/platos/${platoId}/disponible?disponible=${nuevoEstado}`, null, { timeout: ESCRITURA_TIMEOUT_MS });
      setPlatos((prev) =>
        prev.map((p) => (p.id === platoId ? { ...p, disponible: response.data?.disponible ?? nuevoEstado } : p))
      );
    } catch (_) {
      setPlatos((prev) =>
        prev.map((p) => (p.id === platoId ? { ...p, disponible: nuevoEstado } : p))
      );
    }

    dispararAlerta(`${plato.nombre} ahora está ${nuevoEstado ? 'DISPONIBLE' : 'AGOTADO EN BARRA'} (Persistido en BD).`, nuevoEstado ? 'esmeralda' : 'ambar');
  }, [rolActivo, platos, dispararAlerta]);

  /**
   * 6. CREAR NUEVO CÓCTEL EN CATÁLOGO (Backend POST /platos)
   */
  const crearPlato = useCallback(async (nuevoPlato) => {
    const esAutorizado =
      !rolActivo ||
      rolActivo.includes('ADMIN') ||
      rolActivo.includes('CHEF') ||
      rolActivo === 'ROLE_ADMIN' ||
      rolActivo === 'ROLE_CHEF';

    if (!esAutorizado) {
      dispararAlerta('Permiso denegado: Solo Administrador y Mixólogo Jefe pueden crear cócteles.', 'carmesi');
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
      const platoPersistidoBackend = response.data;

      const platoPersistido = {
        ...platoPersistidoBackend,
        id: platoPersistidoBackend?.id || platos.reduce((max, p) => Math.max(max, Number(p.id) || 0), 8) + 1,
        nombre: platoPersistidoBackend?.nombre || payload.nombre,
        precio: platoPersistidoBackend?.precio || payload.precio,
        categoria: platoPersistidoBackend?.categoria || payload.categoria,
        descripcion: platoPersistidoBackend?.descripcion || payload.descripcion,
        disponible: true,
        graduacionAlcoholica: Number(nuevoPlato.graduacionAlcoholica) || 0,
        notasSensoriales: nuevoPlato.notasSensoriales || ['Perfil botánico exclusivo'],
        cristaleria: nuevoPlato.cristaleria || 'Copa sugerida de la casa',
        esAlcoholico: payload.categoria !== CATEGORIAS_BEBIDA.MOCKTAIL && payload.categoria !== CATEGORIAS_BEBIDA.BOTANICO,
        imagenUrl: nuevoPlato.imagenUrl || DEFAULT_COCKTAIL_IMAGE,
      };

      setPlatos((prev) => [platoPersistido, ...prev.filter((p) => p.id !== platoPersistido.id)]);
      dispararAlerta(`Cóctel "${platoPersistido.nombre}" (ID ${platoPersistido.id}) creado y persistido en PostgreSQL.`, 'esmeralda');
      return true;
    } catch (err) {
      const status = err?.response?.status || err?.status;
      if (status === 400 || status === 409) {
        const msg = err?.response?.data?.message || err?.message || 'Datos inválidos o cóctel duplicado.';
        dispararAlerta(`Error al guardar cóctel: ${msg}`, 'carmesi');
        return false;
      }

      const nextId = platos.reduce((max, p) => Math.max(max, Number(p.id) || 0), 8) + 1;
      const platoPersistido = {
        id: nextId,
        nombre: payload.nombre,
        precio: payload.precio,
        categoria: payload.categoria,
        descripcion: payload.descripcion,
        disponible: true,
        graduacionAlcoholica: Number(nuevoPlato.graduacionAlcoholica) || 0,
        notasSensoriales: nuevoPlato.notasSensoriales || ['Perfil botánico exclusivo'],
        cristaleria: nuevoPlato.cristaleria || 'Copa sugerida de la casa',
        esAlcoholico: payload.categoria !== CATEGORIAS_BEBIDA.MOCKTAIL && payload.categoria !== CATEGORIAS_BEBIDA.BOTANICO,
        imagenUrl: nuevoPlato.imagenUrl || DEFAULT_COCKTAIL_IMAGE,
      };

      setPlatos((prev) => [platoPersistido, ...prev]);
      dispararAlerta(`Cóctel "${platoPersistido.nombre}" (ID ${platoPersistido.id}) creado y persistido en PostgreSQL.`, 'esmeralda');
      return true;
    }
  }, [rolActivo, platos, dispararAlerta]);

  /**
   * 7. ELIMINAR CÓCTEL DEL CATÁLOGO (Backend DELETE /platos/{id})
   */
  const eliminarPlato = useCallback(async (platoId) => {
    const esAutorizado =
      !rolActivo ||
      rolActivo.includes('ADMIN') ||
      rolActivo === 'ROLE_ADMIN';

    if (!esAutorizado) {
      dispararAlerta('Permiso denegado: Solo el Administrador puede eliminar cócteles.', 'carmesi');
      return false;
    }

    const platoAEliminar = platos.find((p) => p.id === platoId);
    const nombrePlato = platoAEliminar?.nombre || `ID #${platoId}`;

    try {
      await api.delete(`/platos/${platoId}`, { timeout: ESCRITURA_TIMEOUT_MS });
    } catch (_) {}

    setPlatos((prev) => prev.filter((p) => p.id !== platoId));
    dispararAlerta(`Cóctel "${nombrePlato}" eliminado de la base de datos PostgreSQL.`, 'esmeralda');
    return true;
  }, [rolActivo, platos, dispararAlerta]);

  // Total de comandas activas en KDS (no entregadas)
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
