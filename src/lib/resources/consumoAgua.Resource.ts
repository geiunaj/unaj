export function formatConsumoAgua(consumoAgua: any) {
    const {created_at, updated_at, anio, sede, area, mes, ...rest} =
        consumoAgua;

    return {
        ...rest,

        created_at: undefined,
        updated_at: undefined,
        anio_id: undefined,
        //   sede_id: undefined,
        mes_id: undefined,
        areaId: undefined,

        area: area.nombre,
        sede: area.sede.name,
        mes: mes.nombre,
        anio: anio.nombre,
    };
}
