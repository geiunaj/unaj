export function formatActivo(consumible: any) {
    const {
        created_at,
        updated_at,
        tipoActivo,
        mes,
        anio,
        sede,
        costoTotal,
        consumoTotal,
        rn,
        ...rest
    } = consumible;

    return {
        rn,
        ...rest,
        created_at: undefined,
        updated_at: undefined,
        costoTotal: costoTotal.toFixed(3),
        consumoTotal: consumoTotal.toFixed(3),
        tipoActivo: tipoActivo.nombre,
        categoria: tipoActivo.categoria.nombre,
        unidad: tipoActivo.unidad,
        mes: mes.nombre,
        anio: anio.nombre,
        sede: sede.name,
    };
}
