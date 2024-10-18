export function formatTransporteTerrestreCalculo(transporteTerrestreCalculo: any) {
    const {
        TransporteTerrestreCalculosDetail,
        consumo,
        totalGEI,
        sede,
        created_at,
        updated_at,
        ...rest
    } = transporteTerrestreCalculo;

    const factoresEmision: string[] = TransporteTerrestreCalculosDetail.map((detalle: any) => {
        return {
            anio: detalle.factorEmisionTransporteTerrestre.anio.nombre,
            factor: detalle.factorEmisionTransporteTerrestre.factor
        };
    });

    const factoresEmisionString = factoresEmision.map((detalle: any) => {
        return `${detalle.anio}: ${detalle.factor}`;
    }).join(', ');

    return {
        created_at: undefined,
        updated_at: undefined,
        consumo: Number(consumo.toFixed(2)),
        totalGEI: Number(totalGEI.toFixed(2)),
        ...rest,
        sede: sede.name,
        factoresEmision,
        factoresEmisionString,
    };
}
