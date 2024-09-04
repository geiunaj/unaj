export function formatConsumoAguaCalculo(combustibleCalculo: any) {
    const {
        area,
        ConsumoAguaCalculosDetail,
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
        areaId: undefined,
        periodoCalculoId: undefined,
        created_at: undefined,
        updated_at: undefined,
        ...rest,
        area: area.nombre,
        sede: area.sede.name,
        factoresEmision,
        factoresEmisionString,
    };
}
