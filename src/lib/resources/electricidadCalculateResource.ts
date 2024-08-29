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
        area: area.nombre,
    };
}
