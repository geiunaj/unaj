export function formatConsumoPapelCalculo(consumoPapelCalculo: any) {
    const {
        tipoPapel,
        sede,
        consumo,
        totalGEI,
        ConsumoPapelCalculosDetail,
        ...rest
    } = consumoPapelCalculo;


    const factoresEmision: string[] = ConsumoPapelCalculosDetail.map((detalle: any) => {
        return {anio: detalle.factorTipoPapel.anio.nombre, factor: detalle.factorTipoPapel.factor};
    });

    const factoresEmisionString = factoresEmision.map((detalle: any) => {
        return `${detalle.anio}: ${detalle.factor}`;
    }).join(', ');


    return {
        ...rest,
        tipoPapel: tipoPapel.nombre,
        created_at: undefined,
        updated_at: undefined,
        sede: sede.name,
        consumo: Number(consumo).toFixed(2),
        totalGEI: Number(totalGEI).toFixed(2),
        factoresEmision,
        factoresEmisionString,
    };

}