export function formatConsumoPapel(consumoPapel: any): any {
    const {
        rn,
        id,
        cantidad_paquete,
        comentario,
        anio_id,
        sede_id,
        tipoPapel,
        anio,
        mes,
        sede,
        peso,
        ...rest
    } = consumoPapel;

    return {
        rn,
        id,
        nombre: tipoPapel?.nombre ?? "",
        cantidad_paquete,
        comentario: comentario ?? null,
        anio_id,
        sede_id,
        peso: Number(peso.toFixed(2)),
        gramaje: tipoPapel?.gramaje ?? 0,
        anio: anio?.nombre ?? "",
        mes: mes?.nombre ?? "",
        sede: sede?.name ?? "",
        ...rest,
    };
}
