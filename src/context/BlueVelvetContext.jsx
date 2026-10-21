import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
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

// =========================================================================
// DATOS SEMILLA DE ALTA FIDELIDAD PARA CONTINGENCIA / MODO OFFLINE
// =========================================================================

const PLATOS_INICIALES = [
  {
    id: 1,
    nombre: 'Smoked Old Fashioned',
    categoria: CATEGORIAS_BEBIDA.COCTEL_AUTOR,
    precio: 48000,
    descripcion: 'Bourbon en infusión de haba tonka, amargo de cacao criollo y ahumado en campana de roble americano.',
    graduacionAlcoholica: 32,
    notasSensoriales: ['Ahumado profundo', 'Vainilla noble', 'Naranja quemada'],
    cristaleria: 'Vaso Old Fashioned de cristal tallado',
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    esAlcoholico: true,
  },
  {
    id: 2,
    nombre: 'Negroni Botánico de la Casa',
    categoria: CATEGORIAS_BEBIDA.COCTEL_AUTOR,
    precio: 46000,
    descripcion: 'Gin botánico destilado al vacío, amargo artesanal de alcachofa, vermut dulce añejo y aceites esenciales de pomelo.',
    graduacionAlcoholica: 28,
    notasSensoriales: ['Herbal amargo', 'Cítrico persistente', 'Corteza de pino'],
    cristaleria: 'Vaso bajo con prisma de hielo cristalino',
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    esAlcoholico: true,
  },
  {
    id: 3,
    nombre: 'Clover Club Blue Velvet',
    categoria: CATEGORIAS_BEBIDA.COCTEL_AUTOR,
    precio: 45000,
    descripcion: 'Gin seco macerado en moras de páramo, cordial de frambuesa silvestre, clara emulsionada y polvo de oro puro.',
    graduacionAlcoholica: 22,
    notasSensoriales: ['Aterciopelado', 'Frutos rojos secos', 'Toque floral'],
    cristaleria: 'Copa Coupé vintage',
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    esAlcoholico: true,
  },
  {
    id: 4,
    nombre: 'Macallan 12 Double Cask',
    categoria: CATEGORIAS_BEBIDA.DESTILADO_PREMIUM,
    precio: 72000,
    descripcion: 'Whisky escocés de malta única criado en barricas de roble americano y europeo sazonadas con jerez oloroso.',
    graduacionAlcoholica: 40,
    notasSensoriales: ['Caramelo suave', 'Jengibre dulce', 'Nuez moscada'],
    cristaleria: 'Copa Glencairn de degustación',
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80',
    esAlcoholico: true,
  },
  {
    id: 5,
    nombre: 'Ron Zacapa Centenario XO',
    categoria: CATEGORIAS_BEBIDA.DESTILADO_PREMIUM,
    precio: 88000,
    descripcion: 'Mezcla de rones de 6 a 25 años afinado en barricas de coñac francés. Notas melosas inconfundibles.',
    graduacionAlcoholica: 40,
    notasSensoriales: ['Cacao tostado', 'Fruta pasificada', 'Cedro añejo'],
    cristaleria: 'Copa Snifter tibia',
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
    esAlcoholico: true,
  },
  {
    id: 6,
    nombre: 'Velvet Cloud Mocktail 0.0%',
    categoria: CATEGORIAS_BEBIDA.MOCKTAIL,
    precio: 34000,
    descripcion: 'Destilado botánico sin alcohol 0.0%, hidrolato de azahar, pulpa de lichi perfumada y nube etérea de vapor botánico.',
    graduacionAlcoholica: 0.0,
    notasSensoriales: ['Fresco floral', 'Cero astringencia', 'Dulzor sedoso'],
    cristaleria: 'Copa balón esmerilada',
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
    esAlcoholico: false,
  },
  {
    id: 7,
    nombre: 'Elixir Cítrico de Romero 0.0%',
    categoria: CATEGORIAS_BEBIDA.MOCKTAIL,
    precio: 32000,
    descripcion: 'Cordial casero de romero de huerto, reducción de pomelo ruby y agua tónica botánica de quinina salvaje.',
    graduacionAlcoholica: 0.0,
    notasSensoriales: ['Balsámico herbáceo', 'Cítrico efervescente', 'Amargor suave'],
    cristaleria: 'Vaso Collins con varilla tallada',
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    esAlcoholico: false,
  },
  {
    id: 8,
    nombre: 'Jardín Nocturno',
    categoria: CATEGORIAS_BEBIDA.BOTANICO,
    precio: 36000,
    descripcion: 'Infusión en frío de flor de saúco, pepino persa macerado, gotas de clorofila pura y rocío de limón sutil.',
    graduacionAlcoholica: 0.0,
    notasSensoriales: ['Extremadamente fresco', 'Vegetal noble', 'Fragancia verde'],
    cristaleria: 'Copa de degustación amplia',
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
    esAlcoholico: false,
  },
  {
    id: 9,
    nombre: 'Infusión de Lavanda Silvestre',
    categoria: CATEGORIAS_BEBIDA.BOTANICO,
    precio: 35000,
    descripcion: 'Flores de lavanda andina, cordial de jengibre y manzana verde prensada en frío.',
    graduacionAlcoholica: 0.0,
    notasSensoriales: ['Floral balsámico', 'Picante tenue', 'Acidez brillante'],
    cristaleria: 'Vaso bajo con esfera de hielo',
    disponible: false,
    imagenUrl: 'https://images.unsplash.com/photo-1587888637140-849b25d80ef9?auto=format&fit=crop&w=800&q=80',
    esAlcoholico: false,
  },
];

const MESAS_INICIALES = [
  { id: 1, numero: 1, capacidad: 2, estado: ESTADOS_MESA.DISPONIBLE, cuentaAbierta: false },
  { id: 2, numero: 2, capacidad: 4, estado: ESTADOS_MESA.OCUPADA, cuentaAbierta: true, comandaActivaId: 101 },
  { id: 3, numero: 3, capacidad: 2, estado: ESTADOS_MESA.DISPONIBLE, cuentaAbierta: false },
  { id: 4, numero: 4, capacidad: 6, estado: ESTADOS_MESA.OCUPADA, cuentaAbierta: true, comandaActivaId: 102 },
  { id: 5, numero: 5, capacidad: 4, estado: ESTADOS_MESA.DISPONIBLE, cuentaAbierta: false },
  { id: 6, numero: 6, capacidad: 8, estado: ESTADOS_MESA.DISPONIBLE, cuentaAbierta: false, zona: 'Cava Privada' },
  { id: 7, numero: 7, capacidad: 1, estado: ESTADOS_MESA.DISPONIBLE, cuentaAbierta: false, zona: 'Barra 1' },
  { id: 8, numero: 8, capacidad: 1, estado: ESTADOS_MESA.DISPONIBLE, cuentaAbierta: false, zona: 'Barra 2' },
];

const PEDIDOS_KDS_INICIALES = [
  {
    id: 101,
    idMesa: 2,
    numeroMesa: 2,
    estado: ESTADOS_PEDIDO.EN_PREPARACION,
    timestamp: new Date(Date.now() - 11 * 60000).toISOString(),
    items: [
      {
        id: 201,
        idPlato: 1,
        nombrePlato: 'Smoked Old Fashioned',
        precioCongelado: 48000,
        cantidad: 1,
        spiritBrandId: 3,
        nombreDestilado: "Maker's Mark Bourbon",
        spiritModificationsCount: 0,
        garnishes: ['Humo de roble en campana', 'Twist de naranja deshidratada'],
      },
      {
        id: 202,
        idPlato: 6,
        nombrePlato: 'Velvet Cloud Mocktail 0.0%',
        precioCongelado: 34000,
        cantidad: 1,
        spiritModificationsCount: 0,
        garnishes: ['Pétalos de rosa comestibles'],
      },
    ],
  },
  {
    id: 102,
    idMesa: 4,
    numeroMesa: 4,
    estado: ESTADOS_PEDIDO.RECIBIDO,
    timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
    items: [
      {
        id: 203,
        idPlato: 2,
        nombrePlato: 'Negroni Botánico de la Casa',
        precioCongelado: 46000,
        cantidad: 1,
        spiritBrandId: 1,
        nombreDestilado: "Hendrick's Gin",
        spiritModificationsCount: 0,
        garnishes: ['Twist de naranja deshidratada', 'Rama de romero flameado'],
      },
      {
        id: 204,
        idPlato: 3,
        nombrePlato: 'Clover Club Blue Velvet',
        precioCongelado: 45000,
        cantidad: 1,
        spiritBrandId: 1,
        nombreDestilado: "Hendrick's Gin",
        spiritModificationsCount: 0,
        garnishes: ['Pétalos de rosa comestibles'],
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
  // 1. Vinculación estricta con AuthContext (RBAC Criptográfico JWT)
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

      if (resMenu.status === 'fulfilled' && Array.isArray(resMenu.value.data) && resMenu.value.data.length > 0) {
        setPlatos(resMenu.value.data);
      }

      if (resMesas.status === 'fulfilled' && Array.isArray(resMesas.value.data) && resMesas.value.data.length > 0) {
        setMesas(resMesas.value.data);
      }

      if (resPedidos.status === 'fulfilled' && Array.isArray(resPedidos.value.data) && resPedidos.value.data.length > 0) {
        setPedidos(resPedidos.value.data);
      }

      // Si es rol ADMIN, consultar eventos de auditoría en MongoDB
      if (rolActivo === 'ROLE_ADMIN') {
        try {
          const resAudit = await api.get('/auditoria');
          if (Array.isArray(resAudit.data) && resAudit.data.length > 0) {
            setEventosAuditoria(resAudit.data);
          }
        } catch (_) {}
      }
    } catch (err) {
      console.warn('[BlueVelvetContext] Conexión en modo contingencia:', err);
      dispararAlerta('Modo fuera de línea · Operando con datos locales de contingencia', 'ambar');
    } finally {
      setCargandoInicial(false);
    }
  }, [rolActivo, dispararAlerta]);

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
        id: Date.now() + Math.random(),
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
   * 1. DESPACHO REAL DE COMANDAS (Sala ➔ Backend Spring Boot POST /pedidos)
   */
  const enviarComandaABarra = useCallback(async (mesaId) => {
    const mesa = mesas.find((m) => m.id === mesaId);
    if (!mesa) return;

    if (mesa.estado === ESTADOS_MESA.OCUPADA && mesa.comandaActivaId) {
      const pedidoExistente = pedidos.find(
        (p) => p.id === mesa.comandaActivaId && p.estado !== ESTADOS_PEDIDO.ENTREGADO
      );
      if (pedidoExistente) {
        dispararAlerta(`La mesa ${mesa.numero} ya cuenta con comanda #${pedidoExistente.id} abierta en servicio.`, 'carmesi');
        return;
      }
    }

    const itemsBorrador = comandasBorrador[mesaId] || [];
    if (itemsBorrador.length === 0) {
      dispararAlerta(`No hay bebidas agregadas a la comanda de la mesa ${mesa.numero}.`, 'ambar');
      return;
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
      const response = await api.post('/pedidos', payload);
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
    } catch (err) {
      console.warn('[BlueVelvetContext] Fallback al persistir comanda:', err);
      // Fallback local en caso de desconexión
      const nuevoPedidoId = Math.floor(100 + Math.random() * 900);
      const nuevoPedido = {
        id: nuevoPedidoId,
        idMesa: mesa.id,
        numeroMesa: mesa.numero,
        estado: ESTADOS_PEDIDO.RECIBIDO,
        timestamp: new Date().toISOString(),
        items: [...itemsBorrador],
      };

      setPedidos((prev) => [nuevoPedido, ...prev]);
      setMesas((prev) =>
        prev.map((m) =>
          m.id === mesaId
            ? { ...m, estado: ESTADOS_MESA.OCUPADA, cuentaAbierta: true, comandaActivaId: nuevoPedidoId }
            : m
        )
      );

      setComandasBorrador((prev) => {
        const copia = { ...prev };
        delete copia[mesaId];
        return copia;
      });

      dispararAlerta(`Comanda #${nuevoPedidoId} enviada a barra (Modo local).`, 'ambar');
    }
  }, [mesas, pedidos, comandasBorrador, dispararAlerta]);

  /**
   * 2. AVANCE UNIDIRECCIONAL KDS REAL (Barra ➔ Backend PATCH /pedidos/{id}/estado)
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
      const response = await api.patch(`/pedidos/${pedidoId}/estado`, { nuevoEstado: siguienteEstado });
      setPedidos((prev) => prev.map((p) => (p.id === pedidoId ? response.data : p)));
      dispararAlerta(`Comanda #${pedidoId} avanzó a ${siguienteEstado} (Persistido en KDS).`, 'esmeralda');
    } catch (err) {
      console.warn('[BlueVelvetContext] Fallback al avanzar estado KDS:', err);
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado: siguienteEstado } : p))
      );
      dispararAlerta(`Comanda #${pedidoId} avanzó a ${siguienteEstado} (Modo local).`, 'ambar');
    }
  }, [pedidos, dispararAlerta]);

  /**
   * 3. MUTACIÓN DE DESTILADOS REAL (Barra/Sala ➔ Backend PATCH /pedidos/{id}/items/{itemId}/destilado)
   */
  const mutarDestiladoBase = useCallback(async (pedidoId, itemId, nuevoDestiladoId, motivo = 'Preferencia del cliente') => {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    if (!pedido) return;

    if (pedido.estado === ESTADOS_PEDIDO.EN_PREPARACION) {
      dispararAlerta('Operación denegada (HTTP 422): La bebida está en preparación y es estrictamente inmutable.', 'carmesi');
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
      });
      setPedidos((prev) => prev.map((p) => (p.id === pedidoId ? response.data : p)));
      dispararAlerta(`Destilado mutado a ${destiladoObj.nombre} (Persistido en PostgreSQL / MongoDB).`, 'esmeralda');
    } catch (err) {
      console.warn('[BlueVelvetContext] Fallback al mutar destilado:', err);
      setPedidos((prev) =>
        prev.map((ped) => {
          if (ped.id !== pedidoId) return ped;
          const itemsActualizados = ped.items.map((it) => {
            if (it.id !== itemId) return it;
            return {
              ...it,
              spiritBrandId: destiladoObj.id,
              nombreDestilado: destiladoObj.nombre,
              spiritModificationsCount: (it.spiritModificationsCount || 0) + 1,
            };
          });
          return { ...ped, items: itemsActualizados };
        })
      );
      dispararAlerta(`Destilado actualizado a ${destiladoObj.nombre} (Modo local).`, 'ambar');
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
      await api.patch(`/pedidos/${pedidoId}/estado`, { nuevoEstado: ESTADOS_PEDIDO.CANCELADO });
      setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
      setMesas((prev) =>
        prev.map((m) =>
          m.id === pedido.idMesa
            ? { ...m, estado: ESTADOS_MESA.DISPONIBLE, cuentaAbierta: false, comandaActivaId: undefined }
            : m
        )
      );
      dispararAlerta(`Comanda #${pedidoId} cancelada en barra y mesa liberada.`, 'esmeralda');
    } catch (err) {
      setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
      setMesas((prev) =>
        prev.map((m) =>
          m.id === pedido.idMesa
            ? { ...m, estado: ESTADOS_MESA.DISPONIBLE, cuentaAbierta: false, comandaActivaId: undefined }
            : m
        )
      );
      dispararAlerta(`Comanda #${pedidoId} cancelada localmente.`, 'ambar');
    }
  }, [pedidos, dispararAlerta]);

  /**
   * 4. LIQUIDACIÓN Y CIERRE DE MESA REAL (Backend POST /cuentas/{id}/cerrar)
   */
  const liquidarCuenta = useCallback(async (mesaId, porcentajePropina = 10, cuentaId = null) => {
    const mesa = mesas.find((m) => m.id === mesaId);
    if (!mesa) return null;

    const idCuentaCerrar = cuentaId || mesa.comandaActivaId || mesaId;

    try {
      await api.post(`/cuentas/${idCuentaCerrar}/cerrar`);
      const resMesas = await api.get('/mesas');
      if (Array.isArray(resMesas.data)) {
        setMesas(resMesas.data);
      }
      dispararAlerta(`Cuenta Mesa ${mesa.numero} liquidada en el servidor. Mesa liberada en PostgreSQL.`, 'esmeralda');
    } catch (err) {
      console.warn('[BlueVelvetContext] Fallback al liquidar cuenta:', err);
      setMesas((prev) =>
        prev.map((m) =>
          m.id === mesaId
            ? { ...m, estado: ESTADOS_MESA.DISPONIBLE, cuentaAbierta: false, comandaActivaId: undefined }
            : m
        )
      );
      dispararAlerta(`Cuenta Mesa ${mesa.numero} liquidada (Modo local). Mesa liberada.`, 'ambar');
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
      const response = await api.patch(`/platos/${platoId}/disponible?disponible=${nuevoEstado}`);
      setPlatos((prev) =>
        prev.map((p) => (p.id === platoId ? { ...p, disponible: response.data.disponible } : p))
      );
      dispararAlerta(`${plato.nombre} ahora está ${nuevoEstado ? 'DISPONIBLE' : 'AGOTADO EN BARRA'} (Persistido en BD).`, nuevoEstado ? 'esmeralda' : 'ambar');
    } catch (err) {
      console.warn('[BlueVelvetContext] Fallback al alternar stock:', err);
      setPlatos((prev) =>
        prev.map((p) => (p.id === platoId ? { ...p, disponible: nuevoEstado } : p))
      );
      dispararAlerta(`${plato.nombre} cambiado a ${nuevoEstado ? 'DISPONIBLE' : 'AGOTADO EN BARRA'} (Modo local).`, nuevoEstado ? 'esmeralda' : 'ambar');
    }
  }, [rolActivo, platos, dispararAlerta]);

  /**
   * 6. CREAR NUEVO CÓCTEL EN CATÁLOGO (Backend POST /platos)
   */
  const crearPlato = useCallback(async (nuevoPlato) => {
    if (rolActivo !== 'ROLE_ADMIN' && rolActivo !== 'ROLE_CHEF') {
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
      nombre: nuevoPlato.nombre.trim(),
      precio: precioNum,
      categoria: nuevoPlato.categoria || CATEGORIAS_BEBIDA.COCTEL_AUTOR,
      descripcion: nuevoPlato.descripcion?.trim() || 'Cóctel de autor Blue Velvet',
    };

    try {
      const response = await api.post('/platos', payload);
      const platoPersistido = {
        ...response.data,
        graduacionAlcoholica: Number(nuevoPlato.graduacionAlcoholica) || 0,
        notasSensoriales: nuevoPlato.notasSensoriales || ['Perfil exclusivo'],
        cristaleria: nuevoPlato.cristaleria || 'Copa sugerida de la casa',
        esAlcoholico: nuevoPlato.categoria !== CATEGORIAS_BEBIDA.MOCKTAIL && nuevoPlato.categoria !== CATEGORIAS_BEBIDA.BOTANICO,
        imagenUrl: nuevoPlato.imagenUrl || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
      };
      setPlatos((prev) => [platoPersistido, ...prev]);
      dispararAlerta(`Cóctel "${platoPersistido.nombre}" creado y persistido en la base de datos.`, 'esmeralda');
      return true;
    } catch (err) {
      console.warn('[BlueVelvetContext] Fallback al crear plato:', err);
      const platoFallback = {
        id: Date.now(),
        ...payload,
        disponible: true,
        graduacionAlcoholica: Number(nuevoPlato.graduacionAlcoholica) || 0,
        notasSensoriales: nuevoPlato.notasSensoriales || ['Perfil exclusivo'],
        cristaleria: nuevoPlato.cristaleria || 'Copa sugerida de la casa',
        esAlcoholico: nuevoPlato.categoria !== CATEGORIAS_BEBIDA.MOCKTAIL && nuevoPlato.categoria !== CATEGORIAS_BEBIDA.BOTANICO,
        imagenUrl: nuevoPlato.imagenUrl || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
      };
      setPlatos((prev) => [platoFallback, ...prev]);
      dispararAlerta(`Cóctel "${platoFallback.nombre}" incorporado (Modo local).`, 'ambar');
      return true;
    }
  }, [rolActivo, dispararAlerta]);

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
