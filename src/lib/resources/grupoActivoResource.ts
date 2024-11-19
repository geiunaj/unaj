export function formatGrupoActivo(area: any) {
  const { rn, ...rest } = area;

  return {
    rn: rn,
    ...rest,
    created_at: undefined,
    updated_at: undefined,
  };
}
