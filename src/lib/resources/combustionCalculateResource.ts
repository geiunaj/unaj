export function formatCombustibleCalculo(combustibleCalculo: any) {
    const {
        tipoCombustible,
        consumo,
        consumoTotal,
        valorCalorico,
        emisionCO2,
        emisionCH4,
        emisionN2O,
        totalGEI,
        sede,
        ...rest
    } = combustibleCalculo;

    return {
        ...rest,
        tipoCombustible: tipoCombustible.nombre,
        unidad: tipoCombustible.unidad,
        cantidad: Number(consumoTotal.toFixed(5)),
        valorCalorico: valorCalorico,
        consumo: Number(consumo.toFixed(5)),
        emisionCO2: Number(emisionCO2.toFixed(5)),
        emisionCH4: Number(emisionCH4.toFixed(5)),
        emisionN2O: Number(emisionN2O.toFixed(5)),
        totalGEI: Number(totalGEI.toFixed(5)),
        sede: sede.name,
        created_at: undefined,
        updated_at: undefined,
    };
}
