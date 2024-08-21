export interface CreateconsumoAguaProps {
  onClose: () => void;
}

export interface UpdateconsumoAguaProps {
  id: number;
  onClose: () => void;
}

//PARA EL INDEX
export interface consumoAguaCollection {
  id: number;
  area: string;
  codigoMedidor: string;
  fuenteAgua: string; // POZO o RED PUBLICA
  consumo: number;
  mes: string;
  anio: number;
  sede: string;
}

export interface consumoAguaCollection {
  data: consumoAguaCollectionItem[];
  meta: Meta;
}

export interface consumoAguaCollectionItem {
  id: number;
  codigoMedidor: string;
  fuenteAgua: string;
  consumo: number;
  area: string;
  sede: string;
  mes: string;
  anio: string;
}

export interface Meta {
  page: number;
  perPage: number;
  totalPages: number;
  totalRecords: number;
}

//PARA EL SHOW
export interface consumoAguaResource {
  id: number;
  areaId: number;
  codigoMedidor: string;
  consumo: number;
  fuenteAgua: string;
  mes_id: number;
  anio_id: number;
  // sede_id: number;
  created_at: Date;
  updated_at: Date;
  area: ResponseResource;
  mes: ResponseResource;
  anio: ResponseResource;
  // sede: Sede;
}

interface ResponseResource {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}

interface Sede {
  id: number;
  name: string;
}

export interface consumoAguaRequest {
  area_id: number;
  codigoMedidor: string;
  fuenteAgua: string;
  consumo: number;
  mes_id: number;
  //   sede_id: number;
  anio_id: number;
}
