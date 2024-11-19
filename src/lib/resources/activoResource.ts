export function formatActivo(consumible: any) {
    const {
        created_at,
        updated_at,
        tipoActivo,
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
        tipoActivo: tipoActivo.nombre,
        descripcion: tipoActivo.descripcion.nombre,
        categoria: tipoActivo.categoria.nombre,
        grupo: tipoActivo.grupo.nombre,
        proceso: tipoActivo.proceso.nombre,
        unidad: tipoActivo.unidad,
        mes: mes.nombre,
        anio: anio.nombre,
        sede: sede.name,
    };
}
