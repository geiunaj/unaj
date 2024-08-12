export function formatTipoCombustible(tipoCombustible: any): any {

    return {
        ...tipoCombustible,
        created_at: undefined,
        updated_at: undefined,
    };
}
