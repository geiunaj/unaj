export function formatExtintorFactor(factorExtintor: any) {
    const {
        anio,
        ...rest
    } = factorExtintor;
    return {
        ...rest,
        anio: anio.nombre,
        created_at: undefined,
        updated_at: undefined,

    };
}

