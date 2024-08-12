export function formatFertilizante(tipoFertilizante: any): any {

    return {
        ...tipoFertilizante,
        created_at: undefined,
        updated_at: undefined,
    };
}
