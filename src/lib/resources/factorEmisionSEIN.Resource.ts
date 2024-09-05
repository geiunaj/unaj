export function formatfactorEmisionSEIN(factorEmisionSEIN: any) {
    const {
        anio,
        ...rest
    } = factorEmisionSEIN;
    return {
        ...factorEmisionSEIN,
        anio: anio.nombre,
        created_at: undefined,
        updated_at: undefined,

    };
}
