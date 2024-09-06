export function formatConsumoPapelCalculo(consumoPapelCalculo: any) {
    const {
        tipoPapel,
        ...rest
    } = consumoPapelCalculo;

    return {
        ...rest,
        tipoPapel: tipoPapel.nombre,
        porcentajeReciclado: tipoPapel.porcentaje_reciclado,
        porcentajeVirgen: tipoPapel.porcentaje_virgen,
        factorReciclado: tipoPapel.factor_reciclado,
        factorVirgen: tipoPapel.factor_virgen,
        created_at: undefined,
        updated_at: undefined,
        sede: undefined,
    };

}
