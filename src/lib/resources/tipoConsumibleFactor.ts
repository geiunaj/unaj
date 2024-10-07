export function formatTipoConsumibleFactor(tipoCombustibleFactor: any) {
    const {
        anio,
        tipoConsumible,
        ...rest
    } = tipoCombustibleFactor;
    return {
        ...tipoCombustibleFactor,
        created_at: undefined,
        updated_at: undefined,
        anio: anio.nombre,
        tipoConsumible: tipoConsumible.nombre,

    };
}
