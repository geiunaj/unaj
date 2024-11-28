export function formatTipoPapelFactor(tipoCombustibleFactor: any) {
    const {anio, tipoPapel, ...rest} = tipoCombustibleFactor;
    return {
        ...rest,
        created_at: undefined,
        updated_at: undefined,
        anio: anio.nombre,
        tipoPapel: tipoPapel.nombre,
    };
}
