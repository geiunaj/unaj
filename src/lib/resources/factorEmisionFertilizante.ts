export function formatFactorEmisionFertilizante(factorEmisionFertilizante: any) {
    const {
        anio,
        tipoFertilizante,
        ...rest
    } = factorEmisionFertilizante;
    return {
        ...factorEmisionFertilizante,
        anio: anio.nombre,
        created_at: undefined,
        updated_at: undefined,
        tipoFertilizante: tipoFertilizante.nombre,
        clase: tipoFertilizante.clase,
    };
}
