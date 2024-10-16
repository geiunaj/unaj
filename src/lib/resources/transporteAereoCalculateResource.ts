export function formatTransporteAereoCalculo(transporteAereoCalculo: any) {
    const {
        TransporteAereoCalculosDetail,
        consumo,
        totalGEI,
        sede,
        created_at,
        updated_at,
        ...rest
    } = transporteAereoCalculo;

    const factoresEmision = TransporteAereoCalculosDetail.map((detalle: any) => {
        const factor = (() => {
            switch (detalle.intervalo) {
                case "1600":
                    return detalle.factorEmisionTransporteAereo.factor1600;
                case "1600_3700":
                    return detalle.factorEmisionTransporteAereo.factor1600_3700;
                case "3700":
                    return detalle.factorEmisionTransporteAereo.factor3700;
                default:
                    return "0";
            }
        })();

        return {
            anio: detalle.factorEmisionTransporteAereo.anio.nombre,
            factor,
        };
    });

    const factoresEmisionString = factoresEmision
        .map((detalle: any): any => `${detalle.anio}: ${detalle.factor}`)
        .join(', ');

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
