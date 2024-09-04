export function formatTipoCombustibleFactor(tipoCombustibleFactor: any) {
    const {
        anio,
        tipoCombustible,
        ...rest
    } = tipoCombustibleFactor;
    return {
        ...tipoCombustibleFactor,
        anio: anio.nombre,
        created_at: undefined,
        updated_at: undefined,
        tipoCombustible: tipoCombustible.nombre,

    };
}
