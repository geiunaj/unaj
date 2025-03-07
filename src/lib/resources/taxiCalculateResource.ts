export function formatTaxiCalculo(combustibleCalculo: any) {
    const {TaxiCalculosDetail, sede, consumo, totalGEI, created_at, updated_at, ...rest} = combustibleCalculo;

    const factoresEmision: string[] = TaxiCalculosDetail.map((detalle: any) => {
        return {anio: detalle.factorEmision.anio.nombre, factor: detalle.factorEmision.factor};
    });

    const factoresEmisionString = factoresEmision.map((detalle: any) => {
        return `${detalle.anio}: ${detalle.factor}`;
    }).join(', ');

    return {
        created_at: undefined,
        updated_at: undefined,
        ...rest,
        sede: sede.name,
        consumo: consumo.toFixed(2),
        totalGEI: totalGEI.toFixed(2),
        factoresEmision,
        factoresEmisionString,
    };
}
