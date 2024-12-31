export function formatTaxiFactor(factorTransporteTerrestre: any) {
    const {
        anio,
        ...rest
    } = factorTransporteTerrestre;
    return {
        ...rest,
        anio: anio.nombre,
        created_at: undefined,
        updated_at: undefined,
    };
}

