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
    graduacionAlcoholica: 0.0,
    notasSensoriales: ['Fresco floral', 'Clarificado cítrico', 'Sedoso jazmín'],
    cristaleria: 'Copa balón esmerilada',
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
    graduacionAlcoholica: 0.0,
    notasSensoriales: ['Balsámico herbáceo', 'Sauco silvestre', 'Bergamota noble'],
    cristaleria: 'Vaso Collins con varilla tallada',
    disponible: true,
    imagenUrl: COCKTAIL_IMAGE_MAP[8],
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
        precioCongelado: 45000,
        cantidad: 1,
        spiritBrandId: 3,
        nombreDestilado: "Maker's Mark Bourbon",
        spiritModificationsCount: 0,
        garnishes: ['Humo de roble en campana', 'Twist de naranja deshidratada'],
      },
      {
        id: 202,
        idPlato: 7,
        nombrePlato: 'Velvet Cloud 0.0%',
        precioCongelado: 28000,
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
        nombrePlato: 'Velvet Negroni Botánico',
        precioCongelado: 42000,
        cantidad: 1,
        spiritBrandId: 1,
        nombreDestilado: "Hendrick's Gin",
        spiritModificationsCount: 0,
        garnishes: ['Twist de naranja deshidratada', 'Rama de romero flameado'],
      },
      {
        id: 204,
        idPlato: 4,
        nombrePlato: 'Mezcalita Floral Oaxaqueña',
        precioCongelado: 40000,
        cantidad: 1,
        spiritBrandId: 5,
        nombreDestilado: 'Mezcal 400 Conejos',
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
        const platosEnriquecidos = resMenu.value.data.map((p) => ({
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
      nombre: nuevoPlato.nombre.trim(),
      precio: precioNum,
      categoria: nuevoPlato.categoria || CATEGORIAS_BEBIDA.COCTEL_AUTOR,
      descripcion: nuevoPlato.descripcion?.trim() || 'Cóctel de autor Blue Velvet',
    };

    try {
      const response = await api.post('/platos', payload);
      // Sincronización inmediata con PostgreSQL (GET /platos)
      try {
        const resPlatos = await api.get('/platos');
        if (Array.isArray(resPlatos.data) && resPlatos.data.length > 0) {
          const platosEnriquecidos = resPlatos.data.map((p) => ({
            ...p,
            imagenUrl: p.imagenUrl || COCKTAIL_IMAGE_MAP[p.id] || nuevoPlato.imagenUrl || DEFAULT_COCKTAIL_IMAGE,
            graduacionAlcoholica:
              p.graduacionAlcoholica ??
              (p.categoria === CATEGORIAS_BEBIDA.MOCKTAIL || p.categoria === CATEGORIAS_BEBIDA.BOTANICO ? 0 : 25),
            esAlcoholico:
              p.categoria !== CATEGORIAS_BEBIDA.MOCKTAIL && p.categoria !== CATEGORIAS_BEBIDA.BOTANICO,
          }));
          setPlatos(platosEnriquecidos);
        } else {
          const platoPersistido = {
            ...response.data,
            graduacionAlcoholica: Number(nuevoPlato.graduacionAlcoholica) || 0,
            notasSensoriales: nuevoPlato.notasSensoriales || ['Perfil botánico exclusivo'],
            cristaleria: nuevoPlato.cristaleria || 'Copa sugerida de la casa',
            esAlcoholico: nuevoPlato.categoria !== CATEGORIAS_BEBIDA.MOCKTAIL && nuevoPlato.categoria !== CATEGORIAS_BEBIDA.BOTANICO,
            imagenUrl: nuevoPlato.imagenUrl || DEFAULT_COCKTAIL_IMAGE,
          };
          setPlatos((prev) => [platoPersistido, ...prev]);
        }
      } catch {
        const platoPersistido = {
          ...response.data,
          graduacionAlcoholica: Number(nuevoPlato.graduacionAlcoholica) || 0,
          notasSensoriales: nuevoPlato.notasSensoriales || ['Perfil botánico exclusivo'],
          cristaleria: nuevoPlato.cristaleria || 'Copa sugerida de la casa',
          esAlcoholico: nuevoPlato.categoria !== CATEGORIAS_BEBIDA.MOCKTAIL && nuevoPlato.categoria !== CATEGORIAS_BEBIDA.BOTANICO,
          imagenUrl: nuevoPlato.imagenUrl || DEFAULT_COCKTAIL_IMAGE,
        };
        setPlatos((prev) => [platoPersistido, ...prev]);
      }
      dispararAlerta(`Cóctel "${nuevoPlato.nombre}" creado y persistido en la base de datos PostgreSQL.`, 'esmeralda');
      return true;
    } catch (err) {
      console.warn('[BlueVelvetContext] Fallback al crear plato:', err);
      const platoFallback = {
        id: Date.now(),
        ...payload,
        disponible: true,
        graduacionAlcoholica: Number(nuevoPlato.graduacionAlcoholica) || 0,
        notasSensoriales: nuevoPlato.notasSensoriales || ['Perfil botánico exclusivo'],
        cristaleria: nuevoPlato.cristaleria || 'Copa sugerida de la casa',
        esAlcoholico: nuevoPlato.categoria !== CATEGORIAS_BEBIDA.MOCKTAIL && nuevoPlato.categoria !== CATEGORIAS_BEBIDA.BOTANICO,
        imagenUrl: nuevoPlato.imagenUrl || DEFAULT_COCKTAIL_IMAGE,
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
