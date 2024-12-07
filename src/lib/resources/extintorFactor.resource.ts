export function formatExtintorFactor(factorExtintor: any) {
    const {
        anio,
        tipo,
        ...rest
    } = factorExtintor;
    return {
        ...rest,
        anio: anio.nombre,
        tipoExtintor: tipo.nombre,
        created_at: undefined,
        updated_at: undefined,
    };
}

