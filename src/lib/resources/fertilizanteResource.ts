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
