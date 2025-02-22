export function formatTaxi(taxi: any): any {
  const {
    id,
    unidadContratante,
    lugarSalida,
    lugarDestino,
    montoGastado,
    kmRecorrido,
    anio_id,
    mes_id,
    sede_id,
    created_at,
    updated_at,
    anio,
    mes,
    sede,
    ...rest
  } = taxi;

  return {
    id,
    unidadContratante,
    lugarSalida,
    lugarDestino,
    montoGastado,
    kmRecorrido,
    anio_id,
    sede_id,
    mes_id,
    created_at,
    updated_at,
    ...rest,
    mes: mes?.nombre ?? "",
    anio: anio?.nombre ?? "",
    sede: sede?.name ?? "",
  };
}
