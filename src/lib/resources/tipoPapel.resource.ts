export function formatTipoPapel(tipoPapel: any): any {

    return {
        ...tipoPapel,
        nombreFiltro: tipoPapel?.nombre + " | " + tipoPapel?.gramaje.toString().toUpperCase() + " - " + tipoPapel?.unidad_paquete.toString().toUpperCase(),
        created_at: undefined,
        updated_at: undefined,
    };
}
