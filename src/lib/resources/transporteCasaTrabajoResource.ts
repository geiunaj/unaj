export function formatTransporteCasaTrabajo(consumible: any) {
    const {
        created_at,
        updated_at,
        tipoVehiculo,
        mes,
        anio,
        sede,
        rn,
        ...rest
    } = consumible;

    return {
        rn,
        ...rest,
        created_at: undefined,
        updated_at: undefined,
        tipoVehiculo: tipoVehiculo.nombre,
        mes: mes.nombre,
        anio: anio.nombre,
        sede: sede.name,
    };
}
