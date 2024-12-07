export function formatExtintorCalculo(extintorCalculo: any) {
    const {
        tipoExtintor,
        ExtintorCalculosDetail,
        consumoTotal,
        totalGEI,
        sede,
        created_at,
        updated_at,
        rn,
        ...rest
    } = extintorCalculo;

    const factoresEmision: string[] = ExtintorCalculosDetail.map((detalle: any) => {
        return {
            anio: detalle.factorEmisionExtintor.anio.nombre,
            factor: detalle.factorEmisionExtintor.factor
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
        consumoTotal: Number(consumoTotal.toFixed(2)),
        totalGEI: Number(totalGEI.toFixed(2)),
        sede: sede.name,
        tipoExtintor: tipoExtintor.nombre,
        factoresEmision,
        factoresEmisionString,
    };
}
