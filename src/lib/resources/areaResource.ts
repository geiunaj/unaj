export function formatArea(area: any) {
    const {
        ...rest
    } = area;

    return {
        ...rest,
        created_at: undefined,
        updated_at: undefined,
    };
}