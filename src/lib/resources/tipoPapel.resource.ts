export function formatTipoPapel(tipoPapel: any): any {

    return {
        ...tipoPapel,
        nombreFiltro: tipoPapel?.nombre + " • " + tipoPapel?.gramaje.toString().toUpperCase() + "g • " + tipoPapel?.porcentaje_reciclado.toString() + "%",
        created_at: undefined,
        updated_at: undefined,
    };
}
