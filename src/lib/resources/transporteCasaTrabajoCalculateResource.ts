export function formatTransporteCasaTrabajoCalculo(combustibleCalculo: any) {
    const {
        created_at,
        updated_at,
        sede,
        kmRecorrido,
        CasaTrabajoCalculosDetail,
        tipoVehiculo,
        totalGEI,
        rn,
        ...rest
    } = combustibleCalculo;

    const factoresEmision: string[] = CasaTrabajoCalculosDetail.map((detalle: any) => {
        return {
            anio: detalle.factorCasaTrabajo.anio.nombre,
            factor: detalle.factorCasaTrabajo.factor
        };
    });

    const factoresEmisionString = factoresEmision.map((detalle: any) => {
        return `${detalle.anio}: ${detalle.factor}`;
    }).join(', ');

    return {
        rn,
        ...rest,
        created_at: undefined,
        updated_at: undefined,
        cantidadTotal: kmRecorrido.toFixed(2),
        totalGEI: totalGEI.toFixed(2),
        tipoVehiculo: tipoVehiculo.nombre,
        sede: sede.name,
        factoresEmision,
        factoresEmisionString,
    };
}