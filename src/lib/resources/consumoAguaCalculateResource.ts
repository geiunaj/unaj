export function formatConsumoAguaCalculo(combustibleCalculo: any) {
    const {
        rn,
        area,
        ConsumoAguaCalculosDetail,
        totalGEI,
        consumo,
        created_at,
        updated_at,
        ...rest
    } = combustibleCalculo;

    const factoresEmision: string[] = ConsumoAguaCalculosDetail.map((detalle: any) => {
        return {anio: detalle.factorEmisionAgua.anio.nombre, factor: detalle.factorEmisionAgua.factor};
    });

    const factoresEmisionString = factoresEmision.map((detalle: any) => {
        return `${detalle.anio}: ${detalle.factor}`;
    }).join(', ');

    return {
        rn,
        areaId: undefined,
        periodoCalculoId: undefined,
        created_at: undefined,
        updated_at: undefined,
        ...rest,
        area: area.nombre,
        consumo: Number(consumo).toFixed(2),
        totalGEI: Number(totalGEI).toFixed(2),
        sede: area.sede.name,
        factoresEmision,
        factoresEmisionString,
    };
}
