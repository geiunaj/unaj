export function formatTipoActivoFactor(tipoCombustibleFactor: any) {
    const {anio, grupoActivo, ...rest} = tipoCombustibleFactor;
    return {
        ...rest,
        created_at: undefined,
        updated_at: undefined,
        anio: anio.nombre,
        tipoActivo: grupoActivo.nombre,
    };
}