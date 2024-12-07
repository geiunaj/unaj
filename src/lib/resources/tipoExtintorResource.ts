export function formatTipoExtintor(area: any) {
    const {rn, ...rest} = area;

    return {
        rn,
        ...rest,
        created_at: undefined,
        updated_at: undefined,
    };
}
