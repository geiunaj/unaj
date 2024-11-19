export function formatTipoActivo(area: any) {
  const { rn,categoria, ...rest } = area;

  return {
    rn,
    ...rest,
    created_at: undefined,
    updated_at: undefined,
    categoria: categoria.nombre,
  };
}
