export function formatTipoConsumible(area: any) {
    const {
        descripcion,
        categoria,
        grupo,
        proceso,
        ...rest
    } = area;

    return {
        ...rest,
        created_at: undefined,
        updated_at: undefined,
        descripcion: descripcion.descripcion,
        categoria: categoria.nombre,
        grupo: grupo.nombre,
        proceso: proceso.nombre,
    };
}