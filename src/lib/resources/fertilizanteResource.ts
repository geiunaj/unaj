export function formaFertilizante(fertilizante: any) {
    const {created_at, updated_at, tipoFertilizante, anio, sede, is_ficha, ...rest} =
        fertilizante;

    return {
        ...rest,
        created_at: undefined,
        updated_at: undefined,
        anio_id: undefined,
        sede_id: undefined,
        tipoFertilizante_id: undefined,
        anio: Number(anio?.nombre),
        sede: sede?.name,
        is_ficha: is_ficha ? "Si" : "No",
        unidad: tipoFertilizante?.unidad,
        clase: tipoFertilizante?.clase,
        tipoFertilizante: tipoFertilizante?.nombre,
        porcentajeNit: tipoFertilizante?.porcentajeNitrogeno,
    };
}
