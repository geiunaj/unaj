export function formatTipoVehiculoFactor(tipoCombustibleFactor: any) {
    const {anio, tipoVehiculo, ...rest} = tipoCombustibleFactor;
    return {
        ...rest,
        created_at: undefined,
        updated_at: undefined,
        anio: anio.nombre,
        tipoVehiculo: tipoVehiculo.nombre,
    };
}
