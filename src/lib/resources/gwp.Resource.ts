export function formatGwp(gwp: any) {
    const { created_at, updated_at, ...rest } = gwp;
    
    return {
        ...rest,   // Incluye todos los demás campos
        created_at: undefined, // Si no necesitas enviar estos campos
        updated_at: undefined,
    };
}
