export function formatElectricidad(electricidad: any) {
  const { created_at, updated_at, anio, sede, area, mes, ...rest } =
    electricidad;

  return {
    ...rest,

    created_at: undefined,
    updated_at: undefined,
    anio_id: undefined,
    sede_id: undefined,
    mes_id: undefined,
    areaId: undefined,

    area: area.nombre,
    sede: sede.name,
    mes: mes.nombre,
    anio: anio.nombre,


  };
}
