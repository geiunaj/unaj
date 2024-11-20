export function formatActivoCalculo(combustibleCalculo: any) {
    const {
        created_at,
        updated_at,
        grupoActivo,
        sede,
        cantidadTotal,
        ActivoCalculosDetail,
        totalGEI,
        rn,
        ...rest
    } = combustibleCalculo;

    const factoresEmision: string[] = ActivoCalculosDetail.map((detalle: any) => {
        return {anio: detalle.factorTipoActivo.anio.nombre, factor: detalle.factorTipoActivo.factor};
    });

    const factoresEmisionString = factoresEmision.map((detalle: any) => {
        return `${detalle.anio}: ${detalle.factor}`;
    }).join(', ');

    return {
        rn,
        ...rest,
        created_at: undefined,
        updated_at: undefined,
        cantidadTotal: cantidadTotal.toFixed(2),
        totalGEI: totalGEI.toFixed(2),
        grupoActivo: grupoActivo.nombre,
        sede: sede.name,
        factoresEmision,
        factoresEmisionString,
    };
}