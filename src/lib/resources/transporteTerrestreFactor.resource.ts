export function formatTransporteTerrestreFactor(factorTransporteTerrestre: any) {
    const {
        anio,
        ...rest
    } = factorTransporteTerrestre;
    return {
        ...factorTransporteTerrestre,
        anio: anio.nombre,
        created_at: undefined,
        updated_at: undefined,

    };
}

