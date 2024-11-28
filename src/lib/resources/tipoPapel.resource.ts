export function formatTipoPapel(tipoPapel: any): any {

    return {
        ...tipoPapel,
        nombreFiltro: tipoPapel?.nombre,
        created_at: undefined,
        updated_at: undefined,
    };
}
