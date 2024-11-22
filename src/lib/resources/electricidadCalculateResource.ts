export function formatElectricidadCalculo(combustibleCalculo: any) {
    const {
        sede,
        area,
        factor,
        created_at,
        updated_at,
        anioId,
        sedeId,
        areaId, consumoArea, emisionCO2, emisionCH4, emisionN2O, totalGEI, consumoTotal,
        EnergiaCalculosDetail,
        ...rest
    } = combustibleCalculo;

    return {
        EnergiaCalculosDetail: undefined,
        anioId: undefined,
        sedeId: undefined,
        areaId: undefined,
        created_at: undefined,
        updated_at: undefined,
        ...rest,
        consumoArea: parseFloat(consumoArea.toFixed(2)),
        emisionN2O: parseFloat(emisionN2O.toFixed(2)),
        emisionCH4: parseFloat(emisionCH4.toFixed(2)),
        emisionCO2: parseFloat(emisionCO2.toFixed(2)),
        totalGEI: parseFloat(totalGEI.toFixed(2)),
        consumoTotal: parseFloat(consumoTotal.toFixed(2)),
        area: area.nombre,
    };
}
