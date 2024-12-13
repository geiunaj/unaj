export interface CreateConsumibleProps {
  onClose: () => void;
}

export interface UpdateConsumibleProps {
  id: number;
  onClose: () => void;
}

//PARA EL INDEX
export interface ConsumibleCollection {
  data: ConsumibleCollectionItem[];
  meta: Meta;
}

export interface Meta {
  page: number;
  perPage: number;
  totalPages: number;
  totalRecords: number;
}

export interface ConsumibleCollectionItem {
  id: number;
  tipoConsumibleId: number;
  sedeId: number;
  anioId: number;
  mesId: number;
  anio_mes: number;
  pesoTotal: number;
  tipoConsumible: string;
  categoria: string;
  grupo: string;
  proceso: string;
  unidad: string;
  mes: string;
  anio: string;
  sede: string;
  rn: number;
  File: any;
}

//PARA EL SHOW
export interface ConsumibleResource {
  id: number;
  tipoConsumibleId: number;
  sedeId: number;
  anioId: number;
  mesId: number;
  anio_mes: number;
  pesoTotal: number;
  tipoConsumible: string;
  categoria: string;
  grupo: string;
  proceso: string;
  unidad: string;
  mes: string;
  anio: string;
  sede: string;
}

export interface Anio {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}

export interface Sede {
  id: number;
  name: string;
}

export interface TipoConsumible {
  id: number;
  clase: string;
  nombre: string;
  porcentajeNitrogeno: number;
  unidad: string;
  created_at: Date;
  updated_at: Date;
}

export interface ConsumibleRequest {
  tipoConsumibleId: number;
  sedeId: number;
  anioId: number;
  mesId: number;
  pesoTotal: number;
}
