export interface ActivoFactor {
  id: number;
  nombre: string;
  valor: number;
  created_at: Date;
  updated_at: Date;
}

export interface ActivoFactorRequest {
  factor: number;
  grupoActivoId: number;
  anioId: number;
  fuente?: string;
  link?: string;
}

interface Meta {
  page: number;
  perPage: number;
  totalRecords: number;
  totalPages: number;
}

export interface ActivoFactorCollectionPaginate {
  data: ActivoFactorCollection[];
  meta: Meta;
}

export interface ActivoFactorCollection {
  id: number;
  factor: number;
  tipoActivoId: number;
  anioId: number;
  fuente: string;
  link: string;
  anio: string;
  tipoActivo: string;
}

export interface ActivoFactorResource {
  id: number;
  clase: string;
  nombre: string;
  porcentajeNitrogeno: number;
  unidad: string;
}

export interface CreateActivoFactorProps {
  onClose: () => void;
}

export interface UpdateActivoFactorProps {
  onClose: () => void;
  id: number;
}
