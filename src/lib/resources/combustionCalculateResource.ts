export function formatCombustibleCalculo(combustibleCalculo: any) {
    const {
        tipoCombustible,
        consumo,
        consumoTotal,
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
        cantidad: Number(consumoTotal.toFixed(2)),
        consumo: Number(consumo.toFixed(2)),
        emisionCO2: Number(emisionCO2.toFixed(2)),
        emisionCH4: Number(emisionCH4.toFixed(2)),
        emisionN2O: Number(emisionN2O.toFixed(2)),
        totalGEI: Number(totalGEI.toFixed(2)),
        sede: sede.name,
        created_at: undefined,
        updated_at: undefined,
    };
}