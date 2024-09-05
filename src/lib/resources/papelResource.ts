export function formatConsumoPapel(consumoPapel: any): any {
    const {
        id,
        cantidad_paquete,
        comentario,
        anio_id,
        sede_id,
        tipoPapel,
        anio,
        sede,
    } = consumoPapel;

    return {
        id,
        nombre: tipoPapel?.nombre ?? "",
        cantidad_paquete,
        comentario: comentario ?? null,
        anio_id,
        sede_id,
        gramaje: tipoPapel?.gramaje ?? 0,
        unidad_paquete: tipoPapel?.unidad_paquete ?? "",
        porcentaje_reciclado: tipoPapel?.porcentaje_reciclado ?? 0,
        nombre_certificado: tipoPapel?.nombre_certificado ?? "",
        anio: anio?.nombre ?? "",
        sede: sede?.name ?? "",
    };
}
