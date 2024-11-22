export function formatExtintor(taxi: any): any {
    const {
        rn,
        id,
        anio_id,
        mes_id,
        sede_id,
        created_at,
        updated_at,
        anio,
        mes,
        sede,
        consumo,
        ...rest
    } = taxi;

    return {
        rn,
        id,
        consumo: consumo.toFixed(2),
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
