export function formatConsumoAguaCalculo(combustibleCalculo: any) {
    const {
        area,
        created_at,
        updated_at,
        ...rest
    } = combustibleCalculo;

    return {
        areaId: undefined,
        periodoCalculoId: undefined,
        created_at: undefined,
        updated_at: undefined,
        ...rest,
        area: area.nombre,
        sede: area.sede.name,
    };
}
