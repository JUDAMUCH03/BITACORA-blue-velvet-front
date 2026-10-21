/**
 * Modelos de Dominio de Blue Velvet — Coctelería de Autor
 * Conformes con Spring Boot 3 / MongoDB
 */

/**
 * @typedef {'COCTEL_AUTOR' | 'DESTILADO_PREMIUM' | 'MOCKTAIL' | 'BOTANICO'} CategoriaBebida
 * @typedef {'RECIBIDO' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'CANCELADO'} EstadoPedido
 * @typedef {'DISPONIBLE' | 'OCUPADA'} EstadoMesa
 * @typedef {'ABIERTA' | 'PAGADA'} EstadoCuenta
 * @typedef {'ROLE_ADMIN' | 'ROLE_CHEF' | 'ROLE_BARTENDER' | 'ROLE_MESERO'} RolUsuario
 */

export const CATEGORIAS_BEBIDA = {
  COCTEL_AUTOR: 'COCTEL_AUTOR',
  DESTILADO_PREMIUM: 'DESTILADO_PREMIUM',
  MOCKTAIL: 'MOCKTAIL',
  BOTANICO: 'BOTANICO',
};

export const ESTADOS_PEDIDO = {
  RECIBIDO: 'RECIBIDO',
  EN_PREPARACION: 'EN_PREPARACION',
  LISTO: 'LISTO',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
};

export const ESTADOS_MESA = {
  DISPONIBLE: 'DISPONIBLE',
  OCUPADA: 'OCUPADA',
};

export const ROLES_USUARIO = {
  ROLE_ADMIN: {
    id: 'ROLE_ADMIN',
    nombre: 'Administrador',
    descripcion: 'Control total de cartas, comandas, mesas y auditoría',
  },
  ROLE_CHEF: {
    id: 'ROLE_CHEF',
    nombre: 'Mixólogo Jefe',
    descripcion: 'Gestión de catálogo, disponibilidad de recetas y formulaciones',
  },
  ROLE_BARTENDER: {
    id: 'ROLE_BARTENDER',
    nombre: 'Barman',
    descripcion: 'Operación del KDS de barra y control de stock rápido',
  },
  ROLE_MESERO: {
    id: 'ROLE_MESERO',
    nombre: 'Mesero',
    descripcion: 'Toma de comandas en sala, servicio y solicitud de liquidación',
  },
};

/**
 * Lista de destilados base premium disponibles en barra
 */
export const DESTILADOS_BASE_CATALOGO = [
  { id: 1, nombre: "Hendrick's Gin", origen: 'Escocia', notas: 'Pepino y pétalos de rosa damascena' },
  { id: 2, nombre: 'Mezcal Ojo de Tigre', origen: 'Oaxaca, México', notas: 'Agave espadín y tobalá ahumado' },
  { id: 3, nombre: "Maker's Mark Bourbon", origen: 'Kentucky, EE. UU.', notas: 'Trigo rojo de invierno y vainilla' },
  { id: 4, nombre: 'Ron Zacapa 23', origen: 'Guatemala', notas: 'Miel virgen de caña en solera añeja' },
  { id: 5, nombre: 'Tequila Don Julio 70', origen: 'Jalisco, México', notas: 'Añejo cristalino con notas cítricas' },
];

/**
 * Garnishes / guarniciones botánicas disponibles (máximo 2 por cóctel)
 */
export const GUARNICIONES_BOTANICAS = [
  'Twist de naranja deshidratada',
  'Rama de romero flameado',
  'Pétalos de rosa comestibles',
  'Humo de roble en campana',
  'Piel de pomelo ruby',
  'Brotes de shiso morado',
];
