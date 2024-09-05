export function formatFactorEmisionFertilizante(factorEmisionFertilizante: any) {
    const {
        anio,
        ...rest
    } = factorEmisionFertilizante;
    return {
        ...factorEmisionFertilizante,
        anio: anio.nombre,
        created_at: undefined,
        updated_at: undefined,

    };
}
