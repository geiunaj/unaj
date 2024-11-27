export function formatRol(area: any) {
    const {
        access,
        ...rest
    } = area;

    return {
        permisos: access.map((permiso: any) => permiso.menu),
        ...rest,
        created_at: undefined,
        updated_at: undefined,
    };
}