export function formatCategoriaActivo(area: any) {
  const { rn, grupoActivo, ...rest } = area;

  return {
    rn,
    ...rest,
    grupo: grupoActivo.nombre,
    created_at: undefined,
    updated_at: undefined,
  };
}
