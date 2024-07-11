type TipoFertilizante = {
  id: number;
  nombre: string;
  abreviatura: string;
  unidad: string;
  created_at: Date;
  updated_at: Date;
};

type Sede = {
  id: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
};

type Fertilizante = {
  id: number;
  name: string;
  type_fertilizer: string;
  cantidadFertilizante: number;
  porcentajeN: number;
  sede_id: number;
  created_at: Date;
  updated_at: Date;
  sede?: Sede;
  typeFertilizante?: TipoFertilizante;
};

export function formaFertilizante(fertilizante: any) {
  const {
    created_at,
    updated_at,
    tipoFertilizante,
    anio,
    sede,
    ...rest
  } = fertilizante;

  return {
    ...rest,
    created_at: undefined,
    updated_at: undefined,
    anio_id: undefined,
    sede_id: undefined,
    tipoFertilizante_id: undefined,
    anio: Number(anio?.nombre),
    sede: sede?.name,
    tipoFertilizante: tipoFertilizante?.nombre,
  };
}