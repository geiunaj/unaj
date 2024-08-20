export function formatArea(area: any) {
    const {
        sede,
        ...rest
    } = area;

    return {
        ...rest,
        created_at: undefined,
        updated_at: undefined,
        sede: sede.name,
    };
}