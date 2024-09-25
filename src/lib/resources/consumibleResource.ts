export function formatConsumible(consumible: any) {
    const {
        created_at,
        updated_at,
        tipoConsumible,
        mes,
        anio,
        sede,
        pesoTotal,
        ...rest
    } = consumible;

    return {
        ...rest,
        created_at: undefined,
        updated_at: undefined,
        pesoTotal: pesoTotal.toFixed(3),
        tipoConsumible: tipoConsumible.nombre,
        descripcion: tipoConsumible.descripcion.nombre,
        categoria: tipoConsumible.categoria.nombre,
        grupo: tipoConsumible.grupo.nombre,
        proceso: tipoConsumible.proceso.nombre,
        unidad: tipoConsumible.unidad,
        mes: mes.nombre,
        anio: anio.nombre,
        sede: sede.name,
    };
}
