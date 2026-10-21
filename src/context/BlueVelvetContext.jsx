import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
// DATOS SEMILLA DE ALTA FIDELIDAD (SERVICIO NOCTURNO BLUE VELVET)
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
    disponible: false, // Demostración de producto agotado
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
  {
    id: 100,
    idMesa: 1,
    numeroMesa: 1,
    estado: ESTADOS_PEDIDO.LISTO,
    timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
    items: [
      {
        id: 200,
        idPlato: 4,
        nombrePlato: 'Macallan 12 Double Cask',
        precioCongelado: 72000,
        cantidad: 1,
        spiritBrandId: null,
        nombreDestilado: 'Servicio directo',
        spiritModificationsCount: 0,
        garnishes: [],
      },
    ],
  },
  {
    id: 99,
    idMesa: 5,
    numeroMesa: 5,
    estado: ESTADOS_PEDIDO.ENTREGADO,
    timestamp: new Date(Date.now() - 32 * 60000).toISOString(),
    items: [
      {
        id: 199,
        idPlato: 8,
        nombrePlato: 'Jardín Nocturno',
        precioCongelado: 36000,
        cantidad: 1,
        spiritModificationsCount: 0,
        garnishes: ['Piel de pomelo ruby'],
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
    detalles: 'Apertura de turno: Servicio Nocturno · Blue Velvet activo',
    fecha: new Date(Date.now() - 45 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: 'evt-02',
    tipoEvento: 'STOCK_MUTADO',
    entidadId: 'PLATO-9',
    usuario: 'Mixólogo Jefe',
    detalles: 'Producto Infusión de Lavanda Silvestre marcado como Agotado en barra',
    fecha: new Date(Date.now() - 38 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: 'evt-03',
    tipoEvento: 'COMANDA_ENVIADA',
    entidadId: 'PEDIDO-101',
    usuario: 'Mesero Principal',
    detalles: 'Nueva comanda despachada a barra para Mesa 2 (2 bebidas)',
    fecha: new Date(Date.now() - 12 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: 'evt-04',
    tipoEvento: 'KDS_MUTACION',
    entidadId: 'PEDIDO-101',
    usuario: 'Barman',
    detalles: 'Comanda #101 avanzó a EN PREPARACIÓN · Estado inmutable',
    fecha: new Date(Date.now() - 11 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: 'evt-05',
    tipoEvento: 'COMANDA_ENVIADA',
    entidadId: 'PEDIDO-102',
    usuario: 'Mesero Principal',
    detalles: 'Nueva comanda despachada a barra para Mesa 4 (2 bebidas)',
    fecha: new Date(Date.now() - 4 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export function BlueVelvetProvider({ children }) {
  const [platos, setPlatos] = useState(PLATOS_INICIALES);
  const [mesas, setMesas] = useState(MESAS_INICIALES);
  const [pedidos, setPedidos] = useState(PEDIDOS_KDS_INICIALES);
  const [eventosAuditoria, setEventosAuditoria] = useState(AUDITORIA_INICIAL);
  const [rolActivo, setRolActivo] = useState(ROLES_USUARIO.ROLE_ADMIN.id);
  const [mesaSeleccionadaId, setMesaSeleccionadaId] = useState(2);
  const [alertaFlotante, setAlertaFlotante] = useState(null);

  // Borrador de comanda temporal para la mesa seleccionada
  const [comandasBorrador, setComandasBorrador] = useState({});

  /**
   * Registro en el log de auditoría (espejo MongoDB eventos_restaurante)
   */
  const registrarAuditoria = useCallback((tipoEvento, entidadId, detalles) => {
    const usuarioNombre = ROLES_USUARIO[rolActivo]?.nombre || 'Operador';
    const nuevoEvento = {
      id: `evt-${Date.now()}`,
      tipoEvento,
      entidadId: String(entidadId),
      usuario: usuarioNombre,
      detalles,
      fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setEventosAuditoria((prev) => [nuevoEvento, ...prev.slice(0, 49)]);
  }, [rolActivo]);

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
   * Selección interactiva de mesa con validación de comanda única
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
   * Agregar cóctel personalizado al borrador de la comanda de una mesa
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

    registrarAuditoria(
      'ITEM_AGREGADO_BORRADOR',
      `MESA-${mesaId}`,
      `Bebida ${itemData.nombrePlato} preparada para agregar a Mesa ${mesaId}`
    );
  }, [registrarAuditoria]);

  /**
   * Eliminar ítem del borrador de la mesa
   */
  const removerItemDeComanda = useCallback((mesaId, itemId) => {
    setComandasBorrador((prev) => ({
      ...prev,
      [mesaId]: (prev[mesaId] || []).filter((it) => it.id !== itemId),
    }));
  }, []);

  /**
   * Despacha la comanda activa a la barra (KDS) en estado RECIBIDO
   */
  const enviarComandaABarra = useCallback((mesaId) => {
    const mesa = mesas.find((m) => m.id === mesaId);
    if (!mesa) return;

    // Verificar si ya tiene comanda abierta para no violar la invariante de 1 comanda por mesa
    if (mesa.estado === ESTADOS_MESA.OCUPADA && mesa.comandaActivaId) {
      const pedidoExistente = pedidos.find((p) => p.id === mesa.comandaActivaId && p.estado !== ESTADOS_PEDIDO.ENTREGADO);
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

    const nuevoPedidoId = Math.floor(100 + Math.random() * 900);
    const nuevoPedido = {
      id: nuevoPedidoId,
      idMesa: mesa.id,
      numeroMesa: mesa.numero,
      estado: ESTADOS_PEDIDO.RECIBIDO,
      timestamp: new Date().toISOString(),
      items: [...itemsBorrador],
    };

    // Marcar mesa como ocupada y enlazar la comanda
    setMesas((prev) =>
      prev.map((m) =>
        m.id === mesaId
          ? { ...m, estado: ESTADOS_MESA.OCUPADA, cuentaAbierta: true, comandaActivaId: nuevoPedidoId }
          : m
      )
    );

    // Agregar comanda al KDS
    setPedidos((prev) => [nuevoPedido, ...prev]);

    // Limpiar borrador
    setComandasBorrador((prev) => {
      const copia = { ...prev };
      delete copia[mesaId];
      return copia;
    });

    registrarAuditoria(
      'COMANDA_ENVIADA_BARRA',
      `PEDIDO-${nuevoPedidoId}`,
      `Nueva comanda enviada a barra (Mesa ${mesa.numero}) · ${itemsBorrador.length} bebidas`
    );

    dispararAlerta(`Comanda #${nuevoPedidoId} enviada a barra exitosamente.`, 'esmeralda');
  }, [mesas, pedidos, comandasBorrador, registrarAuditoria, dispararAlerta]);

  /**
   * Avance unidireccional de comandas en el KDS de Barra:
   * RECIBIDO -> EN_PREPARACION -> LISTO -> ENTREGADO
   */
  const avanzarEstadoPedido = useCallback((pedidoId) => {
    setPedidos((prev) =>
      prev.map((ped) => {
        if (ped.id !== pedidoId) return ped;

        let siguienteEstado = ped.estado;
        if (ped.estado === ESTADOS_PEDIDO.RECIBIDO) {
          siguienteEstado = ESTADOS_PEDIDO.EN_PREPARACION;
          registrarAuditoria(
            'KDS_EN_PREPARACION',
            `PEDIDO-${pedidoId}`,
            `Comanda #${pedidoId} (Mesa ${ped.numeroMesa}) pasó a EN PREPARACIÓN · Inmutable`
          );
        } else if (ped.estado === ESTADOS_PEDIDO.EN_PREPARACION) {
          siguienteEstado = ESTADOS_PEDIDO.LISTO;
          registrarAuditoria(
            'KDS_LISTO',
            `PEDIDO-${pedidoId}`,
            `Comanda #${pedidoId} marcada como LISTA para entrega en barra`
          );
        } else if (ped.estado === ESTADOS_PEDIDO.LISTO) {
          siguienteEstado = ESTADOS_PEDIDO.ENTREGADO;
          registrarAuditoria(
            'KDS_ENTREGADO',
            `PEDIDO-${pedidoId}`,
            `Comanda #${pedidoId} entregada a sala para el servicio de Mesa ${ped.numeroMesa}`
          );
        }

        return { ...ped, estado: siguienteEstado };
      })
    );
  }, [registrarAuditoria]);

  /**
   * Mutar destilado base (Solo permitido en RECIBIDO y máx 1 vez)
   */
  const mutarDestiladoBase = useCallback((pedidoId, itemId, nuevoDestiladoId) => {
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

    setPedidos((prev) =>
      prev.map((ped) => {
        if (ped.id !== pedidoId) return ped;

        const itemsActualizados = ped.items.map((it) => {
          if (it.id !== itemId) return it;
          if (it.spiritModificationsCount >= 1) {
            dispararAlerta('El destilado base ya ha sido modificado el máximo de 1 vez permitida.', 'ambar');
            return it;
          }
          return {
            ...it,
            spiritBrandId: destiladoObj.id,
            nombreDestilado: destiladoObj.nombre,
            spiritModificationsCount: it.spiritModificationsCount + 1,
          };
        });

        return { ...ped, items: itemsActualizados };
      })
    );

    registrarAuditoria(
      'DESTILADO_MUTADO',
      `PEDIDO-${pedidoId}`,
      `Destilado base mutado a ${destiladoObj.nombre} en Comanda #${pedidoId}`
    );

    dispararAlerta(`Destilado actualizado a ${destiladoObj.nombre} en la comanda.`, 'esmeralda');
  }, [pedidos, registrarAuditoria, dispararAlerta]);

  /**
   * Cancelar comanda (Solo permitida en estado RECIBIDO)
   */
  const cancelarComanda = useCallback((pedidoId) => {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    if (!pedido) return;

    if (pedido.estado === ESTADOS_PEDIDO.EN_PREPARACION) {
      dispararAlerta('Invariante violada (HTTP 422): No se puede cancelar una comanda que ya está en preparación.', 'carmesi');
      return;
    }

    if (pedido.estado !== ESTADOS_PEDIDO.RECIBIDO) {
      dispararAlerta('La comanda no puede ser cancelada en su estado actual.', 'carmesi');
      return;
    }

    setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));

    // Si la mesa no tiene otras comandas, liberarla
    setMesas((prev) =>
      prev.map((m) =>
        m.id === pedido.idMesa
          ? { ...m, estado: ESTADOS_MESA.DISPONIBLE, cuentaAbierta: false, comandaActivaId: undefined }
          : m
      )
    );

    registrarAuditoria(
      'COMANDA_CANCELADA',
      `PEDIDO-${pedidoId}`,
      `Comanda #${pedidoId} cancelada en barra y mesa liberada`
    );

    dispararAlerta(`Comanda #${pedidoId} cancelada exitosamente.`, 'esmeralda');
  }, [pedidos, registrarAuditoria, dispararAlerta]);

  /**
   * Liquidación atómica de cuenta:
   * 1. La cuenta pasa a estado PAGADA.
   * 2. La mesa física pasa automáticamente a estado DISPONIBLE.
   */
  const liquidarCuenta = useCallback((mesaId, porcentajePropina = 10) => {
    const mesa = mesas.find((m) => m.id === mesaId);
    if (!mesa) return null;

    // Buscar comanda activa o items de la mesa
    const pedidoActivo = pedidos.find(
      (p) => p.idMesa === mesaId && p.estado !== ESTADOS_PEDIDO.CANCELADO
    );

    const itemsACobrar = pedidoActivo ? pedidoActivo.items : comandasBorrador[mesaId] || [];
    const subtotal = itemsACobrar.reduce((acc, it) => acc + (it.precioCongelado || 0) * (it.cantidad || 1), 0);
    const propina = Math.round(subtotal * (porcentajePropina / 100));
    const totalFinal = subtotal + propina;

    // Liberar mesa atómicamente
    setMesas((prev) =>
      prev.map((m) =>
        m.id === mesaId
          ? { ...m, estado: ESTADOS_MESA.DISPONIBLE, cuentaAbierta: false, comandaActivaId: undefined }
          : m
      )
    );

    // Si había comanda en KDS, marcarla como entregada
    if (pedidoActivo) {
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoActivo.id ? { ...p, estado: ESTADOS_PEDIDO.ENTREGADO } : p))
      );
    }

    // Limpiar borrador si existía
    setComandasBorrador((prev) => {
      const copia = { ...prev };
      delete copia[mesaId];
      return copia;
    });

    registrarAuditoria(
      'CUENTA_LIQUIDADA',
      `MESA-${mesa.numero}`,
      `Cuenta Mesa ${mesa.numero} liquidada ($${totalFinal.toLocaleString()} COP) y mesa liberada`
    );

    return {
      exito: true,
      mesaNumero: mesa.numero,
      subtotal,
      propina,
      porcentajePropina,
      totalFinal,
      items: itemsACobrar,
      fecha: new Date().toLocaleString(),
    };
  }, [mesas, pedidos, comandasBorrador, registrarAuditoria]);

  /**
   * Alternar disponibilidad de un cóctel (PATCH /api/v1/platos/{id}/disponible)
   */
  const toggleDisponibilidadPlato = useCallback((platoId) => {
    // Verificación RBAC: solo ADMIN, CHEF y BARTENDER pueden alterar stock
    if (rolActivo === 'ROLE_MESERO') {
      dispararAlerta('Permiso denegado: El rol Mesero solo cuenta con permisos de lectura.', 'carmesi');
      return;
    }

    setPlatos((prev) =>
      prev.map((plato) => {
        if (plato.id !== platoId) return plato;
        const nuevoEstado = !plato.disponible;

        registrarAuditoria(
          'DISPONIBILIDAD_ALTERADA',
          `PLATO-${plato.id}`,
          `Stock de ${plato.nombre} cambiado a ${nuevoEstado ? 'Disponible' : 'Agotado en barra'}`
        );

        dispararAlerta(
          `${plato.nombre} ahora está ${nuevoEstado ? 'DISPONIBLE' : 'AGOTADO EN BARRA'}.`,
          nuevoEstado ? 'esmeralda' : 'ambar'
        );

        return { ...plato, disponible: nuevoEstado };
      })
    );
  }, [rolActivo, registrarAuditoria, dispararAlerta]);

  /**
   * Crear nuevo cóctel en catálogo (Validaciones Jakarta del backend)
   */
  const crearPlato = useCallback((nuevoPlato) => {
    if (rolActivo !== 'ROLE_ADMIN' && rolActivo !== 'ROLE_CHEF') {
      dispararAlerta('Permiso denegado: Solo Administrador y Mixólogo Jefe pueden crear cócteles.', 'carmesi');
      return false;
    }

    if (!nuevoPlato.nombre?.trim()) {
      dispararAlerta('El nombre del cóctel es obligatorio.', 'carmesi');
      return false;
    }

    const existe = platos.some(
      (p) => p.nombre.toLowerCase().trim() === nuevoPlato.nombre.toLowerCase().trim()
    );
    if (existe) {
      dispararAlerta('Ya existe una creación con ese nombre en la carta.', 'carmesi');
      return false;
    }

    const precioNum = Number(nuevoPlato.precio);
    if (!precioNum || precioNum <= 0) {
      dispararAlerta('El precio debe ser un valor numérico mayor a cero.', 'carmesi');
      return false;
    }

    if (!nuevoPlato.descripcion?.trim()) {
      dispararAlerta('El perfil sensorial y notas de cata son obligatorios.', 'carmesi');
      return false;
    }

    const platoCreado = {
      id: Date.now(),
      nombre: nuevoPlato.nombre.trim(),
      categoria: nuevoPlato.categoria || CATEGORIAS_BEBIDA.COCTEL_AUTOR,
      precio: precioNum,
      descripcion: nuevoPlato.descripcion.trim(),
      graduacionAlcoholica: Number(nuevoPlato.graduacionAlcoholica) || 0,
      notasSensoriales: nuevoPlato.notasSensoriales || ['Perfil exclusivo'],
      cristaleria: nuevoPlato.cristaleria || 'Copa sugerida de la casa',
      disponible: true,
      esAlcoholico: nuevoPlato.categoria !== CATEGORIAS_BEBIDA.MOCKTAIL && nuevoPlato.categoria !== CATEGORIAS_BEBIDA.BOTANICO,
      imagenUrl:
        nuevoPlato.imagenUrl ||
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    };

    setPlatos((prev) => [platoCreado, ...prev]);

    registrarAuditoria(
      'NUEVO_COCTEL_CREADO',
      `PLATO-${platoCreado.id}`,
      `Nueva creación incorporada al catálogo: ${platoCreado.nombre} ($${platoCreado.precio.toLocaleString()} COP)`
    );

    dispararAlerta(`Cóctel "${platoCreado.nombre}" incorporado exitosamente a la carta.`, 'esmeralda');
    return true;
  }, [rolActivo, platos, registrarAuditoria, dispararAlerta]);

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
    setRolActivo,
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
