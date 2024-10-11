export function formatTaxiCalculo(combustibleCalculo: any) {
    const {TaxiCalculosDetail, sede, created_at, updated_at, ...rest} = combustibleCalculo;

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
        factoresEmision,
        factoresEmisionString,
    };
}
