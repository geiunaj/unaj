export function formatTransporteAereo(taxi: any): any {
    const {
        rn,
        id,
        kmRecorrido,
        fechaSalida,
        fechaRegreso,
        anio_id,
        mes_id,
        sede_id,
        created_at,
        updated_at,
        anio,
        mes,
        sede,
        ...rest
    } = taxi;

    return {
        rn,
        id,
        kmRecorrido,
        fechaSalida: fechaSalida ? new Date(fechaSalida).toISOString().split("T")[0] : null,
        fechaRegreso: fechaRegreso ? new Date(fechaRegreso).toISOString().split("T")[0] : null,
        created_at: undefined,
        updated_at: undefined,
        mes: mes?.nombre ?? "",
        anio: anio?.nombre ?? "",
        sede: sede?.name ?? "",
        ...rest,
        anio_id,
        sede_id,
        mes_id,
    };
}
