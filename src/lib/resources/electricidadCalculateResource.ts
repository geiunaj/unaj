export function formatElectricidadCalculo(combustibleCalculo: any) {
    const {
        sede,
        area,
        factor,
        created_at,
        updated_at,
        anioId,
        sedeId,
        areaId,
        ...rest
    } = combustibleCalculo;

    return {
        anioId: undefined,
        sedeId: undefined,
        areaId: undefined,
        created_at: undefined,
        updated_at: undefined,
        ...rest,
        area: area.nombre,
        sede: area.sede.name,
        factorCOS: factor.factorCO2,
        factorCH4: factor.factorCH4,
        factorN2O: factor.factorN2O
    };
}
