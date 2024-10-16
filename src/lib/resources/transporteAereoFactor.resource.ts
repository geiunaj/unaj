export function formatTransporteAereoFactor(factorTransporteAereo: any) {
    const {
        anio,
        ...rest
    } = factorTransporteAereo;
    return {
        ...factorTransporteAereo,
        anio: anio.nombre,
        created_at: undefined,
        updated_at: undefined,

    };
}

