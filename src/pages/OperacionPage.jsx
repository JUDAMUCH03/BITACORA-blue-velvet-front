import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import OperacionLayout, { MODULOS_SISTEMA } from '../components/common/OperacionLayout';
import ModuloCarta from '../components/modulos/ModuloCarta';
import ModuloSala from '../components/modulos/ModuloSala';
import ModuloBarra from '../components/modulos/ModuloBarra';
import ModuloLiquidacion from '../components/modulos/ModuloLiquidacion';
import ModuloCatalogo from '../components/modulos/ModuloCatalogo';

/**
 * Vista Operativa Maestra de Blue Velvet — Coctelería de Autor
 * Conecta los 5 módulos del servicio nocturno con navegación sincronizada.
 */
export default function OperacionPage({ moduloInicial = MODULOS_SISTEMA.CARTA }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const moduloURL = searchParams.get('modulo')?.toUpperCase();

  const [moduloActivo, setModuloActivo] = useState(
    MODULOS_SISTEMA[moduloURL] || moduloInicial
  );
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Sincronizar parámetro URL si cambia externamente
  useEffect(() => {
    if (moduloURL && MODULOS_SISTEMA[moduloURL] && MODULOS_SISTEMA[moduloURL] !== moduloActivo) {
      setModuloActivo(MODULOS_SISTEMA[moduloURL]);
    }
  }, [moduloURL]);

  const handleCambiarModulo = (nuevoModulo) => {
    setModuloActivo(nuevoModulo);
    setSearchParams({ modulo: nuevoModulo.toLowerCase() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <OperacionLayout
      moduloActivo={moduloActivo}
      onCambiarModulo={handleCambiarModulo}
      terminoBusqueda={terminoBusqueda}
      onCambiarBusqueda={setTerminoBusqueda}
    >
      {moduloActivo === MODULOS_SISTEMA.CARTA && (
        <ModuloCarta terminoBusqueda={terminoBusqueda} />
      )}

      {moduloActivo === MODULOS_SISTEMA.SALA && (
        <ModuloSala
          onIrACarta={() => handleCambiarModulo(MODULOS_SISTEMA.CARTA)}
          onIrALiquidacion={() => handleCambiarModulo(MODULOS_SISTEMA.LIQUIDACION)}
        />
      )}

      {moduloActivo === MODULOS_SISTEMA.BARRA && <ModuloBarra />}

      {moduloActivo === MODULOS_SISTEMA.LIQUIDACION && (
        <ModuloLiquidacion
          onVerPlanoSala={() => handleCambiarModulo(MODULOS_SISTEMA.SALA)}
        />
      )}

      {moduloActivo === MODULOS_SISTEMA.CATALOGO && <ModuloCatalogo />}
    </OperacionLayout>
  );
}
